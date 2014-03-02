using Autofac;
using Nextsense.Infrastructure.Data;
using NHibernate;

namespace EBills.Data.NHibernate.NHibernate
{
    public class NHConfiguration
    {
        public NHConfiguration Configure(ContainerBuilder builder)
        {
            var sessionFactory = SessionFactory.GetSessionFactory();

            //Register to IOC
            builder.RegisterInstance(sessionFactory).As<ISessionFactory>();
            builder.RegisterType<NHUnitOfWork>().As<IUnitOfWork>();
            builder.RegisterGeneric(typeof(NHRepository<>)).As(typeof(IRepository<>));

            return this;
        }
    }
}
