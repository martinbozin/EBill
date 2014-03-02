$.widget("NS.ForgotPasswordConfirmationWidget",
{
    options: {
        templateId: 'forgot-password-confirmation',
    },
    _init: function () {
        this.options.parentElement = this.element;
        var element = NS.Utils.String.format("<div data-bind='template:{ name:{0}}'></div>", NS.Utils.String.format('"{0}"', this.options.templateId));
        $(this.element).append(element);
        this.options.contentElement = $("div", this.element);
    },
    load: function (user) {
        var viewModel = new NS.ViewModels.ForgotPasswordConfirmationViewModel();
        viewModel.Init(user);
        this.options.viewModel = viewModel;
        ko.applyBindings(viewModel, this.options.contentElement[0]);

        this._initAplicationUIActions();
    },
    _initAplicationUIActions: function () {
        var self = this;
        var viewModel = this.options.viewModel;
        var contentElement = self.options.contentElement[0];
        viewModel.errors = ko.validation.group(viewModel);
        ///////////////////////////////////////////////////////////////////
        // Forgot Password Confirmacija
        
     
        $('#continueBtnConfirm').on("click", function () {
            if (viewModel.errors().length > 0) {
                viewModel.errors.showAllMessages();
                return;
            }

            var forgotPasswordConfirmationModel = ClearMappings(viewModel);
            var model = {
                UserName: forgotPasswordConfirmationModel.UserName,
                PasswordNew: forgotPasswordConfirmationModel.PasswordNew,
                PasswordNewConfirm: forgotPasswordConfirmationModel.PasswordNewConfirm
            };
        
            var isSuccess = NS.Repository.Users.ForgotPasswordConfirmation(model);
                if (isSuccess) {
                    window.location.href = baseUrl + 'Account/Login';
                }
 
        });
        
        /////////////////////////////////////////////////////////////////////
        //Vrakanje na Login Page
        $('#cancelBtnConfirm').click(function () {
            window.location.href = baseUrl + 'Account/Login';
        });
     
    },
    destroy: function () {
        this.options.viewModel = null;
        $(this.element).empty();
        $.Widget.prototype.destroy.call(this);
    }
});
