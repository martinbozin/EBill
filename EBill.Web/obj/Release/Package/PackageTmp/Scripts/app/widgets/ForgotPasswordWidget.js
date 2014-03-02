$.widget("NS.ForgotPasswordWidget",
{
    options: {
        templateId: 'forgot-password',
    },
    _init: function () {
        this.options.parentElement = this.element;
        var element = NS.Utils.String.format("<div data-bind='template:{ name:{0}}'></div>", NS.Utils.String.format('"{0}"', this.options.templateId));
        $(this.element).append(element);
        this.options.contentElement = $("div", this.element);
    },
    load: function () {
        var viewModel = new NS.ViewModels.ForgotPasswordViewModel();
        viewModel.Init();
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
        // Forgot Password 
        $('#continueBtnConfirm').click(function () {
            if (viewModel.errors().length > 0) {
                viewModel.errors.showAllMessages();
                return;
            }
                var forgotPasswordModel = ClearMappings(viewModel);
                var username = forgotPasswordModel.UserName;
                var isSuccess = NS.Repository.Users.ForgotPassword(username);
                if (isSuccess == true) {
                    $('#errorLabel').hide();
                    $('.form-horizontal-heading').hide();
                    $('.control-group').hide();
                    $('.submit-area').hide();
                    $('#UserName').hide();
                    $('#infoLabel').show();                 
                } else {
                    $('#errorLabel').text(isSuccess);
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
