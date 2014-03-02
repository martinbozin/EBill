using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace EBills.Infrastructure.Grid
{
    public static class JqGridHelper
    {
        public static IList<TViewModel> GetGridResult<TModel, TViewModel>(
            IQueryable<TModel> query,
            Func<string, string> getDomainFieldFor,
            Func<TModel, TViewModel> mapToViewModel,
            GridSettings gridQuery
            )
        {
            //filtering
            query = ListAddSearchQuery(query, getDomainFieldFor, gridQuery);

            //count
            gridQuery.Totalrecords = query.Count();

            //sorting
            query = query.OrderBy(getDomainFieldFor(gridQuery.SortColumn), gridQuery.SortOrder);

            //paging
            var data = query
                .Skip((gridQuery.PageIndex - 1) * gridQuery.PageSize)
                .Take(gridQuery.PageSize)
                .ToList();

            //map to view model
            var result = new List<TViewModel>();
            result.AddRange(data.Select(mapToViewModel));
            return result;
        }

        #region HELPERS

        private static IQueryable<TModel> ListAddSearchQuery<TModel>(IQueryable<TModel> query, Func<string, string> getDomainFieldFor, GridSettings gridQuery)
        {
            if (gridQuery.Where != null)
            {
                if (gridQuery.Where.GroupOp == "AND")
                {
                    foreach (var rule in gridQuery.Where.Rules)
                    {
                        query = query.Where(getDomainFieldFor(rule.Field), rule.Data, rule.Op);
                    }
                }
                else if (gridQuery.Where.GroupOp == "OR")
                {
                    var temp = (new List<TModel>()).AsQueryable();

                    foreach (var rule in gridQuery.Where.Rules)
                    {
                        var t = query.Where(getDomainFieldFor(rule.Field), rule.Data, rule.Op);
                        temp = temp.Concat(t);
                    }

                    //remove repeat records
                    query = temp.Distinct();
                }
            }

            return query;
        }

        //public static object ChangeType(object value, Type type)
        //{

        //    Type conversionType = type;

        //    if (conversionType.IsGenericType && conversionType.GetGenericTypeDefinition().Equals(typeof(Nullable<>)))
        //    {

        //        if (value == null)
        //        {

        //            return null;

        //        }

        //        else
        //        {
        //            NullableConverter nullableConverter = new NullableConverter(conversionType);

        //            conversionType = nullableConverter.UnderlyingType;

        //        }

        //    }

        //    return Convert.ChangeType(value, conversionType);

        //}

        public static IQueryable<T> Where<T>(this IQueryable<T> query, string column, object value, string operation)
        {
            if (string.IsNullOrEmpty(column))
                return query;

            var parameter = Expression.Parameter(query.ElementType, "p");

            var memberAccess = column.Split('.')
                .Aggregate<string, MemberExpression>(null, (current, property) =>
                    Expression.Property(current ?? (parameter as Expression), property));

            ConstantExpression filter;
            if (memberAccess.Type.IsEnum)
            {
                var obj = Enum.Parse(memberAccess.Type, value.ToString());
                filter = Expression.Constant(obj);
            }
            else
            {
                //filter = Expression.Constant(
                //    Convert.ChangeType(value, memberAccess.Type)
                //    );

                //filter = Expression.Constant(JqGridHelper.ChangeType(value, memberAccess.Type));

                var t = memberAccess.Type;
                string s = value.ToString();
                object d;

                if (t.IsGenericType && t.GetGenericTypeDefinition() == typeof(Nullable<>))
                {
                    if (String.IsNullOrEmpty(s))
                        d = null;
                    else
                        d = Convert.ChangeType(s, t.GetGenericArguments()[0]);
                }
                else
                {
                    d = Convert.ChangeType(s, t);
                }


                filter = Expression.Constant(d);
            }

            Expression condition;
            LambdaExpression lambda;

            ConstantExpression _rightSide;
            switch (operation)
            {
                case "bw": // begins with
                    condition = Expression.Call(
                            memberAccess,
                            typeof(string).GetMethod("StartsWith", new[] { typeof(string) }),
                            Expression.Constant(value.ToString()));

                    lambda = Expression.Lambda(condition, parameter);
                    break;

                case "ne": // not equal
                    lambda = Expression.Lambda(Expression.NotEqual(memberAccess, filter), parameter);
                    break;

                case "cn": // contains
                    condition = Expression.Call(memberAccess,
                            typeof(string).GetMethod("Contains"),
                            Expression.Constant(value.ToString()));
                    lambda = Expression.Lambda(condition, parameter);
                    break;

                case "gt": // greater than
                    condition = Expression.GreaterThan(memberAccess, filter);
                    lambda = Expression.Lambda(condition, parameter);
                    break;

                case "gte": //greather than equal
                    condition = Expression.GreaterThanOrEqual(memberAccess, filter);
                    lambda = Expression.Lambda(condition, parameter);
                    break;

                case "lt": //less than 
                    condition = Expression.LessThan(memberAccess, filter);
                    lambda = Expression.Lambda(condition, parameter);
                    break;

                case "lte": //less than equal
                    condition = Expression.LessThanOrEqual(memberAccess, filter);
                    lambda = Expression.Lambda(condition, parameter);
                    break;

                case "int?:eq": //nullable int eq
                    _rightSide = Expression.Constant(Convert.ToInt32(value), typeof(int?));
                    lambda = Expression.Lambda(Expression.Equal(memberAccess, _rightSide), parameter);
                    break;
                case "date:eq": // date eq
                    var parsedDate = Convert.ToDateTime(value);
                    var antes = Expression.GreaterThanOrEqual(memberAccess, Expression.Constant(parsedDate.Date, typeof(DateTime)));
                    var despues = Expression.LessThan(memberAccess, Expression.Constant(parsedDate.AddDays(1).Date, typeof(DateTime)));
                    lambda = Expression.Lambda(Expression.AndAlso(antes, despues), parameter);
                    break;
                case "date?:eq": //nullable date eq
                    _rightSide = Expression.Constant(Convert.ToDateTime(value), typeof(DateTime?));
                    lambda = Expression.Lambda(Expression.Equal(memberAccess, _rightSide), parameter);
                    break;
                case "date?:gte": //greather than equal
                    _rightSide = Expression.Constant(Convert.ToDateTime(value), typeof(DateTime?));
                    lambda = Expression.Lambda(Expression.GreaterThanOrEqual(memberAccess, _rightSide), parameter);
                    break;
                case "date?:lte": //less than equal
                    _rightSide = Expression.Constant(Convert.ToDateTime(value), typeof(DateTime?));
                    lambda = Expression.Lambda(Expression.LessThanOrEqual(memberAccess, _rightSide), parameter);
                    break;
                default: //eq                    
                    lambda = Expression.Lambda(Expression.Equal(memberAccess, filter), parameter);
                    break;

            }

            var result = Expression.Call(
                   typeof(Queryable), "Where",
                   new[] { query.ElementType },
                   query.Expression,
                   lambda);

            return query.Provider.CreateQuery<T>(result);
        }

        public static IQueryable<T> OrderBy<T>(this IQueryable<T> query, string sortColumn, string direction)
        {
            if (string.IsNullOrEmpty(sortColumn))
                return query;

            var methodName = string.Format("OrderBy{0}",
                direction.ToLower() == "asc" ? "" : "descending");

            var parameter = Expression.Parameter(query.ElementType, "p");

            var memberAccess = sortColumn.Split('.')
                .Aggregate<string, MemberExpression>(null, (current, property) =>
                    Expression.Property(current ?? (parameter as Expression), property));

            var orderByLambda = Expression.Lambda(memberAccess, parameter);

            var result = Expression.Call(
                      typeof(Queryable),
                      methodName,
                      new[] { query.ElementType, memberAccess.Type },
                      query.Expression,
                      Expression.Quote(orderByLambda));

            return query.Provider.CreateQuery<T>(result);
        }

        #endregion
    }
}
