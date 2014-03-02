//Дефинирање на Потребни Документи за Тип на барање
NS.ViewModels.DefineRequiredDocumentsViewModel = function () {
    var self = this;
    var _ctx = this;

    self.RequestId = ko.observable();
    self.AvalibleDocuments = ko.observableArray();
    self.SelectedDocuments = ko.observableArray();

    self.Init = function (requestId) {
        self.RequestId(requestId);
        
        //Get All Available Document Types
        self.AvalibleDocuments(NS.Repository.Lookups.GetAllAvalibleDocumentTypes());

        //Get Selected Document Types for 
        var selected = NS.Repository.RequestType.GetSelectedDocumentTypes(requestId);
        $.map(selected, function (item) {
            self.SelectedDocuments.push(item.Value.toString());
        });
    };

    self.Save = function () {
        var result = NS.Repository.RequestType.SetSelectedDocumentsForRequest(self.RequestId(), self.SelectedDocuments(), _ctx);
        return result;
    };

    self.setContext = function (ctx) {
        _ctx = ctx;
    };

    self.IgnoreMappings = {
        both: [
            "IgnoreMappings",
            "AvalibleDocuments"
        ],
        dirty: [],
        json: []
    };

};