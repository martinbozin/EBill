using Nextsense.Infrastructure.Data;

namespace VipTopUp.Domain.Data
{
    public interface IBackendUserRepository : IRepository<BackendUser>
    {
        //List<BackendUser> GetUsersByInstitutionAndRole(Institution institution, string roleName);
        //List<BackendUser> GetUsersByInstitutionTagAndRole(string tag, string roleName);
    }
}