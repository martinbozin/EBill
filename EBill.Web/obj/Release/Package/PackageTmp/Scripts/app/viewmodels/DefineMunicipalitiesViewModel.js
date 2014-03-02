//Дефинирање на Општини за Надворешна Институција
NS.ViewModels.DefineMunicipalitiesViewModel = function () {
    var self = this;
    var _ctx = this;

    self.ExtInstitutionId = ko.observable();
    self.AvailableMunicipalities = ko.observableArray();
    self.SelectedMunicipalities = ko.observableArray();

    self.Init = function (extInstitutionId) {
        self.ExtInstitutionId(extInstitutionId);

        //GET All Municipalities
        self.AvailableMunicipalities(NS.Repository.Lookups.GetAllMunicipalities());

        //Get Selected Municipalities for External Institution
        var selected = NS.Repository.ExternalInstitutions.GetSelectedMunicipalitiesForInstitution(extInstitutionId);
        $.map(selected, function (item) {
            self.SelectedMunicipalities.push(item.Value.toString());
        });
    };

    self.Save = function () {
        var result = NS.Repository.ExternalInstitutions.SetSelectedMunicipalitiesForInstitution(self.ExtInstitutionId(), self.SelectedMunicipalities(), _ctx);
        return result;
    };

    self.setContext = function (ctx) {
        _ctx = ctx;
    };

    self.IgnoreMappings = {
        both: [
            "IgnoreMappings",
            "AvailableMunicipalities"
        ],
        dirty: [],
        json: []
    };
};