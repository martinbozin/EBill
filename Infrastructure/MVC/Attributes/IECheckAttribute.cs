using System.Web.Mvc;

namespace EBills.Infrastructure.MVC.Attributes
{
    public class IECheckAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var request = filterContext.HttpContext.Request;
            var session = filterContext.HttpContext.Session;
            if (session == null) return;

            //za da ne proveruvame 1 milion pati na prviot request, 
            //zapisuvame vo sesija
            if (session["browserChecked"] != null)
                return;

            session["browserChecked"] = true;

            //ako dojde od ie 6 ili 7 go nosime na nova stranica kade moze da si prezeme 
            //popameten browser
            if (request.Browser.Type.ToUpper().Contains("IE"))
            {
                if (request.Browser.MajorVersion < 8)
                {
                    filterContext.Result = new RedirectResult("~/UpgradeBrowser");
                }
            }
        }
    }

}
