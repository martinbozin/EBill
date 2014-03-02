NS.Repository.PublicRequest = {};

NS.Repository.PublicRequest.MapToViewModel = function (data) {
    var mappedData = ko.utils.arrayMap(data, function (item) {
        var viewModel = new NS.ViewModels.PublicRequests();
        viewModel.MapFromDataRow(item);
        return viewModel;
    });
    return mappedData;
};

//Превземање на барање според неговото ID
NS.Repository.PublicRequest.GetRequestById = function (requestId) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SharedRequest/GetRequestById',
        {
            requestId: requestId
        },
        function (data) {
            result = data;
        },
        null,
        false
    );

    return result;
};

NS.Repository.PublicRequest.GetFullRequestById = function (requestId) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SharedRequest/GetFullRequestById',
        {
            requestId: requestId
        },
        function (data) {
            result = data;
        },
        null,
        false
    );

    return result;
};

NS.Repository.PublicRequest.GetRequestHistory = function (requestId) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SharedRequest/GetRequestHistoryByRequestId',
        {
            requestId: requestId
        },
        function (data) {
            result = data;
        },
        null,
        false
    );
    return result;
};

NS.Repository.PublicRequest.GetRequestsForUser = function (fromDate, toDate, pageIndex, pageSize) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SharedRequest/GetAllRequestsForCurrentUser',
        {
            fromDate: fromDate,
            toDate: toDate,
            pageIndex: pageIndex,
            pageSize: pageSize
        },
        function (data) {
            result = data;
        },
        function (response) {
            NS.Utils.AJAX.parseErors(response, document);
        },
        false
    );

    return result;
};

//Метод за проверка дали е платено комуналии
NS.Repository.PublicRequest.RequestHaveUtilitiesPaid = function (requestId) {

    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SharedRequest/RequestHaveUtilitiesPaid',
        {
            requestId: requestId
        },
        function (data) {
            result = data;
        },
        null,
        false
    );
    return result;
};

//Метод за потпишување на барањето
NS.Repository.PublicRequest.SignRequest = function (requestId, signature) {
    
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SharedRequest/SignRequest',
        {
            RequestId: requestId,
            Signature: signature
        },
        function (data) {
            result = data;
        },
        null,
        false
    );
    return result;
};

//Метод за ставање на барањето во state kacena uplatnica
NS.Repository.PublicRequest.SetStateAfterAttachUtillity = function (requestId) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SharedRequest/SetStateAfterAttachUtillity',
        {
            requestId: requestId
        },
        function (data) {
            result = data;
        },
        null,
        false
    );
    return result;
};

//Метод за праќање на барање
NS.Repository.PublicRequest.SetLicenceForRequest = function (requestId) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SharedRequest/SetLicenceForRequest',
        {
            requestId: requestId
        },
        function (data) {
            result = data;
        },
        null,
        false
    );
    return result;
};


//Метод за праќање на барање
NS.Repository.PublicRequest.SendRequest = function (requestId) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SharedRequest/SendRequest',
        {
            requestId: requestId
        },
        function (data) {
            result = data;
        },
        null,
        false
    );
    return result;
};


//Метод дали е licence agrement cekirano
NS.Repository.PublicRequest.CheckedRequest = function (requestId) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SharedRequest/CheckedRequest',
        {
            requestId: requestId
        },
        function (data) {

            result = data;
        },
        null,
        false
    );
    return result;
};

//Метод за бришење на барање
NS.Repository.PublicRequest.DeleteRequest = function (requestId) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SharedRequest/DeleteRequest',
        {
            requestId: requestId
        },
        function (data) {
            result = data;
        },
        function (response) {
            NS.Utils.AJAX.parseErors(response, document);
        },
        false
    );
    return result != null;
};

//Metod za SAVE na celo baranje
NS.Repository.PublicRequest.SaveRequest = function (requestModel) {

    var rawData = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SharedRequest/SaveRequest',
        {
            requestModel: requestModel
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

NS.Repository.PublicRequest.UpdateRequest = function (requestModel) {
    var rawData = null;

    NS.Utils.AJAX.post(
        baseUrl + 'SharedRequest/UpdateRequest',
        {
            requestModel: requestModel
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

NS.Repository.PublicRequest.WithdrawnRequest = function (requestId, signature) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SharedRequest/WithdrawnRequest',
        {
            requestId: requestId,
            signature: signature
        },
        function (data) {
            result = data;
        },
        null,
        false
    );
    return result;
};

NS.Repository.PublicRequest.RemoveDraftDocument = function (requestId, requestDocumentId) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SharedRequest/RemoveDraftDocument',
        {
            requestId: requestId,
            requestDocumentId: requestDocumentId
        },
        function (data) {
            result = data;
        },
        null,
        false
    );

    return result;
};

NS.Repository.PublicRequest.GetRequestDocumentsByRequestId = function (requestId) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SharedRequest/GetRequestDocumentsByRequestId',
        {
            requestId: requestId,
            includeDrafts: true
        },
        function (data) {
            result = data;
        },
        null,
        false
    );

    return result;
};

//Ги враќа документите за комуналии качени од барателот:
NS.Repository.PublicRequest.GetRequestDocumentsForUtilitesByRequestId = function (requestId) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SharedRequest/GetRequestDocumentsForUtilitesByRequestId',
        {
            requestId: requestId,
            includeDrafts: true
        },
        function (data) {
            result = data;
        },
        null,
        false
    );

    return result;
};


NS.Repository.PublicRequest.GetDocumentsAtrributesForRequest = function (requestId) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SharedRequest/GetDocumentsAtrributesForRequest',
        {
            requestId: requestId
        },
        function (data) {
            result = data;
        },
        null,
        false
    );

    return result;
};

NS.Repository.PublicRequest.GetDocumentsAtrributesForRequestAndDocumentType = function (requestId, documentTypeId) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SharedRequest/GetDocumentsAtrributesForRequestAndDocumentType',
        {
            requestId: requestId,
            documentTypeId: documentTypeId
        },
        function (data) {
            result = data;
        },
        null,
        false
    );
    return result;
};

NS.Repository.PublicRequest.SaveOrUpdateRequestDocumentAttributes = function (model) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SharedRequest/SaveOrUpdateRequestDocumentAttributes',
        model,
        function (data) {
            result = data;
        },
        function (response) {
            NS.Utils.AJAX.parseErors(response, document);
        },
        false
    );

    return result;
};

