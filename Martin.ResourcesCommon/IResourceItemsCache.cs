namespace Martin.ResourcesCommon
{
    public interface IResourceItemsCache
    {
        void AddResourceItemsToCache(string key, object items);

        object GetResourceItemsFromCache(string key);
    }
}
