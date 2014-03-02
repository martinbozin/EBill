//Регистрација на корисник
NS.ViewModels.ForgotPasswordViewModel = function () {
    var self = this;
    var ctx = this;
    
    self.UserName = ko.observable().extend({
        required: true,
        email: true,       
            message: 'Внесете валиден е-маил'        
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
