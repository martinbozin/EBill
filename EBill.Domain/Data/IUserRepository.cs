
using Nextsense.Infrastructure.Data;
using System.Collections.Generic;

namespace EBills.Domain.Data
{
    public interface IUserRepository : IRepository<User>
    {
        User GetUserByUsername(string username, bool eager = false);
        //User GetUserByCertHash(string hash);
    }

    public interface IPublicUserRepository : IRepository<PublicUser>
    {

    }

}
