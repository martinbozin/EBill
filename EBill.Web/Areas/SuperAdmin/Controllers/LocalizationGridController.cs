using EBills.Domain;
using EBills.Domain.Data;
using EBills.Infrastructure.Exceptions;
using EBills.Infrastructure.Grid;
using EBills.Security;
using EBills.Web.Controllers.Base;
using EBills.Web.ViewModels;

using Nextsense.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Web.Mvc;

namespace EBills.Web.Areas.SuperAdmin.Controllers
{
//    [CustomAuthorize(AuthorizedRoles = new[] { Roles.ZelsAdministrator })]
    public class LocalizationGridController : JqGridControllerBase<LocalizationGridModel>
    {
        private readonly ILocalizationRepository _repository;

        public LocalizationGridController(ILocalizationRepository repository)
        {
            _repository = repository;
        }

        protected override IList<LocalizationGridModel> FetchData(GridSettings gridSettings)
        {
            var query = _repository.Query();

            Random rand = new Random((int)DateTime.Now.Ticks);
            var gridResult = JqGridHelper.GetGridResult(query, delegate(string fieldName)
                                                                   {
                                                                       return fieldName;
                                                                   },
                                                        delegate(Localization model)
                                                        {
                                                            return new LocalizationGridModel()
                                                                       {
                                                                           Id = rand.Next(int.MaxValue),
                                                                           //LocalizationId = model.Id,
                                                                           Key = model.Key,
                                                                           Value = model.Value,
                                                                           JavaScript = model.JavaScript,
                                                                           Language = model.Language
                                                                       };
                                                        }
                                                        , gridSettings);
            return gridResult;
        }


            protected override ActionResult Add()
            {
                try
                {
                    if (ModelState.IsValid)
                    {
                        using (var scope = new UnitOfWorkScope())
                        {
                            Localization localization = _repository.GetLocalizationByKey(GridModel.Key);
                            if (localization != null)
                            {
                                throw new DuplicateKeyException();
                            }

                            localization = new Localization(GridModel.Key,GridModel.Value,GridModel.JavaScript,GridModel.Language);

                            _repository.Save(localization);
                            scope.Commit();

                        }
                        return Json(GridModel);
                    }
                }
                catch (DuplicateKeyException)
                {
                    ModelState.AddModelError(string.Empty, string.Format("localization with name {0} already exists in the system.", GridModel.Key));
                }

                throw CreateModelException(GridModel);
            }
      
            protected override ActionResult Update()
            {
                try
                {
                    if (ModelState.IsValid)
                    {
                        using (var scope = new UnitOfWorkScope())
                        {
                            Localization currentLocalization = _repository.Get(Convert.ToInt32(GridModel.Id));

                            if (currentLocalization == null)
                            {
                                throw new DuplicateKeyException();
                            }
                            currentLocalization.SetValue(GridModel.Value);


                            _repository.Update(currentLocalization);
                            scope.Commit();
                        }
                        return Json(GridModel);
                    }

                }
                catch (DuplicateKeyException)
                {
                    ModelState.AddModelError(string.Empty, string.Format("This type of Localization {0} already exists in the system.", GridModel.Key));
                }
                throw CreateModelException(GridModel);
            }

            protected override ActionResult Delete()
            {
                try
                {
                    using (var scope = new UnitOfWorkScope())
                    {
                        Localization entity = _repository.Get(Convert.ToInt32(GridModel.Id));
                        _repository.Delete(entity);

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

