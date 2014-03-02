using EBills.Domain;
using EBills.Security;
using EBills.Web.Controllers.Shared.Base;
using System.Web.Mvc;

namespace EBills.Web.Areas.SuperAdmin.Controllers
{

    public class HomeController : AppControllerBase
    {
        /// <summary>
        /// Load Index View
        /// </summary>
        ///<returns></returns>
        [HttpGet]
        public ActionResult Index()
        {
            return RedirectToAction("Index", "Users", new { area = "SuperAdmin" });
        }
    }
}
