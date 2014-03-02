using System;

namespace EBills.Domain
{
    /// <summary>
    /// Јавни корисници т.е. корисници кои поднесуваат барања во системот
    /// </summary>
    public class PublicUser : User
    {
        //private string _address;
        private PublicUserType _userType;
        protected PublicUser() : base() { }

        public PublicUser(string userName, string password, string firstName, string lastName, Language preferedLanguage)
            : base(userName, password, firstName, lastName, preferedLanguage)
        {
            //if (string.IsNullOrEmpty(address))
            //    throw new ArgumentNullException("address");

            //_address = address;
            _userType = PublicUserType.NormalUser;
        }

        //public virtual string Address
        //{
        //    get { return _address; }
        //}

        //public virtual void SetAddress(string address)
        //{
        //    if (string.IsNullOrEmpty(address))
        //        throw new ArgumentNullException("address");

        //    _address = address;
        //}

        /// <summary>
        /// Тип на корисник 
        /// може да биде обичен корисник или Архитектонско 
        /// </summary>
        public virtual PublicUserType UserType
        {
            get
            {
                return (PublicUserType)_userType;
            }
        }

        public virtual void SetPublicUserType(PublicUserType userType)
        {
            _userType = userType;
        }
    }
}