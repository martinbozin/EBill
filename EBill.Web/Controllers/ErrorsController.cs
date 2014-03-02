using System;
using System.Web;
using System.Web.Mvc;

namespace EBills.Web.Controllers
{
    public class NotFoundModel : HandleErrorInfo
    {
        public NotFoundModel(Exception exception, string controllerName, string actionName)
            : base(exception, controllerName, actionName)
        {
        }
        public string RequestedUrl { get; set; }
        public string ReferrerUrl { get; set; }
    }

    public class ErrorsController : Controller
    {
        [HttpGet]
        public ActionResult NotFound(string url)
        {
            var originalUri = url ?? Request.QueryString["aspxerrorpath"] ?? Request.Url.OriginalString;
            var controllerName = (string)RouteData.Values["controller"];
            var actionName = (string)RouteData.Values["action"];
            var model = new NotFoundModel(new HttpException(404, "Failed to find page"), controllerName, actionName)
            {
                RequestedUrl = originalUri,
                ReferrerUrl = Request.UrlReferrer == null ? "" : Request.UrlReferrer.OriginalString
            };
            Response.StatusCode = 404;
            return View("NotFound", model);
        }

        [HttpGet]
        public ActionResult Unknown()
        {
            Exception ex = null;

            try
            {
                ex = (Exception)HttpContext.Application[Request.UserHostAddress.ToString()];
            }
            catch
            {
            }

            if (ex != null)
            {
                ViewData["Description"] = ex.Message;
            }
            else
            {
                ViewData["Description"] = "An error occurred.";
            }

            ViewData["Title"] = "Oops. We're sorry. An error occurred and we're on the case.";

            return View("Unknown");
        }

        [HttpGet]
        public ActionResult Unauthorized()
        {
            return View("Unauthorized");
        }

    }
}
