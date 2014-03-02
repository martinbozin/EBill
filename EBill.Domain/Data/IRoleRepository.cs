
using Nextsense.Infrastructure.Data;

namespace EBills.Domain.Data
{
    public interface IRoleRepository : IRepository<Role>
    {
        Role GetRoleByName(string username);
    }
}
