using System.Linq;
using NHibernate.Linq;
using EBills.Data.NHibernate.NHibernate;
using EBills.Domain;
using EBills.Domain.Data;


namespace EBills.Data.NHibernate.Impl
{
    public class LocalizationRepository : NHRepository<Localization>, ILocalizationRepository
    {
        public Localization GetLocalizationByKey(string key)
        {
            return
                Session.Query<Localization>()
                .FirstOrDefault(x => x.Key == key);
        }
    }
}
