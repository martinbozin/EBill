using log4net;
using Martin.ResourcesCommon.Data;
using Martin.ResourcesCommon.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.UI;

namespace Martin.ResourcesCommon
{
    public static class ResourceManager
    {
        private static readonly ILog log = LogManager.GetLogger("RESOURCEMANAGER");

        #region Misc public methods

        public static string GetCurrentLanguage()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (HttpContext.Current.Session["CurrentLanguage"] == null)
                    {
                        SetCurrentLanguageForCurrentUser();
                    }

                    return ((Language)HttpContext.Current.Session["CurrentLanguage"]).ShortTitle;
                }

                ResourcesCommonDataProvider provider = new ResourcesCommonDataProvider();
                return provider.GetDefaultLanguage().ShortTitle;
            }
            catch (Exception ex)
            {
                log.Error(ex);
                return null;
            }
        }

        public static Language GetCurrentLanguageObject()
        {
            try
            {
                if (HttpContext.Current != null)
                {
                    if (HttpContext.Current.Session["CurrentLanguage"] == null)
                    {
                        SetCurrentLanguageForCurrentUser();
                    }

                    return (Language)HttpContext.Current.Session["CurrentLanguage"];
                }

                ResourcesCommonDataProvider provider = new ResourcesCommonDataProvider();
                return provider.GetDefaultLanguage();
            }
            catch (Exception ex)
            {
                log.Error(ex);
                return null;
            }
        }

        public static int GetCurrentCulture()
        {
            try
            {
                if (HttpContext.Current != null)
                {
                    if (HttpContext.Current.Session["CurrentLanguage"] == null)
                    {
                        SetCurrentLanguageForCurrentUser();
                    }

                    return Convert.ToInt32(((Language)HttpContext.Current.Session["CurrentLanguage"]).CultureID);
                }

                ResourcesCommonDataProvider provider = new ResourcesCommonDataProvider();
                return provider.GetDefaultLanguage().CultureID;
            }
            catch (Exception ex)
            {
                log.Error(ex);
                return -1;
            }
        }

        public static int GetPrefferedCulture()
        {
            try
            {
                ResourcesCommonDataProvider provider = new ResourcesCommonDataProvider();

                if (HttpContext.Current != null)
                {
                    if (HttpContext.Current.Session["PrefferedCultureID"] == null)
                    {
                        HttpContext.Current.Session["PrefferedCultureID"] = provider.GetDefaultLanguage().CultureID;
                    }

                    return Convert.ToInt32(HttpContext.Current.Session["PrefferedCultureID"]);
                }

                return provider.GetDefaultLanguage().CultureID;
            }
            catch (Exception ex)
            {
                log.Error(ex);
                return -1;
            }
        }

        public static void SetCurrentLanguageForCurrentUser()
        {
            try
            {
                ResourcesCommonDataProvider provider = new ResourcesCommonDataProvider();

                Language language = provider.GetPreferredLanguageForUser(HttpContext.Current.User.Identity.Name);
                //Language language = provider.GetPreferredLanguageForUser(HttpContext.Current.Session["Username"].ToString());

                HttpContext.Current.Session["CurrentLanguage"] = language;
            }
            catch (Exception ex)
            {
                log.Error(ex);
            }
        }

        public static void SetCurrentLanguageForCurrentUser(int id)
        {
            try
            {
                ResourcesCommonDataProvider provider = new ResourcesCommonDataProvider();

                provider.SavePreferredLanguageForUser(HttpContext.Current.User.Identity.Name, id);
                //provider.SavePreferredLanguageForUser(HttpContext.Current.Session["Username"].ToString(), id);

                Language language = provider.GetLanguageById(id);
                HttpContext.Current.Session["CurrentLanguage"] = language;
            }
            catch (Exception ex)
            {
                log.Error(ex);
            }
        }

        #endregion

        #region Public methods
        public static void RegisterJSResourcesOnPage(Page page)
        {
            string jsLocalization = GetJSResourceValues();
            page.ClientScript.RegisterClientScriptBlock(typeof(ResourceManager), "JSLocalization", jsLocalization, true);
        }

        public static string GetJSResourceValues()
        {
            try
            {
                if (GetCurrentLanguage() == null)
                {
                    SetCurrentLanguageForCurrentUser();
                }

                ResourceProvider provider = new ResourceProvider();

                return provider.GetJsLocalization(GetCurrentLanguage());
            }
            catch (Exception ex)
            {
                log.Error(ex);
                return "";
            }
        }

        public static string GetResourceValue(string key)
        {
            try
            {
                if (GetCurrentLanguage() == null)
                {
                    SetCurrentLanguageForCurrentUser();
                }

                ResourceProvider provider = new ResourceProvider();

                return provider.GetResourceValue(key, GetCurrentLanguage());
            }
            catch (Exception ex)
            {
                log.Error(key);
                log.Error(ex);
                return "";
            }
        }

        public static string GetFileUrl1(string filename)
        {
            try
            {
                return ResourceProvider.GetFileUrl1(filename, GetCurrentLanguage());
            }
            catch (Exception ex)
            {
                log.Error(ex);
                return "";
            }
        }

        public static string GetFileUrl2(string filename)
        {
            try
            {
                return ResourceProvider.GetFileUrl2(filename, GetCurrentLanguage());
            }
            catch (Exception ex)
            {
                log.Error(ex);
                return "";
            }
        }

        public static string GetFileUrl3(string filename)
        {
            try
            {
                return ResourceProvider.GetFileUrl3(filename, GetCurrentLanguage());
            }
            catch (Exception ex)
            {
                log.Error(ex);
                return "";
            }
        }

        public static string GetFileUrl4(string filename)
        {
            try
            {
                return ResourceProvider.GetFileUrl4(filename, GetCurrentLanguage());
            }
            catch (Exception ex)
            {
                log.Error(ex);
                return "";
            }
        }

        public static string GetFileUrl5(string filename)
        {
            try
            {
                return ResourceProvider.GetFileUrl5(filename, GetCurrentLanguage());
            }
            catch (Exception ex)
            {
                log.Error(ex);
                return "";
            }
        }

        public static void UpdateResourceValues(List<string> keys, List<string> values, bool isJS)
        {
            try
            {
                ResourceProvider provider = new ResourceProvider();
                provider.UpdateResourceValues(keys, values, isJS, GetCurrentLanguage());
            }
            catch (Exception ex)
            {
                log.Error(ex);
            }
        }

        public static void CreateLocalizedValue(LocalizedValue localizedValue)
        {
            try
            {
                ResourceProvider provider = new ResourceProvider();
                provider.CreateLocalizedValue(localizedValue);
            }
            catch (Exception ex)
            {
                log.Error(ex);
            }
        }

        public static void SaveLocalizedValue(LocalizedValue localizedValue)
        {
            try
            {
                ResourceProvider provider = new ResourceProvider();
                provider.SaveLocalizedValue(localizedValue);
            }
            catch (Exception ex)
            {
                log.Error(ex);
            }
        }

        public static void DeleteLocalizedValue(Guid id)
        {
            try
            {
                ResourceProvider resourceProvider = new ResourceProvider();
                resourceProvider.DeleteLocalizedValue(id);
            }
            catch (Exception ex)
            {
                log.Error(ex);
            }
        }

        public static void SetResourceItemsCache(IResourceItemsCache cache)
        {
            try
            {
                ResourceProvider provider = new ResourceProvider();
                provider.CurrentCache = cache;
            }
            catch (Exception ex)
            {
                log.Error(ex);
            }
        }

        #endregion

        #region MultilangValue methods
        #region Get Multilang Value

        /// <summary>
        /// Od multilang field vo baza ja vraka samo vrednosta za tekovniot jazik
        /// </summary>
        /// <param name="multilangstring"></param>
        /// <returns></returns>
        public static string GetMultilangValue(string multilangstring)
        {
            return GetMultilangValue(multilangstring, GetCurrentLanguage());
        }

        public static string GetMultilangValue(string multilangstring, string currentLang)
        {
            try
            {
                string[] values = multilangstring.Split(new string[] { @"</>" }, StringSplitOptions.RemoveEmptyEntries);

                foreach (string value in values)
                {
                    Match m = Regex.Match(value, string.Format("^<(.*)>", currentLang), System.Text.RegularExpressions.RegexOptions.IgnoreCase);
                    if (!m.Success) continue;

                    if (m.Groups[1].Value == currentLang)
                    {
                        return value.Substring(m.Groups[0].Index + m.Groups[0].Value.Length);
                    }
                }

                //Dokolku ne e najdena posakuvanata lokalizacija, vrati go prviot neprazen string
                for (int i = 0; i < values.Length; i++)
                {
                    if (!string.IsNullOrEmpty(values[i].Trim()))
                    {

                        Match m = Regex.Match(values[i], "^<(.*)>", System.Text.RegularExpressions.RegexOptions.IgnoreCase);

                        //se raboti za lokalizirana vrednost
                        if (m.Success)
                        {
                            return values[i].Substring(m.Groups[0].Index + m.Groups[0].Value.Length);
                        }

                        //ne se raboti za lokalizirana vrednost - vrati gi site karakteri
                        return values[i];
                    }
                }

                return string.Empty;
            }
            catch (Exception ex)
            {
                log.Error(string.Format("Get value from {0} on language {1}.", multilangstring, currentLang));
                log.Error(ex);
                return "";
            }
        }

        #endregion

        #region Set Multilang Value

        /// <summary>
        /// Od stringot na momentalniot jazik preveduva na site definirani jazici, i formima multilang string
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static string SetMultilangValue(string value)
        {
            try
            {
                ResourcesCommonDataProvider sqlprovider = new ResourcesCommonDataProvider();
                List<Language> languages = sqlprovider.GetContentEnabledLanguages();
                return SetMultilangValue(value, GetCurrentLanguageObject(), languages.ToArray());
            }
            catch (Exception ex)
            {
                log.Error(string.Format("Set multilang value {0}.", value));
                log.Error(ex);
                return "";
            }
        }

        public static string SetMultilangValue(string value, Language currentLanguage, params Language[] languages)
        {
            try
            {
                StringBuilder multilang = new StringBuilder();

                if (languages.Length == 1)
                {
                    return value;
                }

                foreach (Language language in languages)
                {
                    if (language.ShortTitle.Equals(currentLanguage.ShortTitle, StringComparison.InvariantCultureIgnoreCase))
                    {
                        multilang.Append(string.Format(@"<{0}>{1}</>", language.ShortTitle.ToUpper(), value));
                    }
                    else
                    {
                        try
                        {
                            multilang.Append(string.Format(@"<{0}>{1}</>", language.ShortTitle.ToUpper(), value));
                        }
                        catch (Exception)
                        {
                            multilang.Append(string.Format(@"<{0}>{1}</>", language, value));
                            throw;
                        }
                    }
                }

                return multilang.ToString();
            }
            catch (Exception ex)
            {
                log.Error(string.Format("Set multilang value {0}.", value));
                log.Error(ex);
                return "";
            }
        }

        #endregion

        #region Update Multilang Value

        /// <summary>
        /// Imame multilang string, i sakame da go apdejtirame so daden jazik
        /// </summary>
        /// <param name="multilangvalue"></param>
        /// <param name="singlelangvalue"></param>
        /// <returns></returns>
        public static string UpdateMultilangValue(string multilangvalue, string singlelangvalue)
        {
            return UpdateMultilangValue(multilangvalue, singlelangvalue, GetCurrentLanguage());
        }

        public static string UpdateMultilangValue(string multilangvalue, string singlelangvalue, string currentLang)
        {
            try
            {
                ResourcesCommonDataProvider sqlprovider = new ResourcesCommonDataProvider();
                List<Language> languages = sqlprovider.GetContentEnabledLanguages();
                string[] langs = (from l in languages select l.ShortTitle).ToArray();

                return UpdateMultilangValue(multilangvalue, singlelangvalue, currentLang, langs);
            }
            catch (Exception ex)
            {
                log.Error(string.Format("Update {0} with {1} on language {2}.", multilangvalue, singlelangvalue, currentLang));
                log.Error(ex);
                return "";
            }
        }

        public static string UpdateMultilangValue(string multilangvalue, string singlelangvalue, string currentLang, params string[] languages)
        {
            try
            {
                if (languages.Length == 1)
                {
                    return singlelangvalue;
                }

                StringBuilder updatedvalue = new StringBuilder();
                string[] values = multilangvalue.Split(new string[] { @"</>" }, StringSplitOptions.RemoveEmptyEntries);

                bool langfound = false;

                foreach (string value in values)
                {
                    Match m = Regex.Match(value, string.Format("^<(.*)>", currentLang), System.Text.RegularExpressions.RegexOptions.IgnoreCase);
                    if (!m.Success) continue;

                    if (m.Groups[1].Value.Equals(currentLang, StringComparison.InvariantCultureIgnoreCase))
                    {
                        updatedvalue.Append(string.Format(@"<{0}>{1}</>", currentLang.ToUpper(), singlelangvalue));
                        langfound = true;
                    }
                    else
                    {
                        updatedvalue.Append(string.Format(@"{0}</>", value));
                    }
                }

                if (!langfound)
                {
                    updatedvalue.Append(string.Format(@"<{0}>{1}</>", currentLang.ToUpper(), singlelangvalue));
                }

                return updatedvalue.ToString();
            }
            catch (Exception ex)
            {
                log.Error(string.Format("Update {0} with {1} on language {2}.", multilangvalue, singlelangvalue, currentLang));
                log.Error(ex);
                return "";
            }
        }

        #endregion
        #endregion
    }

}
