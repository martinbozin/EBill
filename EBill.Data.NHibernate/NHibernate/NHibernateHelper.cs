using log4net;
using Microsoft.Practices.ServiceLocation;
using NHibernate;
using System.Web;

namespace EBills.Data.NHibernate.NHibernate
{
    public static class NHibernateHelper
    {
        private const string WebRequestKey = "HibernateRepository.Session";

        private static readonly ILog Log = LogManager.GetLogger("REPOSITORY");

        public static ISession OpenSessionInWebRequestContext()
        {
            if (HttpContext.Current != null)
            {
                ISession session = GetSessionFromWebRequestContext();
                if (session == null)
                {
                    Log.Debug("Open Http session");
                    session = ServiceLocator.Current.GetInstance<ISessionFactory>().OpenSession();
                    session.FlushMode=FlushMode.Never;
                    HttpContext.Current.Items.Add(WebRequestKey, session);
                }
                return session;
            }

            return null;
        }

        public static void CloseSessionInWebRequestContext()
        {
            if (HttpContext.Current != null)
            {
                ISession session = HttpContext.Current.Items[WebRequestKey] as ISession;
                if (session != null)
                {
                    if (session.IsOpen)
                    {
                        Log.Debug("Close Http session");
                        session.Close();
                    }

                    try
                    {
                        session.Dispose();
                    }
                        // ReSharper disable EmptyGeneralCatchClause
                    catch
                        // ReSharper restore EmptyGeneralCatchClause
                    {

                    }
                }
            }
        }

        public static ISession GetSessionFromWebRequestContext()
        {
            if (HttpContext.Current != null)
            {
                return HttpContext.Current.Items[WebRequestKey] as ISession;
            }
            return null;
        }
    }
}
