using System;
using System.Globalization;
using Martin.ResourcesCommon;
using EBills.Domain;
using EBills.Infrastructure.Exceptions;
using EBills.Web.Controllers.Shared.Base;
using EBills.Web.ViewModels;
using Microsoft.Practices.ServiceLocation;

using Nextsense.Infrastructure.Data;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace EBills.Web.Controllers.Shared
{
    [Authorize]
    public class LookupsController : AppControllerBase
    {
        /// <summary>
        /// Зема листа на достапни јазици
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetLanguages()
        {
            var languageRepository = ServiceLocator.Current.GetInstance<IRepository<Language>>();
            var languages = languageRepository.GetAll().Where(x => x.Enabled);
            var viewModel = languages.Select(p => p.MapToLookupViewModel()).ToList();
            return Json(viewModel);
        }

        /// <summary>
        /// Зема листа на Pos
        /// </summary>
        /// <returns>Сите Pos</returns>
        [HttpPost]
        public JsonResult GetAllPos()
        {
            var posRepository = ServiceLocator.Current.GetInstance<IRepository<Pos>>();
            var poses = posRepository.Query()
                .Where(x => x.IsActive)
                .OrderBy(x => x.PosName).ToList();
            var viewModel = poses.Select(p => p.MapToLookupViewModel()).ToList();
            return Json(viewModel);
        }
        /// <summary>
        /// Зема листа на Users
        /// </summary>
        /// <returns>Сите Pos</returns>
        [HttpPost]
        public JsonResult GetAllUsers()
        {
            var usersRepository = ServiceLocator.Current.GetInstance<IRepository<User>>();
            var users = usersRepository.Query()
                .Where(x => x.IsActive)
                .OrderBy(x => x.UserName).ToList();
            var viewModel = users.Select(p => p.MapToViewModel()).ToList();
            return Json(viewModel);
        }
        /// <summary>
        /// Зема листа на Users
        /// </summary>
        /// <returns>Сите Pos</returns>
        [HttpPost]
        public JsonResult GetAllPublicUsers()
        {
            var usersRepository = ServiceLocator.Current.GetInstance<IRepository<User>>();
            var users = usersRepository.Query()
                .Where(x => x.IsActive && x.Roles.Any(r => r.RoleName == Roles.PublicUser))
                .OrderBy(x => x.UserName).ToList();
          var viewModel = users.Select(p => p.MapToViewModel()).ToList();
            return Json(viewModel);
        }


    }
}
