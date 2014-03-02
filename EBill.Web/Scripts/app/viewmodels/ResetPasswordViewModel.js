NS.ViewModels.ResetPasswordViewModel = function () {
    var self = this;
    var _ctx = null;

    self.UserId = ko.observable();
    self.User = ko.observable();

    self.Init = function (userId) {
        self.UserId(userId);
    };

    self.ResetPassword = function () {
        var result = NS.Repository.Users.ResetPassword(self.UserId(), _ctx);
        return result;
    };
    
    self.setContext = function (ctx) {
        _ctx = ctx;
    };

    self.IgnoreMappings = {
        both: [
            "IgnoreMappings",
            "User"
        ],
        dirty: [],
        json: []
    };
};