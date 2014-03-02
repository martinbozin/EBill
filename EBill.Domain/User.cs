
using System;
using System.Collections.Generic;
using System.Linq;


namespace EBills.Domain
{
    public class User 
    {
        private string _userName;
        private string _password;
        private string _firstName;
        private string _lastName;

 
        private readonly IList<Role> _roles;
        private Language _preferedLanguage;

        protected User()
        {
            _roles = new List<Role>();
 
        }

        public User(string userName, string password, string firstName, string lastName, Language preferedLanguage)
            : this()
        {
            if (preferedLanguage == null)
                throw new ArgumentNullException("preferedLanguage");
            if (string.IsNullOrEmpty(userName))
                throw new ArgumentNullException("userName");
            if (string.IsNullOrEmpty(password))
                throw new ArgumentNullException("password");
            if (string.IsNullOrEmpty(firstName))
                throw new ArgumentNullException("firstName");
            if (string.IsNullOrEmpty(lastName))
                throw new ArgumentNullException("lastName");

            _userName = userName;
            _password = password;
            _firstName = firstName;
            _lastName = lastName;
            _preferedLanguage = preferedLanguage;

        }

        public virtual int Id { get; set; }

        public virtual string UserName
        {
            get { return _userName; }
        }

        public virtual void SetUserName(string userName)
        {
            if (string.IsNullOrEmpty(userName))
                throw new ArgumentNullException("userName");
            _userName = userName;
        }

        public virtual string Password
        {
            get { return _password; }
        }

        public virtual void SetPassword(string password)
        {
            if (string.IsNullOrEmpty(password))
                throw new ArgumentNullException("password");
            _password = password;
        }

        public virtual string FirstName
        {
            get { return _firstName; }
        }

        public virtual void SetFirstName(string firstName)
        {
            if (string.IsNullOrEmpty(firstName))
                throw new ArgumentNullException("firstName");

            _firstName = firstName;
        }

        public virtual string LastName
        {
            get { return _lastName; }
        }

        public virtual void SetLastName(string lastName)
        {
            if (string.IsNullOrEmpty(lastName))
                throw new ArgumentNullException("lastName");

            _lastName = lastName;
        }

 

        public virtual IList<Role> Roles
        {
            get
            {
                return _roles;
            }
        }
        public virtual void AddToRole(Role role)
        {
            if (role == null)
            {
                throw new ArgumentNullException("role");
            }

            if (_roles.Contains(role))
            {
                throw new InvalidOperationException("duplicate role");
            }


            if (Roles.Any(role1 => role1.RoleName == role.RoleName))
            {
                throw new InvalidOperationException("duplicate role");
            }

            _roles.Add(role);
        }
        public virtual void RemoveFromRole(Role role)
        {
            if (role == null)
            {
                throw new ArgumentNullException("role");
            }
            _roles.Remove(role);
        }




        public virtual bool IsActive { get; set; }

        public virtual Language PreferedLanguage
        {
            get
            {
                return _preferedLanguage;
            }
        }
 
        //public virtual int Discriminator { get; set; }

        public virtual void SetPreferedLanguage(Language language)
        {
            if (language == null)
                throw new ArgumentNullException("language");
            _preferedLanguage = language;
        }



        public virtual string FullName
        {
            get
            {
                return string.Format("{0} {1}", FirstName, LastName);
            }
        }
        public virtual string RegistrationCode { get; set; }
    }

}
