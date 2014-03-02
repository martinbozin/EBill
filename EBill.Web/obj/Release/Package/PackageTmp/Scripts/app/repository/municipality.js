NS.Repository.Municipality = {};

//Листа на селектирани општини за институција
NS.Repository.Municipality.GetSelectedInstitutionsForMunicipality = function (municipalityId) {
    var rawData = null;
    NS.Utils.AJAX.post(
        baseUrl + 'Zels/MunicipalityGrid/GetSelectedInstitutionForMunicipalitiy',
        {
            municipalityId: municipalityId
        },
        function (data) {
            rawData = data;
        },
         function (response) {
             NS.Utils.AJAX.parseErors(response, document);
         },
        false
    );
    return rawData;
};

//Поврзува Општини со Надворешни Институции
NS.Repository.Municipality.SetSelectedInstitutionForMunicipality = function (municipalityId, selectedInstitutions, ctx) {
    var rawData = null;
    NS.Utils.AJAX.post(
        baseUrl + 'Zels/MunicipalityGrid/SetSelectedInstitutionForMunicipalitiy',
        {
            municipalityId: municipalityId,
            selectedInstitutions: selectedInstitutions
        },
        function (data) {
            rawData = data;
        },
        function (response) {
            NS.Utils.AJAX.parseErors(response, ctx);
        },
        false
    );
    return rawData;
};