using Nextsense.Infrastructure.Data;

namespace EBills.Domain.Data
{
    public interface ILocalizationRepository : IRepository<Localization>
    {
        Localization GetLocalizationByKey(string key);
    }
}
