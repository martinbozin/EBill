$.widget("NS.RegistrationConfirmationWidget",
{
    options: {
        templateId: 'registration-confirmation'
    },
    _init: function () {
        this.options.parentElement = this.element;
        var element = NS.Utils.String.format("<div data-bind='template:{ name:{0}}'></div>", NS.Utils.String.format('"{0}"', this.options.templateId));
        $(this.element).append(element);
        this.options.contentElement = $("div", this.element);
    },
    load: function () {
        var self = this;

        var viewModel = new NS.ViewModels.RegistrationConfirmationViewModel();
        viewModel.Init();
        viewModel.setContext(this.options.contentElement);
        this.options.viewModel = viewModel;
        ko.applyBindings(viewModel, self.options.contentElement[0]);

        this._initAplicationUIActions();
    },
    _initAplicationUIActions: function () {
        var self = this;
        var viewModel = self.options.viewModel;
        var contentElement = self.options.contentElement;
        viewModel.errors = ko.validation.group(viewModel);

        $.fn.fixPlaceHolders();
        ///////////////////////////////////////////////////////////////////
        // CONFIRM THE REGISTRATION
        $('#continueBtnConfirm').click(function () {
            if (viewModel.errors().length > 0) {
                viewModel.errors.showAllMessages();
                return;
            }

            var registrationConfirmationModel = ClearMappings(viewModel);
            var model = {
                UserName: registrationConfirmationModel.UserName,
                Code: registrationConfirmationModel.Code
            };
            var isSuccess = NS.Repository.Users.RegistrationConfirmation(model);
            if (isSuccess) {
                window.location.href = baseUrl;
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
