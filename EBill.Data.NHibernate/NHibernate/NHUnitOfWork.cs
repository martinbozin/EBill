
using Nextsense.Infrastructure.Data;
using NHibernate;


namespace EBills.Data.NHibernate.NHibernate
{
    public class NHUnitOfWork : IUnitOfWork
    {
        private readonly ISession _session;

        public NHUnitOfWork(ISessionFactory sessionFactory)
        {
            _session = sessionFactory.OpenSession();
        }

        public void Flush()
        {
            _session.Flush();
        }

        public void Discard(object entyty)
        {
            _session.Evict(entyty);
        }

        public ISession Session
        {
            get { return _session; }
        }

        public void Dispose()
        {
            _session.Close();
            _session.Dispose();
        }
    }
}
