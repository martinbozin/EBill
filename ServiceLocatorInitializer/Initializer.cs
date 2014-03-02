using Autofac;
using Autofac.Configuration;
using Autofac.Extras.CommonServiceLocator;
using EBills.Data.NHibernate.NHibernate;
using Microsoft.Practices.ServiceLocation;
using System;
using System.Diagnostics;

namespace ServiceLocatorInitializer
{
    public class InitializerEventArgs
    {
        public ContainerBuilder Builder { get; set; }
    }

    public class Initializer
    {
        private IContainer _container;

        public IContainer Container
        {
            get
            {
                return _container;
            }
        }

        [DebuggerStepThrough]
        public void Initialize()
        {
            var builder = new ContainerBuilder();
            builder.RegisterModule(new ConfigurationSettingsReader());

            if (OnInitialize != null)
            {
                OnInitialize(this, new InitializerEventArgs()
                                      {
                                          Builder = builder
                                      });
            }

            //Initialize NHibernate
            new NHConfiguration().Configure(builder);

            //Build The IOC
            _container = builder.Build();

            //Set Autofac as Common Service Locator
            ServiceLocator.SetLocatorProvider(() => new AutofacServiceLocator(Container));
        }

        public event EventHandler<InitializerEventArgs> OnInitialize;
    }
}
