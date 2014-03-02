
using Nextsense.Infrastructure.Data;
using NHibernate;
using NHibernate.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EBills.Data.NHibernate.NHibernate
{
    public class NHRepository<TEntity> : IRepository<TEntity>
        where TEntity : class
    {
        protected ISession Session
        {
            get
            {
                //Dokolku sme vo scope
                //togash sesijata se zema od samiot scope
                NHUnitOfWork hibernateUnitOfWork = UnitOfWorkScope.CurrentUnitOfWork as NHUnitOfWork;
                if (hibernateUnitOfWork != null)
                {
                    return hibernateUnitOfWork.Session;
                }

                if (HttpContext.Current != null)
                {
                    //Ako nema scope togas pretpostavuvame deka sekako ova se izvrsuva vo web i zaradi toa nema da go tapam so drug tip na context;
                    //Ova podrazbira deka na prvoto baranje na sesija od bilo koe repository kje se odi do HttpContext i od tamu kje se zeme ISession
                    //Ovaa sesija e bez transakcija
                    //Isto taka vo nitu eden metod od repositorijata ne se zatvara a i ne i se pravi flush
                    //vo Global.asa na EndRequest se povikuva Close metodot. Close ne pravi flush
                    //Dokolku se koristi sesijata na ovoj nacin togas posle rabota so nea treba da se napravi flush oti inaku nema niedna promena da bide zapisana
                    ISession session = NHibernateHelper.GetSessionFromWebRequestContext() ??
                                       NHibernateHelper.OpenSessionInWebRequestContext();
                    if (session != null)
                    {
                        return session;
                    }
                }

                throw new Exception("not vaild unit of work");
            }

        }

        public TEntity Get(object id)
        {
            return Session.Get<TEntity>(id);
        }

        public List<TEntity> GetAll()
        {
            return Session.Query<TEntity>().ToList();
        }

        public IQueryable<TEntity> Query()
        {
            return Session.Query<TEntity>();
        }

        public void Save(TEntity entity)
        {
            Session.Save(entity);
            Session.Flush();
        }

        public void Update(TEntity entity)
        {
            Session.Update(entity);
            Session.Flush();
        }

        public void SaveOrUpdate(TEntity entity)
        {
            Session.SaveOrUpdate(entity);
            Session.Flush();
        }

        public void Update2(TEntity entity)
        {
            Session.Merge(entity);
            Session.Flush();
        }

        public void Delete(TEntity entity)
        {
            Session.Delete(entity);
            Session.Flush();
        }

        public void DeleteById(object id)
        {
            var queryString = string.Format("delete {0} where id = :id", typeof(TEntity));
            Session.CreateQuery(queryString).SetParameter("id", id).ExecuteUpdate();
            Session.Flush();
        }
    }
}
