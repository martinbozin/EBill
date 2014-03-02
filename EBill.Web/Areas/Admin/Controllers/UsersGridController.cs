using EBills.Domain;
using EBills.Domain.Data;
using EBills.Infrastructure.Exceptions;
using EBills.Infrastructure.Extensions;
using EBills.Infrastructure.Grid;
using EBills.Infrastructure.Helpers;
using EBills.Security;
using EBills.Web.Areas.Administration.Models;
using EBills.Web.Controllers.Base;
using EBills.Web.ViewModels;

using Nextsense.Infrastructure.Data;
using Nextsense.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using EBills.Web.ViewModels.Mail;

namespace EBills.Web.Areas.Admin.Controllers
{
    /// <summary>
    /// Контролер кој ги обезбедува податоците за администраторите по
    /// општини или администраторот во МТВ
    /// Овие Администратори си ги администрираат корисниците во нивните т.е. (соодветните) институции
    /// </summary>
    [CustomAuthorize(AuthorizedRoles = new[]
                                           {
                                               Roles.SuperAdmin
                                           })]
    public class UsersGridController : JqGridControllerBase<UsersGridModel>
    {
        private readonly IRoleRepository _roleRepository;
        private readonly IRepository<Language> _langRepository;
        private readonly IRepository<Pos> _posRepository;
        private readonly IUserRepository _userRepository;

        public UsersGridController(IRoleRepository roleRepository,
            IRepository<Language> langRepository,
            IRepository<Pos> posRepository,
            IUserRepository userRepository)
        {
            _roleRepository = roleRepository;
            _langRepository = langRepository;
            _posRepository = posRepository;
            _userRepository = userRepository;
        }
        /// <summary>
        /// Ги зема корисниците во соодветната Институција
        /// </summary>
        /// <param name="gridSettings"></param>
        /// <returns></returns>
        protected override IList<UsersGridModel> FetchData(GridSettings gridSettings)
        {

            var query = _userRepository.Query()
                .Where(x => x.Roles.Any(r => r.RoleName == Roles.Admin));

            var gridResult = JqGridHelper.GetGridResult(query, delegate(string fieldName)
                                                                   {
                                                                       switch (fieldName)
                                                                       {
                                                                           //case "Institution.Name":
                                                                           //    return "Institution.Id";
                                                                       }

                                                                       return fieldName;
                                                                   },
                                                                   delegate(User model)
                                                                   {
                                                                       return model.MapToViewModel();
                                                                   }
                                                                   , gridSettings);
            return gridResult;
        }


        /// <summary>
        /// Додавање на корисник во Институција
        /// При додавање корисникот се става во одредеа институција и 
        /// не може понатаму да се промени
        /// </summary>
        /// <returns></returns>
        //protected override ActionResult Add()
        //{
        //    try
        //    {
        //        if (ModelState.IsValid)
        //        {
        //            BackendUser newUser;
        //            using (var scope = new UnitOfWorkScope())
        //            {
        //                var user = _userRepository.GetUserByUsername(GridModel.UserName);
        //                if (user != null)
        //                {
        //                    throw new DuplicateKeyException();
        //                }

        //                //Generate the Password
        //                string password = new PasswordGenerator().Generate();
        //                string passwordEnc = password.Md5String();

        //                //Get the Institution from Current User
        //                var institutionId = ((BackendUser)CurrentUser).Institution.Id;
        //                Institution institution = _institutionRepository.Get(institutionId);

        //                //Create new User
        //                var lang = _langRepository.Get(GridModel.PreferedLanguage);


        //                /////// Ova treba da se proverI.Adresa mu davam null 
        //                newUser = new BackendUser(GridModel.UserName, passwordEnc, GridModel.FirstName,
        //                                          GridModel.LastName, lang, institution);
        //                newUser.IsActive = GridModel.IsActive;
        //                                        //Save It
        //                _backendUserRepository.Save(newUser);
        //                scope.Commit();
        //            }
        //            return Json(GridModel);
        //        }
        //    }
        //    catch (DuplicateKeyException)
        //    {
        //        ModelState.AddModelError(string.Empty,
        //                                 string.Format("User with username {0} already exists in the system.",
        //                                               GridModel.UserName));
        //    }

        //    throw CreateModelException(GridModel);
        //}

        ///// <summary>
        ///// Промена на податоци за коринсик 
        ///// во Институција
        ///// </summary>
        ///// <returns></returns>
        //protected override ActionResult Update()
        //{
        //    try
        //    {
        //        if (ModelState.IsValid)
        //        {
        //            using (var scope = new UnitOfWorkScope())
        //            {
        //                BackendUser currentUser = _backendUserRepository.Get(Convert.ToInt32(GridModel.Id));

        //                var user = _userRepository.GetUserByUsername(GridModel.UserName);
        //                if (user != null && currentUser.Id != user.Id)
        //                {
        //                    throw new DuplicateKeyException();
        //                }

        //                //set language
        //                var lang = _langRepository.Get(GridModel.PreferedLanguage);

        //                //set props
        //                currentUser.SetPreferedLanguage(lang);
        //                currentUser.SetUserName(GridModel.UserName);
        //                currentUser.SetFirstName(GridModel.FirstName);
        //                currentUser.SetLastName(GridModel.LastName);
        //                currentUser.IsActive = GridModel.IsActive;

        //                _backendUserRepository.Update(currentUser);
        //                scope.Commit();
        //            }

        //            return Json(GridModel);
        //        }
        //    }
        //    catch (DuplicateKeyException)
        //    {
        //        ModelState.AddModelError(string.Empty,
        //                                 string.Format("User with username {0} already exists in the system.",
        //                                               GridModel.UserName));
        //    }

        //    throw CreateModelException(GridModel);
        //}

        ///// <summary>
        ///// Промена на Корисник во Институција во неактивен
        ///// </summary>
        ///// <returns></returns>
        //protected override ActionResult Delete()
        //{
        //    try
        //    {
        //        using (var scope = new UnitOfWorkScope())
        //        {
        //            BackendUser currentUser = _backendUserRepository.Get(Convert.ToInt32(GridModel.Id));

        //            var user = _userRepository.GetUserByUsername(GridModel.UserName);
        //            if (user != null && currentUser.Id != user.Id)
        //            {
        //                throw new DuplicateKeyException();
        //            }

        //            currentUser.IsActive = false;

        //            _backendUserRepository.Update(currentUser);
        //            scope.Commit();
        //        }

        //        return Json(GridModel);
        //    }
        //    catch (DuplicateKeyException)
        //    {
        //        ModelState.AddModelError(string.Empty, string.Format("User with username {0} already exists in the system.", GridModel.UserName));
        //    }
        //    throw CreateModelException(GridModel);
        //}
    }
}