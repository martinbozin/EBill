using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
//using Martin.Infrastructure.Data;
using Martin.ResourcesCommon;
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
namespace EBills.Web.Areas.SuperAdmin.Controllers
{
    [CustomAuthorize(AuthorizedRoles = new[] { Roles.SuperAdmin })]
    public class PublicUsersController : JqGridControllerBase<UsersGridModel>
    {
        private readonly IRoleRepository _roleRepository;
        private readonly IRepository<Language> _langRepository;
        private readonly IUserRepository _userRepository;
 

        public PublicUsersController(IRoleRepository roleRepository,
            IRepository<Language> langRepository,
            IUserRepository userRepository
          )
        {
            _roleRepository = roleRepository;
            _langRepository = langRepository;
            _userRepository = userRepository;
       
        }

        protected override IList<UsersGridModel> FetchData(GridSettings gridSettings)
        {

            var query = _userRepository.Query()
                .Where(x => x.Roles.Any(r => r.RoleName == Roles.PublicUser));

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
        /// Додава нова PublicUser
        /// </summary>
        /// <returns></returns>
        protected override ActionResult Add()
        {
            try
            {
                if (ModelState.IsValid)
                {
                    User newUser;
                    //SendWelcomeEmailToUserViewModel sendWelcomeEmailToUserViewModel;
                    using (var scope = new UnitOfWorkScope())
                    {
                        var user = _userRepository.GetUserByUsername(GridModel.UserName);
                        if (user != null)
                        {
                            throw new DuplicateKeyException();
                        }

                        //Generate the Password
                        string password = new PasswordGenerator().Generate();
                        string passwordEnc = password.Md5String();

                        //Create new User
                        var lang = _langRepository.Get(GridModel.PreferedLanguage);

                        newUser = new User(GridModel.UserName, passwordEnc, GridModel.FirstName, GridModel.LastName, lang);
                        newUser.IsActive = GridModel.IsActive;
                        var role = _roleRepository.GetRoleByName(Roles.PublicUser);
                        newUser.AddToRole(role);

                        _userRepository.Save(newUser);
                        scope.Commit();
                    }

                    ////Send Welcome email to created administrator
                    //sendWelcomeEmailToUserViewModel.To = newUser.UserName;
                    //MailService.SendWelcomeEmailToUser(sendWelcomeEmailToUserViewModel);

                    return Json(GridModel);
                }
            }
            catch (DuplicateKeyException)
            {
                ModelState.AddModelError(string.Empty, string.Format("Корисникот со корисничко име {0} веќе постои во системот.", GridModel.UserName));
            }
            throw CreateModelException(GridModel);


        }
        /// <summary>
        /// Промена на податоци за PublicUser
        /// </summary>
        /// <returns></returns>
        protected override ActionResult Update()
        {
            try
            {
                if (ModelState.IsValid)
                {
                    using (var scope = new UnitOfWorkScope())
                    {
                        var PublicUser = _userRepository.GetUserByUsername(GridModel.UserName);
                        if (PublicUser == null)
                        {
                            throw new Exception("Корисникот не постои");
                        }
                        PublicUser.SetUserName(GridModel.UserName);
                        PublicUser.SetFirstName(GridModel.FirstName);
                        PublicUser.SetLastName(GridModel.LastName);

                        var lang = _langRepository.Get(GridModel.PreferedLanguage);
                        PublicUser.SetPreferedLanguage(lang);

                        PublicUser.IsActive = GridModel.IsActive;

                        _userRepository.Update(PublicUser);
                        scope.Commit();
                    }

                    return Json(GridModel);
                }

            }
            catch (Exception)
            {
                ModelState.AddModelError(string.Empty, string.Format("Грешка за корисникот {0} ", GridModel.FirstName));
            }

            throw CreateModelException(GridModel);

        }
        /// <summary>
        /// Бришењ на PublicUser
        /// </summary>
        /// <returns></returns>
        protected override ActionResult Delete()
        {
            try
            {
                using (var scope = new UnitOfWorkScope())
                {
                    var user = _userRepository.Get(Convert.ToInt32(GridModel.Id));
                    user.IsActive = false;
                    _userRepository.Update(user);

                    scope.Commit();
                }
                return new EmptyResult();
            }
            catch (Exception)
            {

                throw CreateModelException(GridModel);
            }
        }

    }
}
