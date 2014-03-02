using System.Web;
using EBills.Domain;
using System;
using System.Linq;
using System.Security.Principal;

namespace EBills.Security
{
    /// <summary>
    /// Најавен корисник на системот
    /// </summary>
    public class CustomPrincipal : IPrincipal
    {
        private readonly IIdentity _identity;
        private readonly User _userData;

        /// <summary>
        /// Конструктор
        /// </summary>
        /// <param name="id">Податоци за најава на системот</param>
        /// <param name="userData">Корисник</param>
        /// <exception cref="ArgumentNullException">Доколку некој од параметрите е null</exception>
        public CustomPrincipal(IIdentity id, User userData)
        {
            if (id == null)
                throw new ArgumentNullException("id");

            if (userData == null)
                throw new ArgumentNullException("userData");


            this._identity = id;
            this._userData = userData;
        }

        /// <summary>
        /// Корисник
        /// </summary>
        public User User
        {
            get
            {
                return _userData;
            }
        }

        /// <summary>
        /// Метод за проверка дали тековниот корисник е член на дадената ролја
        /// </summary>
        /// <param name="role">Назив на ролја</param>
        /// <returns>true доколку дадениот корисник е член на дадената ролја, инаку false</returns>
        public bool IsInRole(string role)
        {
            if (string.IsNullOrEmpty(role))
                throw new ArgumentNullException("role");

            return _userData.Roles.SingleOrDefault(x => x.RoleName == role) != null;
        }

        /// <summary>
        /// Активна Улога на Најавениот Корисник
        /// Доколку има повеке улоги
        /// </summary>
        public string ActiveRoleName
        {
            get
            {
                if (HttpContext.Current.Session["_ActiveRoleName"] != null)
                {
                    return (string)HttpContext.Current.Session["_ActiveRoleName"];
                }

                var roleName = _userData.Roles.Select(x => x.RoleName).FirstOrDefault();
                HttpContext.Current.Session["_ActiveRoleName"] = roleName;
                return roleName;
            }
            set
            {
                HttpContext.Current.Session["_ActiveRoleName"] = value;
            }
        }

        /// <summary>
        /// Податоци за најава на системот
        /// </summary>
        public IIdentity Identity
        {
            get
            {
                return _identity;
            }
        }
    }
}
