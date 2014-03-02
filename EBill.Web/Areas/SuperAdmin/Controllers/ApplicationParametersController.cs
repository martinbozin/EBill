using EBills.Domain;
using EBills.Domain.Data;
using EBills.Infrastructure.Exceptions;
using EBills.Security;
using EBills.Web.Controllers.Shared.Base;
using EBills.Web.ViewModels;
using System;
using System.Globalization;
using System.Linq;
using System.Web.Mvc;

namespace EBills.Web.Areas.SuperAdmin.Controllers
{
    [CustomAuthorize(AuthorizedRoles = new[] { Roles.SuperAdmin })]
    public class ApplicationParametersController : AppControllerBase
    {
        private readonly IApplicationParameterRepository _applicationParameterRepository;
        public ApplicationParametersController(IApplicationParameterRepository applicationParameterRepository)
        {
            _applicationParameterRepository = applicationParameterRepository;
        }
        /// <summary>
        /// Враќа почетна страна
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// Ги зема сите валидни апликациски параметри
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult LoadAllValidApplicationParameters()
        {
            var parameters = _applicationParameterRepository.GetAllValid();
            var viewModel = parameters.Select(p => p.MapToViewModel()).ToList();
            return Json(viewModel);
        }
        /// <summary>
        /// Враќа апликациски параметар по ИД
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetAppParameterById(int appParamId)
        {            
            var viewModel = _applicationParameterRepository.Get(appParamId);
            return Json(viewModel);
        }
        /// <summary>
        /// Враќа апликациски параметри за дадено име на параметарот
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetParametersForParameterName(string parameterName)
        {
            if(!string.IsNullOrEmpty(parameterName))
            {
                var viewModel = _applicationParameterRepository.GetAllForParameterName(parameterName);
                return Json(viewModel);  
            }       
           throw new JsonException("Грешка.");        
        }

        /// <summary>
        /// Промена на вредност на апликациски параметар
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult UpdateParameterValue(ApplicationParameterViewModel model)
        {
            if (ModelState.IsValid)
            {
                if (string.IsNullOrEmpty(model.ParameterValue))
                {
                    throw new JsonException("Внесете вредност за параметарот.");
                }

                try
                {
                    object value;
                    CultureInfo provider = System.Threading.Thread.CurrentThread.CurrentCulture;
                    switch (model.ParameterType)
                    {
                        case "string":
                            if (model.ParameterValue.Length > 250)
                            {
                                throw new Exception("max length exceed");
                            }
                            break;
                        case "int":
                            value = Convert.ChangeType(model.ParameterValue, TypeCode.Int32);
                            break;
                        case "datetime":
                            value = DateTime.ParseExact(model.ParameterValue, "dd.MM.yyyy", provider);
                            break;
                        case "date":
                            value = DateTime.ParseExact(model.ParameterValue, "yyyyMMdd", provider);
                            break;
                        case "float":
                            value = Convert.ChangeType(model.ParameterValue, TypeCode.Double, provider);
                            break;
                        case "byte":
                            value = Convert.ChangeType(model.ParameterValue, TypeCode.Byte, provider);
                            break;
                    }
                }
                catch (Exception)
                {
                    throw new JsonException("Вредноста за параметарот не е валидна.");
                }

                ApplicationParameter entity = _applicationParameterRepository.Get(model.Id);
                entity.ParameterValue = model.ParameterValue;
                entity.ParameterDescription = model.ParameterDescription;
                _applicationParameterRepository.Update(entity);

                return Json(model);
            }

            throw CreateModelException(model);
        }
       

    }
}