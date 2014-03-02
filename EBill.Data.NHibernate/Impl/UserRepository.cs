using EBills.Data.NHibernate.NHibernate;
using EBills.Domain;
using EBills.Domain.Data;
using NHibernate.Linq;
using System.Linq;

namespace EBills.Data.NHibernate.Impl
{
    public class UserRepository : NHRepository<User>, IUserRepository
    {
        /// <summary>
        /// Функцијава врака USER назависно дали е Backend или Public
        /// </summary>
        /// <param name="username">Корисничко име</param>
        /// <param name="eager">Дали да ги вчита и улогите</param>
        /// <returns>User или Коринсик во системот</returns>
        public User GetUserByUsername(string username, bool eager = false)
        {
            if (eager)
            {
                return Session.QueryOver<User>()
                    .Where(x => x.UserName == username)
                    .Fetch(x => x.Roles).Eager
                    .SingleOrDefault();
            }

            return Session.Query<User>()
                          .FirstOrDefault(x => x.UserName == username);
        }

        //public User GetUserByCertHash(string hash)
        //{
        //    return Session.Query<User>()
        //                  .FirstOrDefault(x => x.CertificateHash == hash);
        //}
    }

    public class PublicUserRepository : NHRepository<PublicUser>, IPublicUserRepository
    {

    }
}
