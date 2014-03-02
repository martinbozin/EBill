using System;
using System.Collections.Generic;
using System.Linq;

namespace EBills.Domain
{


    /// <summary>
    /// Prodazno mesto POS
    /// </summary>
    public class Pos 
    {
        private readonly IList<User> _users;
        private string _posName;
        private bool _isActive;
        public virtual int Id { get; set; }
        protected Pos()
        {
            _users = new List<User>();
        }

        public Pos(string posName)
            : this()
        {
            if (string.IsNullOrEmpty(posName))
            {
                throw new ArgumentNullException("posName");
            }
            _posName = posName;
        }

        public virtual IList<User> Users
        {
            get
            {
                return _users;
            }
        }

        public virtual void AddUser(User user)
        {
            if (user == null)
                throw new ArgumentNullException("user");

            if (_users.Contains(user))
            {
                throw new InvalidOperationException("user already exists");
            }

            if (_users.Any(user1 => user1.UserName == user.UserName))
            {
                throw new InvalidOperationException("user already exists");
            }

            _users.Add(user);
        }

        public virtual void RemoveUser(User user)
        {
            if (user == null)
                throw new ArgumentNullException("user");

            if (!_users.Contains(user))
            {
                throw new InvalidOperationException("no such user");
            }

            if (!_users.Any(user1 => user1.UserName == user.UserName))
            {
                throw new InvalidOperationException("no such user");
            }

            _users.Remove(user);
        }


        public virtual string PosName
        {
            get
            {
                return _posName;
            }
        }

        public virtual void SetName(string posName)
        {
            if (string.IsNullOrEmpty(posName))
                throw new ArgumentNullException("posName");
            _posName = posName;
        }

        public virtual string PrimaryContact { get; set; }
        public virtual string Phone { get; set; }
        public virtual string AdditionalEmailAdresses { get; set; }
 
        public virtual bool IsActive
        {
            get { return _isActive; }
        }

        public virtual void SetIsActive(bool t)
        {
            _isActive = t;
        }
    }
}
