using Autofac.Integration.Mvc;
using ServiceLocatorInitializer;
using EBills.Data.NHibernate.NHibernate;
using EBills.Infrastructure.Exceptions;
using EBills.Infrastructure.MVC;
using EBills.Security;
using EBills.Web.Controllers;
using FluentValidation.Mvc;
using log4net;
using log4net.Config;
using NHibernate.Exceptions;

using System;
using System.Collections;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Transactions;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;
using System.Web.Routing;

namespace EBills.Web
{
    public class MvcApplication : HttpApplication
    {
        private static readonly ILog Log = LogManager.GetLogger(string.Empty);

        public MvcApplication()
        {
            BeginRequest += MvcApplicationBeginRequest;
            EndRequest += MvcApplicationEndRequest;
        }

        static void MvcApplicationBeginRequest(object sender, EventArgs e)
        {
        }

        static void MvcApplicationEndRequest(object sender, EventArgs e)
        {
            NHibernateHelper.CloseSessionInWebRequestContext();
        }

        protected void Application_Start()
        {
            //Register Areas
            AreaRegistration.RegisterAllAreas();

            // The order of this is important
            RouteTable.Routes.MapHubs();

            //Register App_Start Configurations
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            //Set Up log4Net
            XmlConfigurator.Configure();

            //Set FluentValidation as Model Validation Provider
            DataAnnotationsModelValidatorProvider.AddImplicitRequiredAttributeForValueTypes = false;
            FluentValidationModelValidatorProvider.Configure();

            ConfigureContainer();

            ValueProviderFactories.Factories.Remove(ValueProviderFactories.Factories.OfType<System.Web.Mvc.JsonValueProviderFactory>().FirstOrDefault());
            ValueProviderFactories.Factories.Add(new MyJsonValueProviderFactory());
        }

        private static void ConfigureContainer()
        {
            var initializer = new Initializer();
            initializer.OnInitialize +=
                    (sender, e) => e.Builder.RegisterControllers(typeof(MvcApplication).Assembly);
            initializer.Initialize();

            var container = initializer.Container;

            //Set Autofac as Dependency Resolver
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
        }

        protected void Application_Error(object sender, EventArgs e)
        {
            HandleCustomErrors((HttpApplication)sender);
        }

        #region ERROR HANDLING

        private static CustomErrorsSection _customErrorsSection;
        private static CustomErrorsSection CustomErrorsSection
        {
            get
            {
                if (_customErrorsSection != null)
                {
                    return _customErrorsSection;
                }

                return _customErrorsSection = WebConfigurationManager.GetWebApplicationSection("system.web/customErrors") as CustomErrorsSection;
            }
        }

        private static void HandleCustomErrors(HttpApplication httpApplication)
        {
            // Lets remember the current error.
            var httpStatusCode = HttpStatusCode.InternalServerError;
            Exception currentError = httpApplication.Context.Error;
            if (currentError is HttpException)
            {
                var httpErrorException = currentError as HttpException;
                httpStatusCode = (HttpStatusCode)httpErrorException.GetHttpCode();
            }
            else if (currentError is NotAuthorizedException)
            {
                httpStatusCode = HttpStatusCode.Unauthorized;
            }

            //Log Error
            if (!IsFilteredException(currentError))
            {
                Log.Error(currentError);
            }

            //Is XMLHttpRequest
            bool isAjaxRequest = string.Equals("XMLHttpRequest", httpApplication.Context.Request.Headers["x-requested-with"], StringComparison.OrdinalIgnoreCase);
            if (isAjaxRequest)
            {
                RenderAjaxView(httpApplication.Context, currentError);
            }
            else
            {
                // Do not show the custom errors if
                // a) CustomErrors mode == "off" or not set.
                // b) Mode == RemoteOnly and we are on our local development machine.
                if (!httpApplication.Context.IsCustomErrorEnabled || (CustomErrorsSection.Mode == CustomErrorsMode.RemoteOnly && httpApplication.Context.Request.IsLocal))
                {
                    return;
                }

                RenderNormalView(httpApplication.Context, currentError, httpStatusCode);
            }

            httpApplication.Context.ClearError();
            httpApplication.Context.Response.TrySkipIisCustomErrors = true;
        }

