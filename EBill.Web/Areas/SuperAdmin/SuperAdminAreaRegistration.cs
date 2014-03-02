using System.Web.Mvc;

namespace EBills.Web.Areas.SuperAdmin
{
    public class SuperAdminRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "SuperAdmin";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "SuperAdmin_default",
                "SuperAdmin/{controller}/{action}/{id}",
                new { controller = "Home", action = "Index", id = UrlParameter.Optional },
                new[] { "EBills.Web.Areas.SuperAdmin.Controllers" }
            );
        }
    }
}
