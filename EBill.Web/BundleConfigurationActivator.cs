using System.Web.Optimization;

[assembly: WebActivator.PostApplicationStartMethod(typeof(EBills.Web.BundleConfigurationActivator), "Activate")]
namespace EBills.Web
{
    public static class BundleConfigurationActivator
    {
        public static void Activate()
        {
            BundleTable.Bundles.RegisterConfigurationBundles();
        }
    }
}