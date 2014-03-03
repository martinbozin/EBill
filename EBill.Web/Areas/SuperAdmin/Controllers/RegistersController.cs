using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using EBills.Domain;
using EBills.Security;
using EBills.Web.Controllers.Shared.Base;

namespace EBills.Web.Areas.SuperAdmin.Controllers
{
    [CustomAuthorize(AuthorizedRoles = new[] { Roles.SuperAdmin })]
    public class RegistersController : AppControllerBase
    {
        /// <summary>
        /// Load Registers View
        /// </summary>
        ///<returns></returns>
        [HttpGet]
        public ActionResult Index()
        {
            return RedirectToAction("Users");
        }

        /// <summary>
        /// Load MasterAdmins View
        /// </summary>
        ///<returns></returns>
        [HttpGet]
        public ActionResult Users()
        {
            return View();
        }

        ///// <summary>
        ///// Load PublicUsers View
        ///// </summary>
        ///// <returns></returns>
        //[HttpGet]
        //public ActionResult MasterAdmins()
        //{
        //    return View();
        //}

        ///// <summary>
        ///// Load PublicUsers View
        ///// </summary>
        ///// <returns></returns>
        //[HttpGet]
        //public ActionResult PublicUsers()
        //{
        //    return View();
        //}

        ///// <summary>
        ///// Load POS
        ///// </summary>
        ///// <returns></returns>
        //[HttpGet]
        //public ActionResult Pos()
        //{
        //    return View();
        //}

    }
}
