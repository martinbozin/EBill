
//Дефинирање на POS
NS.ViewModels.DefineUsersForPosViewModel = function () {
    var self = this;
    var ctx = this;

    self.PosId = ko.observable();
    self.AvailableUsers = ko.observableArray();
    self.SelectedUsers = ko.observableArray();

    self.Init = function (posId) {
        self.PosId(posId);

        //Get All Users
        debugger;
        $.map(NS.Repository.Pos.GetAllUsers(), function (item) {
            debugger;
            if (item.AdditionalInfo == null)
                self.AvailableUsers.push(item);
        });
        //debugger;
        //$.map(NS.Repository.Lookups.GetAllUsers, function (item) {
        //    debugger;
        //    if (item.AdditionalInfo == null)
        //        self.AvailableUsers.push(item);
        //});

        //Get Selected Users
        var selected = NS.Repository.Pos.GetSelectedUsersForPos(posId);
        $.map(selected, function (item) {
            self.SelectedUsers.push(item.Value.toString());
        });
    };

    self.Save = function () {
        var result;
        if (self.SelectedUsers().length > 0) {
            result = NS.Repository.Pos.SetSelectedUserForPos(self.PosId(), self.SelectedUsers(), ctx);
        } else {
            result = NS.Repository.Pos.SetSelectedUserForPosToNull(self.PosId(), ctx);
        }
       
        return result;
    };

    self.setContext = function (context) {
        ctx = context;
    };

    self.IgnoreMappings = {
        both: [
            "IgnoreMappings",
            "AvailableUsers"
        ],
        dirty: [],
        json: []
    };
};