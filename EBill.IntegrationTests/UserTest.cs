using EBills.Domain;
using EBills.IntegrationTests.Base;
using NUnit.Framework;
using System;
using System.Diagnostics;
 

namespace EBills.IntegrationTests
{
    [TestFixture]
    public class UserTest : TestBase
    {
        [Test]
        public void can_read_User()
        {
            //Arrange
            var user = CreateUser();
            //Act
            Session.Clear();

            var user2 = Session.Load<User>(user.Id);
            //Assert
            Assert.IsTrue(user2.Id > 0);
            Assert.IsTrue(user.Id == user2.Id);
        }

 

 

        //[Test]
        //public void user_can_set_prefered_language()
        //{
        //    //Arrange
        //    var user = CreateBackendUser();
        //    var lang = CreateLanguage();

        //    //Act
        //    user.SetPreferedLanguage(lang);
        //    Session.Update(user);
        //    Session.Flush();
        //    Session.Clear();

        //    //var user2 = Session.Load<User>(user.Id);
        //    ////Assert
        //    //Assert.IsTrue(user2.PreferedLanguage != null);
        //    //Assert.IsTrue(user2.PreferedLanguage.Id == lang.Id);
        //}

        //[Test]
        //public void user_can_read_Certificate()
        //{
        //    //Arrange
        //    var user = CreatePublicUser();

        //    string Certificate = Path.GetFullPath("daniel.cer");
        //    X509Certificate cert = X509Certificate.CreateFromCertFile(Certificate);

        //    DateTime dt = Convert.ToDateTime(cert.GetExpirationDateString());

        //    user.CertificateRawBytes = cert.GetRawCertData();
        //    user.CertificateDateUntil = dt;

        //    //Act
        //    Session.Update(user);
        //    Session.Flush();
        //    Session.Clear();

        //    //Assert
        //    Assert.IsTrue(user.CertificateDateUntil != null);
        //    Assert.IsTrue(user.CertificateRawBytes != null);
        //}
    }
}
