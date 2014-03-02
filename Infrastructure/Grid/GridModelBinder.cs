using System.Web.Mvc;

namespace EBills.Infrastructure.Grid
{
    public class GridModelBinder : IModelBinder
    {
        #region IModelBinder Members

        public object BindModel(ControllerContext controllerContext, ModelBindingContext bindingContext)
        {
            try
            {
                var request = controllerContext.HttpContext.Request;
                var grdParms = new GridSettings
                {
                    IsSearch = bool.Parse(request["_search"] ?? "false"),
                    PageIndex = int.Parse(request["page"] ?? "1"),
                    PageSize = int.Parse(request["rows"] ?? "10"),
                    SortColumn = request["sidx"] ?? "",
                    SortOrder = request["sord"] ?? "asc"
                };

                if (request["_search"] == "true" && request["searchField"] != null)
                {
                    var advFilters = string.Format("{{\"groupOp\":\"AND\",\"rules\":[{{\"field\":\"{0}\",\"op\":\"{1}\",\"data\":\"{2}\"}}]}}", request["searchField"], request["searchOper"], request["searchString"]);
                    grdParms.Where = JqGridFilter.Create(advFilters);
                }
                else
                {
                    grdParms.Where = JqGridFilter.Create(request["filters"] ?? "");
                }

                return grdParms;
            }
            catch
            {
                return null;
            }
        }

        #endregion
    }
}
