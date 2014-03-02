NS.ViewModels.SetRolesViewModel = function () {
    var self = this;
    var _ctx = this;

    self.UserId = ko.observable();

    self.User = ko.observable();
    self.AvailableRoles = ko.observableArray();
    self.SelectedRoles = ko.observableArray();

    self.Init = function (userId) {
        self.UserId(userId);
        debugger;
        var data = NS.Repository.Roles.GetRolesForUser(userId);
        ko.utils.arrayMap(data, function (item) {
            debugger;
            self.SelectedRoles.push(item.RoleId().toString());
        });
        debugger;
        self.AvailableRoles(NS.Repository.Roles.GetAllowedAdminRoles());
    };

    self.Save = function () {
        var result = NS.Repository.Users.AddRoles(self.UserId(), self.SelectedRoles(), _ctx);
        return result;
    };


    self.setContext = function (ctx) {
        _ctx = ctx;
    };

    self.IgnoreMappings = {
        both: [
            "IgnoreMappings",
            "User",
            "AvailableRoles"
        ],
        dirty: [],
        json: []
    };
};