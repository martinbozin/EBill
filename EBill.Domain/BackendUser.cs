using System;

namespace VipTopUp.Domain
{
    /// <summary>
    /// Корисници кои се позадински 
    /// т.е. 
    /// ги обработуваат барањата
    /// </summary>
    public class BackendUser : User
    {
        private Institution _institution;

        protected BackendUser() : base() { }

        public BackendUser(string userName, string password, string firstName, string lastName, Language preferedLanguage, Institution institution)
            : base(userName, password, firstName, lastName, preferedLanguage)
        {
            if (institution == null)
                throw new ArgumentNullException("institution");

            _institution = institution;
        }

        /// <summary>
        /// Институција во која работи корисникот
        /// </summary>
        public virtual Institution Institution
        {
            get
            {
                return _institution;
            }
        }

        public virtual void SetInstitution(Institution institution)
        {
            if (institution == null)
                throw new ArgumentNullException("institution");

            _institution = institution;
        }
    }
}