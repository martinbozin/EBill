using log4net.Config;
using NHibernate;
using NUnit.Framework;
using ServiceLocatorInitializer;

namespace EBills.IntegrationTests.Helpers
{
    public abstract class SessionfullTest
    {
        protected ISession session;

        [SetUp]
        public virtual void Setup()
        {
            XmlConfigurator.Configure();

            var initializer = new Initializer();
            initializer.Initialize();

            session = SessionFactoryHelper.SessionFactory.OpenSession();
            session.BeginTransaction();
        }

        [TearDown]
        public virtual void Cleanup()
        {
            session.Transaction.Rollback();
            session.Close();
        }

        public ISession Session
        {
            get
            {
                return session;
            }
        }
    }
}