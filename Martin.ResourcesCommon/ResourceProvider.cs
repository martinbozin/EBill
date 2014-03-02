using log4net;
using Martin.ResourcesCommon.Properties;
using Martin.ResourcesCommon.Domain;
using System;
using System.Collections.Generic;
using System.Text;
using System.Web;
using Martin.ResourcesCommon.Data;

namespace Martin.ResourcesCommon
{
    public class ResourceProvider
    {
        private static readonly ILog log = LogManager.GetLogger("RESOURCEPROVIDER");

        private IResourceItemsCache currentCache;

        public IResourceItemsCache CurrentCache
        {
            get
            {
                if (currentCache == null)
                {
                    if (HttpContext.Current.Cache["ResourceItemsCache"] != null)
                    {
                        currentCache = (IResourceItemsCache)HttpContext.Current.Cache["ResourceItemsCache"];
                    }
                    else
                    {
                        currentCache = new DefaultResourceItemsCache();
                    }
                }

                return currentCache;
            }

            set
            {
                HttpContext.Current.Cache.Remove("ResourceItemsCache");
                HttpContext.Current.Cache.Add(
                    "ResourceItemsCache",
                    value,
                    null,
                    System.Web.Caching.Cache.NoAbsoluteExpiration,
                    System.Web.Caching.Cache.NoSlidingExpiration,
                    System.Web.Caching.CacheItemPriority.Normal,
                    null);
                currentCache = value;
            }
        }

        public string GetResourceValue(string key, string language)
        {
            try
            {
                List<LocalizedValue> items = new List<LocalizedValue>();
                items = GetLocalization(language);

                LocalizedValue item = null;

                foreach (LocalizedValue value in items)
                {
                    if (value.Key.Trim().Equals(key.Trim(), StringComparison.InvariantCultureIgnoreCase))
                    {
                        item = value;
                        break;
                    }
                }

                if (item == null)
                {
                    log.Error(string.Format("Cannot find localization item with key='{0}' for language='{1}'", key, language));
                    return string.Empty;
                }

                if (string.IsNullOrEmpty(item.Value))
                {
                    log.Error(string.Format("Localization value for key='{0}' and language='{1}' is empty", key, language));
                    return string.Empty;
                }

                return item.Value;
            }
            catch (Exception ex)
            {
                log.Error(key);
                log.Error(ex);
                throw;
            }
        }

        public static string GetFileUrl1(string filename, string language)
        {
            try
            {
                return GetFileUrl(Settings.Default.ImageUrl1, filename, language);
            }
            catch (Exception ex)
            {
                log.Error(ex);
                throw;
            }
        }

        public static string GetFileUrl2(string filename, string language)
        {   try
            {
                return GetFileUrl(Settings.Default.ImageUrl2, filename, language);
            }
            catch (Exception ex)
            {
                log.Error(ex);
                throw;
            }
        }

        public static string GetFileUrl3(string filename, string language)
        {
            try
            {
                return GetFileUrl(Settings.Default.ImageUrl3, filename, language);
            }
            catch (Exception ex)
            {
                log.Error(ex);
                throw;
            }
        }

        public static string GetFileUrl4(string filename, string language)
        {
            try
            {
                return GetFileUrl(Settings.Default.ImageUrl4, filename, language);
            }
            catch (Exception ex)
            {
                log.Error(ex);
                throw;
            }
        }

        public static string GetFileUrl5(string filename, string language)
        {
            try
            {
                return GetFileUrl(Settings.Default.ImageUrl5, filename, language);
            }
            catch (Exception ex)
            {
                log.Error(ex);
                throw;
            }
        }

        public static string GetFileUrl(string formatedPath, string filename, string language)
        {
            try
            {
                return string.Format(formatedPath, language, filename);
            }
            catch (Exception ex)
            {
                log.Error(ex);
                throw;
            }
        }

        public void UpdateResourceValues(List<string> keys, List<string> values, bool isJS, string language)
        {
            try
            {
                ResourcesCommonDataProvider provider = new ResourcesCommonDataProvider();

                List<LocalizedValue> items = isJS ? provider.GetLocalizationByKeyAndLanguageAndType(null, language, isJS) : this.GetLocalization(language);
                for (int i = 0; i < keys.Count; i++)
                {
                    int index = items.FindIndex(delegate(LocalizedValue value)
                    {
                        return value.Key == keys[i];
                    });

                    items[index].Value = values[i];
                    SaveLocalizedValue(items[index]);
                }
                string cacheKey = isJS ? language + "_js" : language;

                object toMemory = items;
                if (isJS)
                {
                    toMemory = GetJavaScriptFromList(items);
                }
                this.CurrentCache.AddResourceItemsToCache(cacheKey, toMemory);
            }
            catch (Exception ex)
            {
                log.Error(ex);
                throw;
            }
        }

