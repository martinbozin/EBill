NS.Repository.RequestType = {};

//Metod za GET Selected Documents na RequestTypesGrid + RequestTypesSubGrid
NS.Repository.RequestType.GetSelectedDocumentTypes = function (requestId) {
    var rawData = null;
    NS.Utils.AJAX.post(
    baseUrl + 'Zels/RequestTypesGrid/GetSelectedDocumentsForRequest',
        {
            requestId: requestId
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


//Metod za SET Selected Documents na RequestTypesGrid + RequestTypesSubGrid
NS.Repository.RequestType.SetSelectedDocumentsForRequest = function (requestId, selectedDocumentTypes) {
    var rawData = null;
    NS.Utils.AJAX.post(
        baseUrl + 'Zels/RequestTypesGrid/SetSelectedDocumentsForRequest',
        {
            requestId: requestId,
            selectedDocumentTypes: selectedDocumentTypes
        },
        function(data) {
            rawData = data;
        },
        function(response) {
            NS.Utils.AJAX.parseErors(response, document);
        },
        false
    );

    return rawData;
}