NS.Repository.Lookups = {};

//���������� �� ���� ������ ��������� ��� ���� �� �� �������
NS.Repository.Lookups.GetAllAvalibleDocumentTypes = function () {
    var rawData = null;
    NS.Utils.AJAX.post(
        baseUrl + 'Lookups/GetAllAvalibleDocumentTypes',
        null,
        function (data) {
            rawData = data;
        },
        null,
        false
    );
    return rawData;
};

//����� �� ���� �������    
NS.Repository.Lookups.GetAllMunicipalities = function () {
    var rawData = null;
    NS.Utils.AJAX.post(
        baseUrl + 'Lookups/GetAllMunicipalities',
        null,
        function (data) {
            rawData = data;
        },
        null,
        false
    );
    return rawData;
};

NS.Repository.Lookups.GetAllMunicipalitiesFromSkopje = function () {
    var rawData = null;
    NS.Utils.AJAX.post(
        baseUrl + 'Lookups/GetAllMunicipalitiesFromSkopje',
        null,
        function (data) {
            rawData = data;
        },
        null,
        false
    );
    return rawData;
};

//����� �� ���� ���������� ���������� 
NS.Repository.Lookups.GetAllExternalInstitutions = function () {
    var rawData = null;
    NS.Utils.AJAX.post(
        baseUrl + 'Lookups/GetAllExternalInstitutions',
        null,
        function (data) {
            rawData = data;
        },
        null,
        false
    );
    return rawData;
};

//����� �� ���� ������ �� ������
NS.Repository.Lookups.GetAllAvalibleRequestsTypes = function () {
    var rawData = null;
    NS.Utils.AJAX.post(
        baseUrl + 'Lookups/GetAllAvalibleRequestsTypes',
        null,
        function (data) {
            rawData = data;
        },
        null,
        false
    );
    return rawData;
};

//����� �� ���� ������ �� ������
NS.Repository.Lookups.GetRequestTypeDetails = function (requestTypeId) {
    var rawData = null;
    NS.Utils.AJAX.post(
        baseUrl + 'Lookups/GetRequestTypeDetails',
        {
            requestTypeId: requestTypeId
        },
        function (data) {
            rawData = data;
        },
        null,
        false
    );
    return rawData;
};

//����� �� ���� ������ �� ������
NS.Repository.Lookups.GetRequestTypeDetailsUtilities = function (requestTypeId) {
 
    var rawData = null;
    NS.Utils.AJAX.post(
        baseUrl + 'Lookups/GetRequestTypeDetailsUtilities',
        {
            requestTypeId: requestTypeId
        },
        function (data) {
            rawData = data;
        },
        null,
        false
    );
    return rawData;
};


//����������� �������
NS.Repository.Lookups.GetCadastreMunicipalities = function (municipalityId) {
    var rawData = null;
    NS.Utils.AJAX.post(
        baseUrl + 'Lookups/GetCadastreMunicipalities',
        {
            municipalityId: municipalityId
        },
        function (data) {
            rawData = data;
        },
        null,
        false
    );
    return rawData;
};

NS.Repository.Lookups.GetSelectedDocumentsForRequestUtility = function () {
 
    var rawData = null;
    NS.Utils.AJAX.post(
    baseUrl + 'Lookups/GetSelectedDocumentsForRequestUtility',
        {
            //requestId: requestId
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
