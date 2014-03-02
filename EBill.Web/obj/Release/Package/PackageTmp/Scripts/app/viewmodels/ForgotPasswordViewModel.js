//Регистрација на корисник
NS.ViewModels.RegistrationConfirmationViewModel = function () {
    var self = this;
    var ctx = this;
    
    self.UserName = ko.observable().extend({
        required: true,
        email: true,       
            message: 'Внесете валиден е-маил'        
    });
    self.Code = ko.observable().extend({
        required: true,     
            message: 'Полето е задолжително'
    });
    self.Init = function () {

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
