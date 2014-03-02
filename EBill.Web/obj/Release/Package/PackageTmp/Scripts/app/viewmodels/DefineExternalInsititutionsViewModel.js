
//Дефинирање на Надворешни Институции за Општина
NS.ViewModels.DefineExternalInsititutionsViewModel = function () {
    var self = this;
    var ctx = this;

    self.MunicipalityId = ko.observable();
    self.AvailableExternalInstitutions = ko.observableArray();
    self.SelectedExternalInstitutions = ko.observableArray();

    self.Init = function (municipalityId) {
        self.MunicipalityId(municipalityId);

        //Get All External Institutions
        $.map(NS.Repository.Lookups.GetAllExternalInstitutions(), function (item) {
            if (item.AdditionalInfo == "false")
                self.AvailableExternalInstitutions.push(item);
        });

        //Get Selected Institutions for Municipality
        var selected = NS.Repository.Municipality.GetSelectedInstitutionsForMunicipality(municipalityId);
        $.map(selected, function (item) {
            self.SelectedExternalInstitutions.push(item.Value.toString());
        });
    };

    self.Save = function () {
        var result = NS.Repository.Municipality.SetSelectedInstitutionForMunicipality(self.MunicipalityId(), self.SelectedExternalInstitutions(), ctx);
        return result;
    };

    self.setContext = function (context) {
        ctx = context;
    };

    self.IgnoreMappings = {
        both: [
            "IgnoreMappings",
            "AvailableExternalInstitutions"
        ],
        dirty: [],
        json: []
    };
};