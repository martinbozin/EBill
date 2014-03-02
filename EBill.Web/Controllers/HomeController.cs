using EBills.Domain;
using EBills.Web.Controllers.Shared.Base;
using System.Web.Mvc;

namespace EBills.Web.Controllers
{
    [Authorize]
    public class HomeController : AppControllerBase
    {
        [HttpGet]
        public ActionResult Index()
        {
            var backendUser = CurrentUser;
            if (backendUser != null)
            {
                if (CurrentPrincipal.IsInRole(Roles.SuperAdmin))
                {
                    return RedirectToAction("Index", "Registers", new { area = "SuperAdmin" });
                }
                if (CurrentPrincipal.IsInRole(Roles.Admin))
                {
                    return RedirectToAction("Index", "Users", new { area = "Admin" });
                }
 
            }

            return RedirectToAction("Index", "Home", new { area = "Public" });
        }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult Localization()
        {
            var s = Martin.ResourcesCommon.ResourceManager.GetJSResourceValues();
            return Content(s, "text/javascript");
        }
    }
}
