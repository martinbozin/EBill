
NS.Repository.ExternalInstitutions = {};

//����� �� ����������� ������� �� ����������
NS.Repository.ExternalInstitutions.GetSelectedMunicipalitiesForInstitution = function (extInstitutionId) {
    var rawData = null;
    NS.Utils.AJAX.post(
        baseUrl + 'Zels/ExternalInstitutionGrid/GetSelectedMunicipalitiesForInstitution',
        {
            extInstitutionId: extInstitutionId
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

//���������� �� ������������ ���������� �� ���������
NS.Repository.ExternalInstitutions.SetSelectedMunicipalitiesForInstitution = function (extInstitutionId, selectedMunicipalities) {
    var rawData = null;
    NS.Utils.AJAX.post(
        baseUrl + 'Zels/ExternalInstitutionGrid/SetSelectedMunicipalitiesForInstitution',
        {
            extInstitutionId: extInstitutionId,
            selectedMunicipalities: selectedMunicipalities
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