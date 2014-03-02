using EBills.Data.NHibernate.NHibernate;
using EBills.Domain;
using EBills.Domain.Data;
using NHibernate.Linq;
using System.Linq;

namespace EBills.Data.NHibernate.Impl
{
    public class RoleRepository : NHRepository<Role>, IRoleRepository
    {
        public Role GetRoleByName(string roleName)
        {
            return
               Session.Query<Role>()
               .FirstOrDefault(x => x.RoleName == roleName);
        }
    }
}
