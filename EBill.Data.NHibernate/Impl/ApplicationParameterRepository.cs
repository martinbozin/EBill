using EBills.Data.NHibernate.NHibernate;
using EBills.Domain;
using EBills.Domain.Data;
using NHibernate.Linq;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EBills.Data.NHibernate.Impl
{
    public class ApplicationParameterRepository : NHRepository<ApplicationParameter>, IApplicationParameterRepository
    {
        /// <summary>
        /// Ги зема сите валидни параметри во моментов
        /// </summary>
        /// <returns>Листа на параметри</returns>
        public IEnumerable<ApplicationParameter> GetAllValid()
        {
            return
                Session.Query<ApplicationParameter>()
                .Where(x =>
                    (x.ParameterValidUntil != null && (x.ParameterValidFrom <= DateTime.Now && DateTime.Now < x.ParameterValidUntil))
                    || (x.ParameterValidUntil == null && (x.ParameterValidFrom <= DateTime.Now)))
                .ToList();
        }

       /// <summary>
        /// // Метод за добивање на сите апликациски вредности за даден параметар
       /// </summary>
       /// <param name="parameterName"></param>
       /// <returns></returns>
        public IEnumerable<ApplicationParameter> GetAllForParameterName(string parameterName)
        {
            return
                Session.Query<ApplicationParameter>()
               .Where(x => x.ParameterName == parameterName)
               .OrderBy(x => x.ParameterValidFrom)
                .ToList();

        }

        public ApplicationParameter GetByName(string parameterName)
        {
            var appParams = GetAllValid();
            var appParam = appParams.FirstOrDefault(x => x.ParameterName == parameterName);
            return appParam;
        }
    }
}
