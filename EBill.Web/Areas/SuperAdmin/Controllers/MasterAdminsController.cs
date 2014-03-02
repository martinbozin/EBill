using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Microsoft.Practices.ServiceLocation;

using Nextsense.Infrastructure.Data;
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

namespace EBills.Web.Areas.SuperAdmin.Controllers
{
    [CustomAuthorize(AuthorizedRoles = new[] { Roles.SuperAdmin })]
    public class MasterAdminsController : JqGridControllerBase<UsersGridModel>
    {
        private readonly IRoleRepository _roleRepository;
        private readonly IRepository<Language> _langRepository;
        private readonly IPosRepository _posRepository;
        private readonly IUserRepository _userRepository;
        private readonly IPublicUserRepository _publicUserRepository;

        public MasterAdminsController(IRoleRepository roleRepository,
            IRepository<Language> langRepository,
            IPosRepository posRepository,
            IUserRepository userRepository,
            IPublicUserRepository publicUserRepository)
        {
            _roleRepository = roleRepository;
            _langRepository = langRepository;
            _posRepository = posRepository;
            _userRepository = userRepository;
            _publicUserRepository = publicUserRepository;
        }

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
        /// Додава нова Мастер Админ
        /// </summary>
        /// <returns></returns>
        protected override ActionResult Add()
        {
            try
            {
                if (ModelState.IsValid)
                {
                    PublicUser newUser;
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

                        newUser = new PublicUser(GridModel.UserName, passwordEnc, GridModel.FirstName, GridModel.LastName, lang);
                        //newUser.AddToPos(pos);
                        newUser.IsActive = GridModel.IsActive;
                        var role = _roleRepository.GetRoleByName(Roles.Admin);
                        newUser.AddToRole(role);



                        //Get the Pos
                        //int posId = Convert.ToInt32(GridModel.Pos);
                        //Pos pos = _posRepository.Get(posId);
                        //newUser.AddToPos(pos);

                        //sendWelcomeEmailToUserViewModel = new SendWelcomeEmailToUserViewModel
                        //{
                        //    FullName = newUser.FullName,
                        //    Password = password
                        //};

                        //Save It
                        _publicUserRepository.Save(newUser);
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
        /// Промена на податоци за masterAdmin
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
                        var masterAdmin = _userRepository.GetUserByUsername(GridModel.UserName);
                        if (masterAdmin == null)
                        {
                            throw new Exception("Корисникот не постои");
                        }
                        masterAdmin.SetUserName(GridModel.UserName);
                        masterAdmin.SetFirstName(GridModel.FirstName);
                        masterAdmin.SetLastName(GridModel.LastName);

                        var lang = _langRepository.Get(GridModel.PreferedLanguage);
                        masterAdmin.SetPreferedLanguage(lang);

                        //int posId = Convert.ToInt32(GridModel.Pos);
                        //Pos pos = _posRepository.Get(posId);

                        //masterAdmin.RemoveFromPos(masterAdmin.Poses.FirstOrDefault());
                        //masterAdmin.AddToPos(pos);

                        masterAdmin.IsActive = GridModel.IsActive;

                        _userRepository.Update(masterAdmin);
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
        /// Бришењ на masterUser
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

        ///// <summary>
        ///// Листа на сите POS
        ///// </summary>
        ///// <param name="userId"> </param>
        ///// <returns></returns>
        //[HttpPost]
        //public JsonResult GetSelectedPos(int userId)
        //{
        //    var user = _userRepository.Get(userId);
        //    var viewModel = user.Poses.Select(p => p.MapToLookupViewModel())
        //        .ToList();
        //    return Json(viewModel);
        //}

         //<summary>
         //Поврзува Pos so User
         //</summary>
         //<param name="userId"></param>
        //<param name="selectedPos"></param>
         //<returns></returns>
        //[HttpPost]
        //public JsonResult SetSelectedPos(int userId, List<int> selectedPos)
        //{
        //    using (var scope = new UnitOfWorkScope())
        //    {
        //        //Get The User
        //        var user = _userRepository.Get(userId);

        //        if (user != null)
        //        {
        //            //Get All Pos
        //            var allPos = _posRepository.GetAll();
        //            var pos = user.Poses;

        //            //Find New Elements
        //            var forAdd = (from s in selectedPos
        //                          where !pos.Select(x => x.Id)
        //                                     .Contains(s)
        //                          select s)
        //                .ToList();

        //            //Add New
        //            foreach (var selectedInstitution in forAdd)
        //            {
        //                var posNew = allPos.FirstOrDefault(x => x.Id == selectedInstitution);
        //                try
        //                {
        //                    user.AddToPos(posNew);
        //                }
        //                catch (Exception)
        //                {

        //                }
        //            }

        //            //Find For Remove
        //            var forRemove = user.Poses
        //                .Where(ext => !selectedPos
        //                    .Contains(ext.Id))
        //                    .ToList();
        //            foreach (var ext in forRemove)
        //            {
        //                user.RemoveFromPos(ext);
        //            }
        //        }
        //        else
        //        {
        //            //Remove All Elements
        //            user.Poses.RemoveAll();
        //        }
        //        //Update
        //        _userRepository.Update(user);
        //        scope.Commit();
        //    }
        //    return Json(true);
        //}



        //<summary>
        //Поврзува Pos so User
        //</summary>
        //<param name="userId"></param>
        //<param name="selectedPos"></param>
        //<returns></returns>
        //[HttpPost]
        //public JsonResult SetSelectedPosToNull(int userId)
        //{
        //    using (var scope = new UnitOfWorkScope())
        //    {
        //        //Get The User
        //        var user = _userRepository.Get(userId);

        //        if (user != null)
        //        {
        //            //Remove All Elements
        //            user.Poses.RemoveAll();
        //        }
        //        else
        //        {
        //            //Remove All Elements
        //            user.Poses.RemoveAll();
        //        }
        //        //Update
        //        _userRepository.Update(user);
        //        scope.Commit();
        //    }
        //    return Json(true);
        //}




        /// <summary>
        /// Листа на сите users for pos
        /// </summary>
        /// <param name="posId"> </param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetSelectedUsersForPos(int posId)
        {
            var pos = _posRepository.Get(posId);
            var viewModel = pos.Users.Where(x =>
                                                {
                                                    var firstOrDefault = x.Roles.FirstOrDefault();
                                                    return firstOrDefault != null && firstOrDefault.RoleName == Roles.PublicUser;
                                                }).Select(p => p.MapToLookupViewModel())
                .ToList();
            return Json(viewModel);
        }



        [HttpPost]
        public JsonResult GetNotSelectedUsersForPos(int posId)
        {
            var pos = _posRepository.Get(posId);
            List<LookupViewModel> viewModel = pos.Users.Where(x =>
                                                                  {
                                                                      var firstOrDefault = x.Roles.FirstOrDefault();
                                                                      return firstOrDefault != null && firstOrDefault.RoleName == Roles.PublicUser;
                                                                  }).Select(p => p.MapToLookupViewModel()).ToList();
            var users = _userRepository.GetAll().Where(x =>
                                                           {
                                                               var orDefault = x.Roles.FirstOrDefault();
                                                               return orDefault != null && orDefault.RoleName == Roles.PublicUser;
                                                           });
            List<LookupViewModel> forAdd = (from s in users
                          where !viewModel.Select(x => x.Value)
                                      .Contains(s.Id)
                          select s.MapToLookupViewModel()).ToList();
            viewModel =  forAdd;
   

            //viewModel = notselected.Select(o => o.MapToLookupViewModel()).ToList();
            return Json(viewModel);
        }


        //<summary>
        //Поврзува Pos so User
        //</summary>
        //<param name="userId"></param>
        //<param name="selectedPos"></param>
        //<returns></returns>
        [HttpPost]
        public JsonResult SetSelectedUserForPos(int posId, List<int> selectedUsers)
        {
            using (var scope = new UnitOfWorkScope())
            {
                //Get The User
                var pos = _posRepository.Get(posId);

                if (pos != null)
                {
                    //Get All Users
                    var allUsers = _userRepository.GetAll();
                    var user = pos.Users;

                    //Find New Elements
                    var forAdd = (from s in selectedUsers
                                  where !user.Select(x => x.Id)
                                             .Contains(s)
                                  select s)
                        .ToList();

                    //Add New
                    foreach (var selectedU in forAdd)
                    {
                        var userNew = allUsers.FirstOrDefault(x => x.Id == selectedU);
                        try
                        {
                            pos.AddUser(userNew);
                        }
                        catch (Exception)
                        {

                        }
                    }

                    //Find For Remove
                    var forRemove = pos.Users
                        .Where(ext => !selectedUsers
                            .Contains(ext.Id))
                            .ToList();
                    foreach (var ext in forRemove)
                    {
                        pos.RemoveUser(ext);
                    }
                }
                else
                {
                    //Remove All Elements
                    pos.Users.RemoveAll();
                }
                //Update
                _posRepository.Update(pos);
                scope.Commit();
            }
            return Json(true);
        }



        //<summary>
        //Поврзува Pos so User
        //</summary>
        //<param name="userId"></param>
        //<param name="selectedPos"></param>
        //<returns></returns>
        [HttpPost]
        public JsonResult SetSelectedUserForPosToNull(int posId)
        {
            using (var scope = new UnitOfWorkScope())
            {
                //Get The User
                var pos = _posRepository.Get(posId);

                if (pos != null)
                {

                    //Remove All Elements
                    pos.Users.RemoveAll();
                }
                else
                {
                    //Remove All Elements
                    pos.Users.RemoveAll();
                }
                //Update
                _posRepository.Update(pos);
                scope.Commit();
            }
            return Json(true);
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
                .Where(x => x.IsActive && x.Roles.Any(r => r.RoleName == Roles.PublicUser))
                .OrderBy(x => x.UserName).ToList();
            var viewModel = users.Select(p => p.MapToLookupViewModel()).ToList();
            return Json(viewModel);
        }

    }
}
