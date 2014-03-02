using NHibernate;
using NHibernate.Cfg;

namespace EBills.IntegrationTests.Helpers
{
    public static class SessionFactoryHelper
    {
        private static ISessionFactory _sessionFactory;

        public static ISessionFactory SessionFactory
        {
            get
            {
                if (_sessionFactory == null)
                {

                    var config = new Configuration();

                    config.Configure();
                    config.BuildMappings();

                    config.SetProperty(NHibernate.Cfg.Environment.ShowSql, "true");

                    //Set AuditInterceptor
                    //config.SetInterceptor(new EBills.IntegrationTests.Helpers.AuditInterceptor());

                    _sessionFactory = config.BuildSessionFactory();

                }
                return _sessionFactory;
            }
        }
    }
}
