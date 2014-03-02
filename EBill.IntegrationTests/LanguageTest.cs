using EBills.Domain;
using EBills.IntegrationTests.Base;
using NUnit.Framework;

namespace EBills.IntegrationTests
{
    [TestFixture]
    public class LanguageTest : TestBase
    {
        [Test]
        public void can_read_language()
        {
            //Arrange
            var language = CreateLanguage();
            //Act
            Session.Clear();

            var language2 = Session.Load<Language>(language.Id);

            //Assert
            Assert.IsTrue(language2.Id > 0);
            Assert.IsTrue(language.Id == language2.Id);
        }
    }
}
