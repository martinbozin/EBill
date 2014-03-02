using EBills.Domain;
using EBills.IntegrationTests.Base;
using NUnit.Framework;

namespace EBills.IntegrationTests
{
    [TestFixture]
    public class RoleTest : TestBase
    {
        [Test]
        public void can_read_role()
        {
            //Arrange
            var role = CreateRole();
            //Act
            var role2 = Session.Get<Role>(role.Id);
            //Assert
            Assert.IsTrue(role2.Id > 0);
        }

        [Test]
        public void user_can_be_added_to_role()
        {
            //Arrange
            var role = CreateRole();
            var user = CreatePublicUser();
            //Act
            role.AddUser(user);
            Session.Update(role);
            Session.Flush();

            ////Reload from DB
            //var role2 = Session.Get<Role>(role.Id);

            ////Assert
            //Assert.IsTrue(role2.Id > 0);
            //Assert.IsTrue(role2.Users.Count > 0);
            //CollectionAssert.IsNotEmpty(role2.Users);
        }

        //[Test]
        //public void user_can_be_removed_from_role()
        //{
        //    //Arrange
        //    var role = CreateRole();
        //    var user = CreateBackendUser();

        //    //Act
        //    role.AddUser(user);
        //    Session.Update(role);
        //    Session.Flush();

        //    ////Reload from DB
        //    //var role2 = Session.Get<Role>(role.Id);
        //    //role2.RemoveUser(user);
        //    //Session.Update(role);
        //    //Session.Flush();

        //    //var role3 = Session.Get<Role>(role.Id);

        //    ////Assert
        //    //Assert.IsTrue(role3.Id > 0);
        //    //Assert.IsTrue(role3.Users.Count == 0);
        //    //CollectionAssert.IsEmpty(role2.Users);
        //}



    }
}
