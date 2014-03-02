using NHibernate;
using NHibernate.Cfg;

namespace EBills.Data.NHibernate.NHibernate
{
    public class SessionFactory
    {
        private static ISessionFactory _sessionFactory;
        private static readonly object Lock = new object();

        public static void Init()
        {
            lock (Lock)
            {
                var config = new Configuration();

                config.Configure();
                config.BuildMappings();

                //Set AuditInterceptor
                //config.SetInterceptor(new AuditInterceptor());

                if (_sessionFactory == null)
                {
                    _sessionFactory = config.BuildSessionFactory();
                }
            }
        }

        public static ISessionFactory GetSessionFactory()
        {
            if (_sessionFactory == null)
                Init();

            return _sessionFactory;
        }

        public static ISession GetNewSession()
        {
            return GetSessionFactory().OpenSession();
        }
    }

}
