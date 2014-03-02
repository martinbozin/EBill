using System.Configuration;
using EBills.Infrastructure.MVC.Notification;
using System.Web.Mvc;

namespace EBills.Web
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            // filters.Add(new HandleErrorAttribute());
            filters.Add(new AjaxMessagesFilter());

            //SET SSL IF IN PRODUCTION
            var enableSslRedirect = ConfigurationManager.AppSettings["EnableSSLRedirect"];
            if (!string.IsNullOrEmpty(enableSslRedirect)) return;
            if (enableSslRedirect == "true")
            {
                filters.Add(new RequireHttpsAttribute());
            }
        }
    }
}