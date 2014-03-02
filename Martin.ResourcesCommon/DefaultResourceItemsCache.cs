using log4net;
using Martin.ResourcesCommon.Properties;
using System;
using System.Web;

namespace Martin.ResourcesCommon
{
    public class DefaultResourceItemsCache : IResourceItemsCache
    {
        private static readonly ILog log = LogManager.GetLogger("DEFAULTRESOURCEITEMSCACHE");

        public void AddResourceItemsToCache(string key, object items)
        {
            try
            {
                HttpContext.Current.Cache.Remove(key);
                HttpContext.Current.Cache.Add(
                    key,
                    items,
                    null,
                    DateTime.Now.AddMinutes(Settings.Default.CacheDurationMinutes),
                    System.Web.Caching.Cache.NoSlidingExpiration,
                    System.Web.Caching.CacheItemPriority.Normal,
                    null);
            }
            catch (Exception ex)
            {
                log.Error(ex);
                throw;
            }
        }

        public object GetResourceItemsFromCache(string key)
        {
            return HttpContext.Current.Cache[key];            
        }
    }
}
