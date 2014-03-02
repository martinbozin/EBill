using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

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
using EBills.Web.Controllers.Shared.Base;
using EBills.Web.ViewModels;

namespace EBills.Web.Areas.SuperAdmin.Controllers
{
    [CustomAuthorize(AuthorizedRoles = new[] { Roles.SuperAdmin })]
    public class PosController : JqGridControllerBase<PosGridModel>
    {
        private readonly IRoleRepository _roleRepository;
        private readonly IRepository<Language> _langRepository;
        private readonly IPosRepository _posRepository;
        private readonly IUserRepository _userRepository;
        private readonly IPublicUserRepository _publicUserRepository;

        public PosController(IRoleRepository roleRepository,
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

        protected override IList<PosGridModel> FetchData(GridSettings gridSettings)
        {

            var query = _posRepository.Query();

            var gridResult = JqGridHelper.GetGridResult(query, delegate(string fieldName)
            {
                switch (fieldName)
                {
                    //case "Institution.Name":
                    //    return "Institution.Id";
                }

                return fieldName;
            },
                                                                   delegate(Pos model)
                                                                   {
                                                                       return model.MapToViewModel();
                                                                   }
                                                                   , gridSettings);
            return gridResult;
        }

        /// <summary>
        /// Додава нов POS
        /// </summary>
        /// <returns></returns>
        protected override ActionResult Add()
        {
            try
            {
                if (ModelState.IsValid)
                {
                    Pos newPos;
                    using (var scope = new UnitOfWorkScope())
                    {
                        var user = _posRepository.GetPosByName(GridModel.PosName);
                        if (user != null)
                        {
                            throw new DuplicateKeyException();
                        }

                        //Create new Pos
                        newPos=new Pos(GridModel.PosName)
                                   {
                                       Phone = GridModel.Phone,
                                       PrimaryContact = GridModel.PrimaryContact,
                                       AdditionalEmailAdresses = GridModel.AdditionalEmailAdresses
                                   };
                        newPos.SetIsActive(GridModel.IsActive);

                        //Save It
                        _posRepository.Save(newPos);
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
                ModelState.AddModelError(string.Empty, string.Format("Pos со име {0} веќе постои во системот.", GridModel.PosName));
            }
            throw CreateModelException(GridModel);


        }

        /// <summary>
        /// Промена на податоци за POS
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
                        var pos = _posRepository.Get(GridModel.Id);
                        if (pos == null)
                        {
                            throw new Exception("Корисникот не постои");
                        }
                        pos.SetName(GridModel.PosName);
                        pos.PrimaryContact=GridModel.PrimaryContact;
                        pos.Phone=GridModel.Phone;
                        pos.SetIsActive(GridModel.IsActive);

                        _posRepository.Update(pos);
                        scope.Commit();
                    }

                    return Json(GridModel);
                }

            }
            catch (Exception)
            {
                ModelState.AddModelError(string.Empty, string.Format("Грешка за POS {0} ", GridModel.PosName));
            }

            throw CreateModelException(GridModel);

        }
        /// <summary>
        /// Бришењ на POS
        /// </summary>
        /// <returns></returns>
        protected override ActionResult Delete()
        {
            try
            {
                using (var scope = new UnitOfWorkScope())
                {
                    var pos = _posRepository.Get(Convert.ToInt32(GridModel.Id));
                    pos.SetIsActive(GridModel.IsActive);
                    _posRepository.Update(pos);

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

        ////<summary>
        ////Поврзува Pos so User
        ////</summary>
        ////<param name="userId"></param>
        ////<param name="selectedPos"></param>
        ////<returns></returns>
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

    }
}
