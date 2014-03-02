using eDozvoli.Domain;
using eDozvoli.IntegrationTests.Base;
using NUnit.Framework;
using System.Linq;

namespace eDozvoli.IntegrationTests
{
    [TestFixture]
    public class RequestMunicipalityTest : TestBase
    {
        [Test]
        public void can_read_RequestMunicipality()
        {
            //Arrange
            var requestMunicipality = CreateRequestMunicipality();
            //Act
            Session.Clear();

            var requestMunicipality2 = Session.Load<RequestMunicipality>(requestMunicipality.Id);
            //Assert
            Assert.IsTrue(requestMunicipality2.Id > 0);
            Assert.IsTrue(requestMunicipality.Id == requestMunicipality2.Id);
        }


        [Test]
        public void can_add_CadastreMunicipality()
        {
            var requestMunicipality = CreateRequestMunicipality();
            var cadastreMunicipality = CreateCadastreMunicipality();

            //kreira KO povrzana za Optina koja pak e povzana So baranje
            var requestCadastreMunicipality = new RequestMunicipalityCadastreMunicipality(requestMunicipality, cadastreMunicipality,
                                                                              "KO 305");

            requestMunicipality.AddRequestCadastreMunicipalities(requestCadastreMunicipality);

            session.Update(requestMunicipality);
            session.Flush();

            session.Refresh(requestMunicipality);

            Assert.IsTrue(requestMunicipality.RequestMunicipalityCadastreMunicipalities.Select(x => x.CadastreMunicipality.Id).Any());

        }

    }
}

