using EBills.Domain;
using EBills.IntegrationTests.Base;
using NHibernate.Linq;
using NUnit.Framework;
using System.Linq;

namespace EBills.IntegrationTests
{
    public class PosTests : TestBase
    {
        [Test]
        public void can_read_pos()
        {
            //Arrange
            var pos = CreatePos();
            //Act
            //Session.Clear();

            var pos2 = Session.Get<Pos>(pos.Id);

            //Assert
            Assert.IsTrue(pos2.Id > 0);

        }

        [Test]
        public void user_can_be_added_to_pos()
        {
            //Arrange
            var pos = CreatePos();
            var user = CreatePublicUser();
            //Act
            pos.AddUser(user);
            Session.Update(pos);
            Session.Flush();
        }

    }
}