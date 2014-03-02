using System;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EBills.Security
{
    public class CustomAuthorize : AuthorizeAttribute
    {
        public string[] AuthorizedRoles { get; set; }

        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            if (AuthorizeCore(filterContext.HttpContext))
                return;

            if (filterContext.HttpContext.User.Identity.IsAuthenticated)
            {
                var user = filterContext.HttpContext.User;
                throw new NotAuthorizedException(user.Identity.Name + " is not authorized.");
            }

            //go to loogin page
            filterContext.Result = new HttpUnauthorizedResult();
        }

        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            if (httpContext == null)
            {
                throw new ArgumentNullException("httpContext");
            }

            if (httpContext.Session == null ||
                httpContext.User == null)
            {
                return false;
            }

            if (!httpContext.User.Identity.IsAuthenticated)
            {
                return false;
            }

            if (httpContext.User.IsInRole(Domain.Roles.SuperAdmin))
            {
                return true;
            }

            return AuthorizedRoles.Length != 0 && AuthorizedRoles.Any(httpContext.User.IsInRole);
        }
    }
}
