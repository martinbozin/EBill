using EBills.Domain;
using EBills.Security;
using EBills.Web.Controllers.Shared.Base;
using System.Web.Mvc;

namespace EBills.Web.Areas.SuperAdmin.Controllers
{
    /// <summary>
    /// Localization Controller
    /// </summary>
    //[CustomAuthorize(AuthorizedRoles = new[] { Roles.ZelsAdministrator })]
    public class LocalizationController : AppControllerBase
    {
        /// <summary>
        /// Load Registers View
        /// </summary>
        ///<returns></returns>
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }
    }
}