NS.ViewModels.RequestFullHistoryViewModel = function () {
    var self = this;
    var _ctx = null;

    self.RequestHistoryId = ko.observable();
    self.RequestHistory = ko.observable(new NS.ViewModels.RequestHistoryModel());

    self.Init = function (requestHistoryId) {
        self.RequestHistoryId(requestHistoryId);
        var data = NS.Repository.Request.GetRequestHistoryById(requestHistoryId);
        if (!!data) {
            var item = new NS.ViewModels.RequestHistoryModel();
            item.mapFromJson(data);
            self.RequestHistory(item);
        }
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
