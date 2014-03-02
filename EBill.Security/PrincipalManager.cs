using EBills.Domain;
using EBills.Domain.Data;
using Microsoft.Practices.ServiceLocation;
using System.Web;
 
namespace EBills.Security
{
    public class PrincipalManager
    {
        private const string Key = "Context.User";

        /// <summary>
        ///Get from cache if exists 
        /// or 
        ///create for first time 
        /// </summary>
        /// <returns></returns>
        public CustomPrincipal CreatePrincipal()
        {
            var user = (HttpContext.Current.Items[Key] as User);

            //get the current identity
            var id = HttpContext.Current.User.Identity;

            if (user == null)
            {
                var userRepository = ServiceLocator.Current.GetInstance<IUserRepository>();
                user = userRepository.GetUserByUsername(id.Name, true);
                if (user == null)
                {
                    throw new NotAuthorizedException(id.Name + " is not authorized.");
                }
            }

            //HttpContext.Current.Items[Key] = user;
            var principal = new CustomPrincipal(id, user);
            return principal;
        }

        /// <summary>
        /// Create new Instance from PrincipalManager
        /// </summary>
        public static PrincipalManager Instance
        {
            get
            {
                return new PrincipalManager();
            }
        }
    }
}
