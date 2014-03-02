using EBills.Domain;
using EBills.Security;
using EBills.Web.Controllers.Shared.Base;
using System.Web.Mvc;

namespace EBills.Web.Areas.Admin.Controllers
{
    /// <summary>
    /// Users Controller
    /// </summary>
    [CustomAuthorize(AuthorizedRoles = new[]
                                           {
                                               Roles.SuperAdmin
                                           })]
    public class UsersController : AppControllerBase
    {
        /// <summary>
        /// Load Users View
        /// </summary>
        ///<returns></returns>
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }
    }
}