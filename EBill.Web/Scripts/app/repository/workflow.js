NS.Repository.Workflow = {};

NS.Repository.Workflow.GetAvailableTransitions = function (objectId) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'Workflow/GetAvailableTransitions'
        , {
            objectId: objectId,
        }
        , function (data) {
            result = data;
        },
        function (response) {
            NS.Utils.AJAX.parseErors(response, document);
        },
        false
    );
    return result;
};

NS.Repository.Workflow.ActivateTransition = function (objectId, transitionId, actionModelName, actionModelAsJson, signature) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'Workflow/ActivateRequestTransition'
        , {
            objectId: objectId,
            transitionId: transitionId,
            actionModelName: actionModelName,
            actionModelAsJson: actionModelAsJson,
            signature: signature
        }
        , function (data) {
            result = data;
        },
        function (response) {
            NS.Utils.AJAX.parseErors(response, document);
        },
        false
    );
    return result != null;
};

