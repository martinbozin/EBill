using System.Web.Mvc;

namespace EBills.Web.Controllers
{
    public class UpgradeBrowserController : Controller
    {
        //
        // GET: /UpgradeBrowser/
        public ActionResult Index()
        {
            if (Session != null && Session["browserChecked"] != null)
            {
                Session["browserChecked"] = null;
            }
            return View();
        }

    }
}
