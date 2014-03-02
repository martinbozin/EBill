NS.Repository.DocumentsAtributes = {};

//Превземање на сите типови документи кои може да се одберат
NS.Repository.DocumentsAtributes.GetDocumentAttributes = function (documentTypeId) {
    var rawData = null;
    NS.Utils.AJAX.post(
        baseUrl + 'DocumentTypeGrid/GetAttributesForDocumentType',
           {
               documentTypeId: documentTypeId
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

NS.Repository.DocumentsAtributes.SetDocumentAttributes = function (documentTypeId, attributes) {
    var rawData = null;
    NS.Utils.AJAX.post(
        baseUrl + 'DocumentTypeGrid/SetAttributesForDocumentType',
           {
               documentTypeId: documentTypeId,
               attributes: attributes
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