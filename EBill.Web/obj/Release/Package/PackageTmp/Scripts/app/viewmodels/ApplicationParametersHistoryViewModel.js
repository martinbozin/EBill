
NS.ViewModels.ApplicationParametersHistoryViewModel = function () {
    var self = this;
    var _ctx = null;

    self.ApplicationParameters = ko.observableArray();
    self.parameterName = ko.observable();
    self.Init = function (parameterName) {
        self.parameterName = parameterName;
        self.LoadData(parameterName);
    };

    self.LoadData = function (parameterName) {
        self.ApplicationParameters.removeAll();
        var data = NS.Repository.ApplicationParameters.GetParametersForParameterName(parameterName);
        if (!!data) {
            for (var i = 0; i < data.length; i++) {
                var item = new NS.ViewModels.ApplicationParameter();
                item.mapFromJson(data[i]);
                self.ApplicationParameters.push(item);
            }
        }
    };

    self.setContext = function (ctx) {
        _ctx = ctx;
    };
};
