using EBills.Domain;
using EBills.IntegrationTests.Base;
using NUnit.Framework;

namespace EBills.IntegrationTests
{
    [TestFixture]
    public class AppParameterTest : TestBase
    {
        [Test]
        public void can_read_AppParameter()
        {
            //Arrange
            var prm = CreateAppParameter();
            //Act
            Session.Clear();

            var prm2 = Session.Load<ApplicationParameter>(prm.Id);
            //Assert
            Assert.IsTrue(prm2.Id > 0);
            Assert.IsTrue(prm.Id == prm2.Id);
        }
    }
}
