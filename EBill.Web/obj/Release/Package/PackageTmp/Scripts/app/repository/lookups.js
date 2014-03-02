NS.Repository.Lookups = {};

//Превземање на сите типови документи кои може да се одберат
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

//Листа на сите општини    
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

//Листа на сите надворешни институции 
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

//Листа на сите типови на барања
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

//Листа на сите типови на барања
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

//Листа на сите типови на барања
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


//Катастраски општини
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
