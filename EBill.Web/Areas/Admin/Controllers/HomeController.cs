using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using EBills.Domain;
using EBills.Security;
using EBills.Web.Controllers.Shared.Base;

namespace EBills.Web.Areas.Admin.Controllers
{
     [CustomAuthorize(AuthorizedRoles = new[] { 
        Roles.SuperAdmin,
    })]
    public class HomeController : AppControllerBase
    {
        //
        // GET: /Admin/Home/

        public ActionResult Index()
        {
            if (CurrentPrincipal.IsInRole(Roles.SuperAdmin))
            {
                return RedirectToAction("Index", "Users", new { area = "Admin" });
            }

            //return RedirectToAction("Index", "Requests", new { area = "Admin" });
            return null;
        }

    }
}