        private static void RenderAjaxView(HttpContext httpContext, Exception currentError)
        {
            bool exceptionHandled = false;
            string errorMessage = string.Empty;
            JsonResult jsonResult;
            ErrorsController errorController = new ErrorsController();
            ControllerContext controllerContext = new ControllerContext(httpContext.Request.RequestContext, errorController);

            if (currentError is NotAuthenticatedException)
            {
                jsonResult = new JsonResult
                {
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                    ContentType = "application/json; charset=utf-8",
                    Data = new { ErrorMessage = currentError.Message }
                };
                jsonResult.ExecuteResult(controllerContext);
                httpContext.Response.StatusCode = 401;
                return;
            }

            if (currentError is JsonException)
            {
                errorMessage = (currentError as JsonException).Message;
                exceptionHandled = true;
            }
            else if (currentError is ModelException)
            {
                ModelException modelException = currentError as ModelException;
                //isprati ja greskata na klientot
                jsonResult = new JsonResult
                                 {
                                     JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                                     ContentType = "application/json; charset=utf-8",
                                     Data = modelException.Model
                                 };
                jsonResult.ExecuteResult(controllerContext);
                httpContext.Response.StatusCode = 409;
                return;
            }
            else if (currentError is GenericADOException)
            {
                var genericADOException = ((GenericADOException)currentError);
                var sqlException = genericADOException.InnerException as SqlException;
                if (sqlException != null)
                {
                    var sqlErrorMessage = GetSqlExceptionMessage(sqlException.Number);
                    if (!string.IsNullOrEmpty(sqlErrorMessage))
                    {
                        errorMessage =
                            !httpContext.IsDebuggingEnabled
                            ? "Системска грешка."
                            : string.Format("{0} | {1}", sqlException.Message, sqlErrorMessage);
                        exceptionHandled = true;
                    }
                }
            }
            else if (currentError is TransactionException)
            {
                var transactionException = (TransactionException)currentError;
                if (transactionException.InnerException is TimeoutException)
                {
                    errorMessage = "Во моментов системот е оптеретен. Ве молиме обидете се повторно.";
                    exceptionHandled = true;
                }
            }

            //Ako ne e poznat tipot na greska zemi gi detalite od samiot exception
            if (!exceptionHandled)
            {
                errorMessage = !httpContext.IsDebuggingEnabled
                    ? "Системска грешка."
                    : GetExceptionDetails(currentError);
            }

            //isprati ja greskata na klientot
            jsonResult = new JsonResult
                             {
                                 JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                                 ContentType = "application/json; charset=utf-8",
                                 Data = new { ErrorMessage = errorMessage }
                             };

            jsonResult.ExecuteResult(controllerContext);
            httpContext.Response.StatusCode = 409;
        }

        private static void RenderNormalView(HttpContext httpContext, Exception currentError, HttpStatusCode httpStatusCode)
        {
            if (currentError is NotAuthenticatedException)
            {
                httpContext.Response.StatusCode = 401;
                return;
            }

            // What is the view we require?
            string redirectUrl = GetCustomErrorRedirect(httpStatusCode);
            if (string.IsNullOrEmpty(redirectUrl))
            {
                // Either
                // 1. No customErrors was provided (which would be weird cause how did we get here?)
                // 2. No redirect was provided for the httpStatus code.
                throw new InvalidOperationException("No redirectUrl was determined.");
            }

            var url = httpContext.Request.RawUrl;
            redirectUrl = redirectUrl + "?aspxerrorpath=" + url;

            httpContext.Application[httpContext.Request.UserHostAddress] = currentError;
            httpContext.Response.Redirect(redirectUrl, true);
        }

        private static string GetCustomErrorRedirect(HttpStatusCode httpStatusCode)
        {
            if (CustomErrorsSection == null)
            {
                return null;
            }

            string redirect = null;
            if (CustomErrorsSection.Errors != null)
            {
                CustomError customError = CustomErrorsSection.Errors[((int)httpStatusCode).ToString()];
                if (customError != null)
                {
                    redirect = customError.Redirect;
                }
            }

            // Have we a redirect, yet? If not, then use the default if we have that.
            return string.IsNullOrEmpty(redirect) ? CustomErrorsSection.DefaultRedirect : redirect;
        }

        private static bool IsFilteredException(Exception currentError)
        {
            if (currentError is JsonException)
            {
                return true;
            }

            if (currentError is ModelException)
            {
                return true;
            }

            return false;
        }

        private static string GetSqlExceptionMessage(int number)
        {
            //set default value which is the generic exception message
            string error;
            switch (number)
            {
                case 4060:
                    // Invalid Database
                    error = "DalFailedToConnectToTheDB";
                    break;
                case 18456:
                    // Login Failed
                    error = "DalFailedToLogin";
                    break;
                case 547:
                    // ForeignKey Violation
                    error = "DalFKViolation";
                    break;
                case 2627:
                    // Unique Index/Constriant Violation
                    error = "DalUniqueConstraintViolation";
                    break;
                case 2601:
                    // Unique Index/Constriant Violation
                    error = "DalUniqueConstraintViolation";
                    break;
                case 64:
                    // transport-level error has occurred 
                    error = "transport-level error";
                    break;
                default:
                    error = "DalGenericError";
                    break;
            }

            return error;
        }

        private static string GetExceptionDetails(Exception exception)
        {
            string exceptionString = "";

            try
            {
                int i = 0;
                while (exception != null)
                {
                    exceptionString += "*** Exception Level " + i + "***\n";
                    exceptionString += "Message: " + exception.Message + "\n";
                    exceptionString += "Source: " + exception.Source + "\n";
                    exceptionString += "Target Site: " + exception.TargetSite + "\n";
                    exceptionString += "Stack Trace: " + exception.StackTrace + "\n";
                    exceptionString += "Data: ";
                    exceptionString = exception.Data.Cast<DictionaryEntry>().Aggregate(exceptionString, (current, keyValuePair) => current + (keyValuePair.Key.ToString() + ":" + keyValuePair.Value.ToString()));
                    exceptionString += "\n***\n\n";

                    exception = exception.InnerException;

                    i++;
                }
            }
            catch
            {
            }

            return exceptionString;
        }

        #endregion
    }
}