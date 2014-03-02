using EBills.Domain;
using EBills.Domain.Data;
using EBills.Infrastructure.Exceptions;
using EBills.Infrastructure.Helpers;
using EBills.Infrastructure.Models;
using EBills.Infrastructure.MVC.Attributes;
using EBills.Security;
using log4net;
using Microsoft.Practices.ServiceLocation;

using Nextsense.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace EBills.Web.Controllers.Shared.Base
{

    [IECheck]
    public class AppControllerBase : Controller
    {
        protected static readonly ILog Log = LogManager.GetLogger(string.Empty);

        /// <summary>
        /// Get Current User Data
        /// </summary>
        public User CurrentUser
        {
            get
            {
                return ((CustomPrincipal)User).User;
            }
        }

        /// <summary>
        /// Current Principal
        /// </summary>
        public CustomPrincipal CurrentPrincipal
        {
            get
            {
                return (CustomPrincipal)User;
            }
        }

        /// <summary>
        /// Get the mail service
        /// </summary>
        public MailController MailService
        {
            get
            {
                return new MailController();
            }
        }




        protected override JsonResult Json(object data, string contentType, System.Text.Encoding contentEncoding, JsonRequestBehavior behavior)
        {
            return new JsonResult()
            {
                Data = data,
                ContentType = contentType,
                ContentEncoding = contentEncoding,
                JsonRequestBehavior = behavior,
                MaxJsonLength = Int32.MaxValue
            };
        }


        protected override JsonResult Json(object data, string contentType, System.Text.Encoding contentEncoding)
        {
            return new JsonResult()
            {
                Data = data,
                ContentType = contentType,
                ContentEncoding = contentEncoding,
                MaxJsonLength = Int32.MaxValue
            };
        }

        protected override void OnAuthorization(AuthorizationContext filterContext)
        {
            //ako e dozvolen Anonymous pristap
            if (filterContext.ActionDescriptor.IsDefined(typeof(AllowAnonymousAttribute), true) ||
                filterContext.ActionDescriptor.ControllerDescriptor.IsDefined(typeof(AllowAnonymousAttribute), true))
            {
                return;
            }

            //ako nema authorize atribut nisto ne pravime
            if (!filterContext.ActionDescriptor.IsDefined(typeof(AuthorizeAttribute), true) &&
                !filterContext.ActionDescriptor.ControllerDescriptor.IsDefined(typeof(AuthorizeAttribute), true)
                )
            {
                return;
            }

            //ako mu istekla sesijata
            if (
                (filterContext.HttpContext.Session == null || filterContext.HttpContext.User == null)
                ||
                (filterContext.HttpContext.User != null && !User.Identity.IsAuthenticated)
               )
            {
                if (!filterContext.HttpContext.Request.IsAjaxRequest())
                {
                    //go to login page
                    filterContext.Result = new HttpUnauthorizedResult();
                    return;
                }

                throw new NotAuthenticatedException("Корисникот не е најавен или му истекла сесијата.");
            }

            //dokolku ne e forms podeseno na IIS togash throw ne igrame vaka
            if (!(User.Identity is FormsIdentity))
            {
                //not supported auth type
                throw new InvalidOperationException(string.Format("{0} authentication type is not supported.", System.Web.HttpContext.Current.User.Identity.AuthenticationType));
            }

            //create the principal
            var principal = PrincipalManager.Instance.CreatePrincipal();

            //keep it in sync
            System.Threading.Thread.CurrentPrincipal = principal;
            System.Web.HttpContext.Current.User = principal;

            base.OnAuthorization(filterContext);
        }

        protected ModelException CreateModelException(AppModel model)
        {
            if (model == null)
                throw new ArgumentNullException("model");

            model.HasErrors = true;
            foreach (var key in ModelState.Keys)
            {
                var modelState = ModelState[key];
                if (modelState.Errors.Count > 0)
                {
                    var errors = modelState.Errors.Select(modelError => modelError.ErrorMessage).ToList();
                    string errorKey = key.Replace("model.", "");
                    if (!model.Errors.ContainsKey(errorKey))
                        model.Errors.Add(errorKey, errors);
                }
            }

            return new ModelException(model);
        }

        protected override void HandleUnknownAction(string actionName)
        {
            if (this.GetType() != typeof(ErrorsController))
                throw new HttpException(404, actionName + " cannot be found.");
        }

        //public bool ValidateSignature(User user, string signature)
        //{
        //    if (string.IsNullOrEmpty(signature))
        //    {
        //        Log.Debug("No signature parameter");
        //        return false;
        //    }

        //    bool valid = false;

        //    try
        //    {
        //        valid = signature.VerifyDigitalSignature();
        //    }
        //    catch (Exception ex)
        //    {
        //        Log.Error(ex);
        //        valid = false;
        //    }

        //    if (valid)
        //    {
        //        List<X509Certificate2> certificates = signature.GetCertificates();
        //        if (certificates == null) return false;
        //        if (certificates.Count == 0) return false;

        //        if (user.CertificateRawBytes == null) return false;

        //        X509Certificate2 signatureCert = certificates[0];
        //        X509Certificate2 userCert = new X509Certificate2(user.CertificateRawBytes);

        //        var appParametersRep = ServiceLocator.Current.GetInstance<IApplicationParameterRepository>();

        //        var developmentEnvironment = false;

        //        using (new UnitOfWorkScope())
        //        {
        //            developmentEnvironment = Convert.ToBoolean(appParametersRep.GetByName("DevelopmentEnvironment").ParameterValue);
        //        }

        //        if (!developmentEnvironment && (DateTime.Parse(userCert.GetExpirationDateString()) < DateTime.Now)) return false;

        //        if (!userCert.Equals(signatureCert)) return false;
        //    }

        //    return valid;
        //}
    }
}