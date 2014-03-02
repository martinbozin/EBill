using System;
using System.Collections.Generic;
using System.Linq;


namespace EBills.Domain
{
    public class Role 
    {
        public virtual int Id { get; set; }
        private string _roleName;
        private readonly IList<User> _users;

        protected Role()
        {
            _users = new List<User>();
        }

        public Role(string roleName)
            : this()
        {
            if (string.IsNullOrEmpty(roleName))
                throw new ArgumentNullException("roleName");

            _roleName = roleName;
        }

        public virtual string RoleName
        {
            get { return _roleName; }
        }

        public virtual void SetRoleName(string roleName)
        {
            if (string.IsNullOrEmpty(roleName))
                throw new ArgumentNullException("roleName");

            _roleName = roleName;
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



    }
}
