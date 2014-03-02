using System.Collections.Generic;
using NHibernate.Linq;
using VipTopUp.Data.NHibernate.NHibernate;
using VipTopUp.Domain;

namespace VipTopUp.Data.NHibernate.Impl
{
    public class BackendUserRepository : NHRepository<BackendUser>, IBackendUserRepository
    {
        /// <summary>
        /// Ги дава сите корисници од дадена институција кои 
        /// се во соодветната група
        /// </summary>
        /// <param name="institution"></param>
        /// <param name="roleName"></param>
        /// <returns></returns>
        public List<BackendUser> GetUsersByInstitutionAndRole(Institution institution, string roleName)
        {
            //var users = Session.Query<BackendUser>().Where(
            //                x => x.Institution.Id == institution.Id
            //              && x.Roles.Any(z => z.RoleName == roleName)
            //              && x.IsActive
            //    );

            //return users.ToList();
            return null;
        }

        /// <summary>
        /// Ги дава сите корисници од дадена институција кои 
        /// се во соодветната група
        /// </summary>
        /// <param name="tag"></param>
        /// <param name="roleName"></param>
        /// <returns></returns>
        public List<BackendUser> GetUsersByInstitutionTagAndRole(string tag, string roleName)
        {
            var users = Session.Query<BackendUser>().Where(
                x => x.Institution.Tag == tag
                     && x.Roles.Any(z => z.RoleName == roleName)
                     && x.IsActive
                );

            return users.ToList();
        }
    }
}