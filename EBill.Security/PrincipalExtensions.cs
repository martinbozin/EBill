using System.Linq;
using System.Security.Principal;

namespace EBills.Security
{
    public static class PrincipalExtensions
    {
        public static bool HasAnyRole(this IPrincipal user, params string[] roles)
        {
            return roles.Any(user.IsInRole);
        }

    }
}
