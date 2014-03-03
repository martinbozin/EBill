using EBills.Domain;
using EBills.IntegrationTests.Helpers;

using NHibernate.Linq;
using System;
using System.Linq;

namespace EBills.IntegrationTests.Base
{
    public class TestBase : SessionfullTest
    {
        protected User CreateUser()
        {
            var lang = CreateLanguage();
            //Pos pos = CreatePos();

            var user = new User("admir", "password", "Admir", "Durmishi", lang);
            //user.Discriminator = 1;

            Session.Save(user);
            Session.Flush();

            return user;
        }

        protected ApplicationParameter CreateAppParameter()
        {
            var prm = new ApplicationParameter();
            prm.ParameterName = "ParameterName";
            prm.ParameterType = "string";
            prm.ParameterValue = "Parameter Value";
            prm.ParameterValidFrom = DateTime.Today;
            prm.ParameterValidUntil = null;
            prm.ParameterDescription = null;

            session.Save(prm);
            session.Flush();

            return prm;
        }
 

        protected Role CreateRole()
        {
            var role = new Role("Administrator");

            Session.Save(role);
            Session.Flush();

            return role;
        }

        protected Language CreateLanguage()
        {
            var lang = new Language(new Random().Next(100, Int32.MaxValue), "RU", "Ruski u 100 lekcije", 23, "RU");

            Session.Save(lang);
            Session.Flush();
            Session.Clear();

            return lang;
        }
 
    }
}