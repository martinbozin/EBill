using VipTopUp.Domain;
using VipTopUp.Domain.Data;
using VipTopUp.Infrastructure.Exceptions;
using VipTopUp.Infrastructure.Extensions;
using VipTopUp.Infrastructure.Grid;
using VipTopUp.Infrastructure.Helpers;
using VipTopUp.Security;
using VipTopUp.Web.Areas.Administration.Models;
using VipTopUp.Web.Controllers.Base;
using VipTopUp.Web.ViewModels;
using Nextsense.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using VipTopUp.Web.ViewModels.Mail;

namespace VipTopUp.Web.Areas.Zels.Controllers
{
    /// <summary>
    /// Controller koj gi obezbeduva podatocite za korisnicite vo sistemot koi se 
    /// Administratori po opstinite niz drzavava ili vo MTV
    /// </summary>
    [CustomAuthorize(AuthorizedRoles = new[] { Roles.ZelsAdministrator })]
    public class UsersGridController : JqGridControllerBase<ZelsUsersGridModel>
    {
        private readonly IRoleRepository _roleRepository;
        private readonly IRepository<Language> _langRepository;
        private readonly IRepository<Institution> _institutionRepository;
        private readonly IUserRepository _userRepository;

        public UsersGridController(IRoleRepository roleRepository,
            IRepository<Language> langRepository,
            IRepository<Institution> institutionRepository,
            IUserRepository userRepository)
        {
            _roleRepository = roleRepository;
            _langRepository = langRepository;
            _institutionRepository = institutionRepository;
            _userRepository = userRepository;
        }

        /// <summary>
        /// Ги зема податоците за сите корисници од тип Администратор по
        /// сите општини и МТВ
        /// </summary>
        /// <param name="gridSettings"></param>
        /// <returns></returns>
        protected override IList<ZelsUsersGridModel> FetchData(GridSettings gridSettings)
        {
            var query = _userRepository.Query()
                .Where(x => x.Roles.Any(r => r.RoleName == Roles.MunicipalityAdministrator
                    || r.RoleName == Roles.ExternalUsers
                    || r.RoleName == Roles.UpravenInspektor
                    ));

            var gridResult = JqGridHelper.GetGridResult(query, delegate(string fieldName)
                                                                   {
                                                                       switch (fieldName)
                                                                       {
                                                                           case "Institution.Name":
                                                                               return "Institution.Id";
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
        /// Додава нов Администратор во Институција
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

                        //Get the Institution
                        Institution institution = _institutionRepository.Get(GridModel.InstitutionId);

                        //Create new User
                        var lang = _langRepository.Get(GridModel.PreferedLanguage);
                        newUser = new BackendUser(GridModel.UserName, passwordEnc, GridModel.FirstName, GridModel.LastName, lang, institution)
                                      {
                                          IsActive = GridModel.IsActive
                                      };

                        if (institution.InstitutionType == InstitutionType.Ministry || institution.InstitutionType == InstitutionType.Municipality
                            || institution.InstitutionType == InstitutionType.GradSkopje || institution.InstitutionType == InstitutionType.Dtirz)
                        {
                            //Add to Administrator By Default
                            var role = _roleRepository.GetRoleByName(Roles.MunicipalityAdministrator);
                            newUser.AddToRole(role);
                        }
                        else
                        {
                            if (institution.Tag == "UPRAVENINSPEKTORAT")
                            {
                                var role = _roleRepository.GetRoleByName(Roles.UpravenInspektor);
                                newUser.AddToRole(role);
                            }
                            else
                            {
                                //Add to Exteral Institutions Users 
                                var role = _roleRepository.GetRoleByName(Roles.ExternalUsers);
                                newUser.AddToRole(role);
                            }
                        }

                        //sendWelcomeEmailToUserViewModel = new SendWelcomeEmailToUserViewModel
                        //{
                        //    FullName = newUser.FullName,
                        //    Password = password
                        //};

                        //Save It
                        _backendUserRepository.Save(newUser);
                        scope.Commit();
                    }

                    //Send Welcome email to created administrator
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
        /// Промена на податоците за Администратор
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
                        BackendUser currentUser = _backendUserRepository.Get(Convert.ToInt32(GridModel.Id));
                        var user = _userRepository.GetUserByUsername(GridModel.UserName);
                        //if (user != null && currentUser.Id != user.Id)
                        //{
                        //    throw new DuplicateKeyException();
                        //}

                        //set the language
                        var lang = _langRepository.Get(GridModel.PreferedLanguage);
                        currentUser.SetPreferedLanguage(lang);

                        //set the institution
                        Institution institution = _institutionRepository.Get(GridModel.InstitutionId);

                        if (institution.InstitutionType == InstitutionType.Ministry || institution.InstitutionType == InstitutionType.Municipality
                            || institution.InstitutionType == InstitutionType.GradSkopje || institution.InstitutionType == InstitutionType.Dtirz)
                        {
                            var role = _roleRepository.GetRoleByName(currentUser.Roles.Select(x => x.RoleName).FirstOrDefault());
                            Role roleNew = _roleRepository.GetRoleByName(Roles.MunicipalityAdministrator);
                            if (roleNew.RoleName != role.RoleName)
                            {
                                currentUser.Roles.RemoveAll();
                                currentUser.AddToRole(roleNew);
                            }

                            currentUser.SetInstitution(institution);
                        }
                        else
                        {
                            var role = _roleRepository.GetRoleByName(currentUser.Roles.Select(x => x.RoleName).FirstOrDefault());

                            Role roleNew;
                            if (institution.Tag == "UPRAVENINSPEKTORAT")
                            {
                                roleNew = _roleRepository.GetRoleByName(Roles.UpravenInspektor);
                            }
                            else
                            {
                                roleNew = _roleRepository.GetRoleByName(Roles.ExternalUsers);
                            }

                            if (roleNew.RoleName != role.RoleName)
                            {
                                currentUser.Roles.RemoveAll();
                                currentUser.AddToRole(roleNew);

                            }

                            currentUser.SetInstitution(institution);
                        }


                        //set props
                        currentUser.SetUserName(GridModel.UserName);
                        currentUser.SetFirstName(GridModel.FirstName);
                        currentUser.SetLastName(GridModel.LastName);
                        currentUser.IsActive = GridModel.IsActive;

                        _backendUserRepository.Update(currentUser);
                        scope.Commit();
                    }

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
        /// Промена на Администратор во Институција во неактивен
        /// </summary>
        /// <returns></returns>
        protected override ActionResult Delete()
        {
            try
            {
                using (var scope = new UnitOfWorkScope())
                {
                    BackendUser currentUser = _backendUserRepository.Get(Convert.ToInt32(GridModel.Id));

                    var user = _userRepository.GetUserByUsername(GridModel.UserName);
                    if (user != null && currentUser.Id != user.Id)
                    {
                        throw new DuplicateKeyException();
                    }

                    currentUser.IsActive = false;

                    _backendUserRepository.Update(currentUser);
                    scope.Commit();
                }

                return Json(GridModel);
            }
            catch (DuplicateKeyException)
            {
                ModelState.AddModelError(string.Empty, string.Format("User with username {0} already exists in the system.", GridModel.UserName));
            }
            throw CreateModelException(GridModel);
        }
    }
}