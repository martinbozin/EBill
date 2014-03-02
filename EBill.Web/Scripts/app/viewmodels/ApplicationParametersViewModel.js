NS.ViewModels.ApplicationParameter = function () {
    var self = this;

    self.Id = ko.observable();
    self.ParameterType = ko.observable();
    self.ParameterName = ko.observable();
    self.ParameterValue = ko.observable();
    self.ParameterValidUntil = ko.observable();
    self.ParameterValidFrom = ko.observable();
    self.ParameterDescription = ko.observable();

    self.mapFromJson = function (data) {
        self.Id(data.Id);
        self.ParameterType(data.ParameterType);
        self.ParameterName(data.ParameterName);
        self.ParameterValue(data.ParameterValue);

        //self.ParameterValidUntil(data.ValidUntil);
        //self.ParameterValidFrom(data.ValidFrom);

        if (data.ParameterValidUntil != null) {
            var fromJsonDate = NS.Utils.Date.parseDateFromJson(data.ParameterValidUntil);
            var mkDate = NS.Utils.Date.toMKString(fromJsonDate);
            self.ParameterValidUntil(mkDate);
        }
        if (data.ParameterValidFrom != null) {
            var fromJsonDate1 = NS.Utils.Date.parseDateFromJson(data.ParameterValidFrom);
            var mkDate1 = NS.Utils.Date.toMKString(fromJsonDate1);
            self.ParameterValidFrom(mkDate1);
        }

        self.ParameterDescription(data.ParameterDescription);
    };
};

NS.ViewModels.ApplicationParametersViewModel = function () {
    var self = this;
    var _ctx = null;

    self.ApplicationParameters = ko.observableArray();

    self.Init = function () {
        self.LoadData();
    };

    self.LoadData = function () {
        self.ApplicationParameters.removeAll();
        var data = NS.Repository.ApplicationParameters.LoadAllValidApplicationParameters();
        if (!!data) {
            for (var i = 0; i < data.length; i++) {
                var item = new NS.ViewModels.ApplicationParameter();
                item.mapFromJson(data[i]);
                self.ApplicationParameters.push(item);
            }
        }
    };


    self.ApplicationParametersLoaded = ko.observable(false);

    self.GetParameterByName = function (paramName) {

        if (!self.ApplicationParametersLoaded()) {
            self.LoadData();
            self.ApplicationParametersLoaded(true);
        }

        for (var i = 0; i < self.ApplicationParameters().length; i++) {
            var appParam = self.ApplicationParameters()[i];
            if (appParam.ParameterName() == paramName) {
                return appParam;
            }
        }
        
        return null;
    };

    self.setContext = function (ctx) {
        _ctx = ctx;
    };
};


NS.ViewModels.ApplicationParameterEditViewModel = function () {
    var self = this;
    var _ctx = null;

    self.ApplicationParameter = ko.observable(new NS.ViewModels.ApplicationParameter());

    self.Init = function (appParamId) {
        debugger;
        var data = NS.Repository.ApplicationParameters.GetAppParameterById(appParamId);
        if (!!data) {
            var item = new NS.ViewModels.ApplicationParameter();
            item.mapFromJson(data);
            self.ApplicationParameter(item);
        }
    };

    self.Save = function () {
        var model = ClearMappings(self.ApplicationParameter());
        var isSuccess = NS.Repository.ApplicationParameters.UpdateParameterValue(model, _ctx);
        return isSuccess;
    };

    self.IgnoreMappings = {
        both: [
            "_ctx",
            "IgnoreMappings"
        ],
        dirty: [

        ],
        json: [

        ]
    };

    self.setContext = function (ctx) {
        _ctx = ctx;
    };
};