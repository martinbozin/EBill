using EBills.Domain;
using EBills.Domain.Data;
using EBills.Security;
using EBills.Web.Controllers.Shared.Base;
using Microsoft.Practices.ServiceLocation;
using System.Linq;
using System.Web.Mvc;

namespace EBills.Web.Areas.Public.Controllers
{
    //[CustomAuthorize(AuthorizedRoles = new[] { Roles.PublicUsers })]
    public class HomeController : AppControllerBase
    {
        [HttpGet]
        public ActionResult Index()
        {
            //var requestRepository = ServiceLocator.Current.GetInstance<IRequestRepository>();
            //var requestsCount = requestRepository.Query().Count(x => x.AuditInfo.CreatedBy.Id == CurrentUser.Id);
            ////if (requestsCount > 0)
            ////{
            //return RedirectToAction("Index", "Requests", new { area = "Public" });
            ////}
            return View();
            return null;
        }

    }
}
