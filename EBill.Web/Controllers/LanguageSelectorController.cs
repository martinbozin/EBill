using EBills.Web.Controllers.Shared.Base;
using Martin.ResourcesCommon;
using Martin.ResourcesCommon.Data;
using Martin.ResourcesCommon.Domain;
using System.Collections.Generic;
using System.Web.Mvc;

namespace EBills.Web.Controllers
{
    [Authorize]
    public class LanguageSelectorController : AppControllerBase
    {
        [HttpGet]
        public ActionResult OnLanguageSelectorClick(string Language)
        {
            ResourcesCommonDataProvider rcdataprovider = new ResourcesCommonDataProvider();
            List<Language> languages = rcdataprovider.GetAllEnabledLanguages();

            foreach (Language lang in languages)
            {
                if (lang.ShortTitle == Language)
                {
                    ResourceManager.SetCurrentLanguageForCurrentUser(lang.Id);
                    break;
                }
            }

            if (Request.UrlReferrer != null) return Redirect(Request.UrlReferrer.ToString());
            return RedirectToAction("Index", "Home");
        }
    }

    [Authorize]
    public class RoleSelectorController : AppControllerBase
    {
        [HttpGet]
        public ActionResult OnRoleSelectorClick(string roleName)
        {
            if (User.IsInRole(roleName))
                CurrentPrincipal.ActiveRoleName = roleName;

            return RedirectToAction("Index", "Home");
        }
    }
}