        public void CreateLocalizedValue(LocalizedValue localizedValue)
        {
            try
            {
                ResourcesCommonDataProvider provider = new ResourcesCommonDataProvider();

                provider.Create(localizedValue);
                List<LocalizedValue> items = provider.GetLocalizationByKeyAndLanguageAndType(null, localizedValue.Language, localizedValue.JavaScript);

                string cacheKey = localizedValue.Language.ToUpper() + (localizedValue.JavaScript ? "_js" : "");

                object toMemory = items;
                if (localizedValue.JavaScript)
                {
                    toMemory = GetJavaScriptFromList(items);
                }
                CurrentCache.AddResourceItemsToCache(cacheKey, toMemory);
            }
            catch (Exception ex)
            {
                log.Error(ex);
            }
        }

        public void SaveLocalizedValue(LocalizedValue localizedValue)
        {
            try
            {
                ResourcesCommonDataProvider provider = new ResourcesCommonDataProvider();

                provider.Save(localizedValue);
                List<LocalizedValue> items = provider.GetLocalizationByKeyAndLanguageAndType(null, localizedValue.Language, localizedValue.JavaScript);

                string cacheKey = localizedValue.Language.ToUpper() + (localizedValue.JavaScript ? "_js" : "");

                object toMemory = items;
                if (localizedValue.JavaScript)
                {
                    toMemory = GetJavaScriptFromList(items);
                }
                CurrentCache.AddResourceItemsToCache(cacheKey, toMemory);
            }
            catch (Exception ex)
            {
                log.Error(ex);
                throw;
            }
        }

        public void DeleteLocalizedValue(Guid id)
        {
            try
            {
                ResourcesCommonDataProvider provider = new ResourcesCommonDataProvider();
                LocalizedValue localizedValue = provider.GetLocalizedValue(id);

                provider.Delete(localizedValue.Id);
                List<LocalizedValue> items = provider.GetLocalizationByKeyAndLanguageAndType(null, localizedValue.Language, localizedValue.JavaScript);

                string cacheKey = localizedValue.Language.ToUpper() + (localizedValue.JavaScript ? "_js" : "");

                object toMemory = items;
                if (localizedValue.JavaScript)
                {
                    toMemory = GetJavaScriptFromList(items);
                }
                CurrentCache.AddResourceItemsToCache(cacheKey, toMemory);
            }
            catch (Exception ex)
            {
                log.Error(ex);
                throw;
            }
        }

        public List<LocalizedValue> GetLocalization(string language)
        {
            try
            {
                if (CurrentCache.GetResourceItemsFromCache(language) != null)
                {
                    return (List<LocalizedValue>)CurrentCache.GetResourceItemsFromCache(language);
                }
                else
                {
                    ResourcesCommonDataProvider provider = new ResourcesCommonDataProvider();
                    List<LocalizedValue> items = provider.GetLocalizationByKeyAndLanguageAndType(null, language, false);
                    CurrentCache.AddResourceItemsToCache(language, items);

                    return items;
                }
            }
            catch (Exception ex)
            {
                log.Error(ex);
                throw;
            }
        }

        public static List<LocalizedValue> GetLocalizationFiltered(string key, string value, string language, bool? javascript)
        {
            try
            {
                ResourcesCommonDataProvider provider = new ResourcesCommonDataProvider();
                List<LocalizedValue> items = provider.GetLocalizationFilteredNotPaged(key, value, language, javascript);

                return items;
            }
            catch (Exception ex)
            {
                log.Error(ex);
                throw;
            }
        }

        public string GetJsLocalization(string language)
        {
            try
            {
                if (CurrentCache.GetResourceItemsFromCache(language + "_js") != null)
                {
                    return CurrentCache.GetResourceItemsFromCache(language + "_js").ToString();
                }
                else
                {
                    ResourcesCommonDataProvider provider = new ResourcesCommonDataProvider();
                    List<LocalizedValue> items = provider.GetLocalizationByKeyAndLanguageAndType(null, language, true);
                    string js = GetJavaScriptFromList(items);
                    CurrentCache.AddResourceItemsToCache(language + "_js", js);
                    return js;
                }
            }
            catch (Exception ex)
            {
                log.Error(ex);
                throw;
            }
        }

        private static string GetJavaScriptFromList(List<LocalizedValue> items)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("var languagePack = { ");
            foreach (LocalizedValue item in items)
            {
                sb.Append(string.Format("'{0}': '{1}', ", item.Key, item.Value));
            }
            if (items.Count > 0)
            {
                string text = sb.ToString();
                sb = new StringBuilder(text.Substring(0, text.Length - 2));
            }
            sb.AppendLine(" };");

            return sb.ToString();
        }
    }
}
