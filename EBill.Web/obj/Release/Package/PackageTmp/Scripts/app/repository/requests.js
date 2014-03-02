NS.Repository.Request = {};

NS.Repository.Request.GetAllEmployers = function () {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'Admin/Requests/GetAllEmployers',
           {},
        function (data) {
            result = data;
        },
        null,
        false
    );
    return result;
};

NS.Repository.Request.GetSelectedEmployersForRequest = function (requestId) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'Admin/Requests/GetSelectedEmployersForRequest',
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

NS.Repository.Request.ReAssignRequest = function (requestId, constructionTypeId, municipalityId, signature, ctx) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SharedRequest/ReAssignRequest',
        {
            RequestId: requestId,
            ConstructionTypeId: constructionTypeId,
            MunicipalityId: municipalityId,
            signature: signature
        },
        function (data) {
            result = data;
        },
         function (data) {
             NS.Utils.AJAX.parseErors(data, ctx || document);
         },
        false
    );
    return result != null;
};

NS.Repository.Request.AssignRequest = function (model, ctx) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'Admin/Requests/AssignRequest',
        model,
        function (data) {
            result = data;
        },
        function (response) {
            NS.Utils.AJAX.parseErors(response, ctx);
        },
        false
    );
    return result != null;
};

//Превземање на барање според неговото ID
NS.Repository.Request.GetRequestById = function (requestId) {
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

NS.Repository.Request.GetRequestHistory = function (requestId) {
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

NS.Repository.Request.GetRequestHistoryById = function (requestHistoryId) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SharedRequest/GetRequestHistoryByHistoryId',
        {
            requestHistoryId: requestHistoryId
        },
        function (data) {
            result = data;
        },
        null,
        false
    );
    return result;
};

NS.Repository.Request.GetRequestDocumentsByRequestId = function (requestId) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SharedRequest/GetRequestDocumentsByRequestId',
        {
            requestId: requestId,
            includeDrafts: false
        },
        function (data) {
            result = data;
        },
        null,
        false
    );
    return result;
};

NS.Repository.Request.GetAvalibleInstitutionForRequest = function (requestId) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'Admin/Requests/GetAvalibleInstitutionForRequest',
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


//Odbrani opstini
NS.Repository.Request.GetRequestInvesotrs = function (requestId) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SharedRequest/GetRequestInvestorsByRequestId',
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

NS.Repository.Request.GetRequestMunicipalities = function (requestId) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SharedRequest/GetRequestMunicipalitiesByRequestId',
        {
            requestId: requestId,
            mapCadastreMunicipalities: true
        },
        function (data) {
            result = data;
        },
        null,
        false
    );
    return result;
};

NS.Repository.Request.GetRequestDaysFromSend = function (requestId) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'Admin/Requests/GetRequestDaysFromSend',
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

NS.Repository.Request.DeleteDocumentFromRequest = function (requestId, requestDocumentId, ctx) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'Admin/Requests/DeleteDocumentFromRequest',
        {
            requestId: requestId,
            requestDocumentId: requestDocumentId
        },
        function (data) {
            result = data;
        },
        function (response) {
            NS.Utils.AJAX.parseErors(response, ctx);
        },
        false
    );
    return result != null;
};

//Get Answers For Request
NS.Repository.Request.GetRequestNotifications = function (requestId) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'Admin/Requests/GetRequestNotifications',
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

//Get Days from send to Institution
NS.Repository.Request.GetDaysFromSendToInstitution = function (requestId) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'Admin/Requests/GetDaysFromSendToInstitution',
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

//Save utilities amount for request
NS.Repository.Request.SaveUtilitiesAmount = function (requestId, utilities) {

    var result = null;
    NS.Utils.AJAX.post(
         baseUrl + 'SharedRequest/SaveUtilitiesAmount',
        {
            utilities: utilities,
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


//Get Answers For Request
NS.Repository.Request.GetRequestDeadlines = function (requestId) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SharedRequest/GetRequestDeadlines',
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
    return result;
};

//Get Request2UserNotifications
NS.Repository.Request.GetRequest2UserNotification = function (requestId) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SharedRequest/GetRequest2UserNotification',
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


NS.Repository.Request.GetRequestForSigning = function (requestId) {
    var result = null;
    $.ajax({
        url: baseUrl + 'SharedRequest/GetRequestForSigning',
        type: "POST",
        dataType: "text",
        data: {
            requestId: requestId
        },
        async: false,
        success: function (data) {
            result = data;
        }
    });
    return result;
};