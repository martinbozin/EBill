//Регистрација на корисник
NS.ViewModels.ForgotPasswordConfirmationViewModel = function () {
    var self = this;
    var ctx = this;
    self.UserName = ko.observable();
    self.PasswordNew = ko.observable().extend({
        required: true,
        message: 'Полето е задолжително'
    });
   
    self.PasswordNewConfirm = ko.observable().extend({
        required: true,
        message: 'Полето е задолжително',
        validation: {
            validator: mustEqual,
            message: 'Лозинките треба да се исти.',
            params: self.PasswordNew
        }
    });

    self.Init = function (user) {
        self.UserName(user);
    };

    self.setContext = function (context) {
        ctx = context;
    };


    self.IgnoreMappings = {
        both: [
            "IgnoreMappings"

        ],
        dirty: [],
        json: []
    };
 
};

////Custom validation za proverka na vnesen password dali se sovpaga
ko.validation.configure({
    registerExtenders: true,
    messagesOnModified: true,
    insertMessages: true,
    parseInputAttributes: true,
    messageTemplate: null
});

var mustEqual = function (val, other) {
    return val == other();
};