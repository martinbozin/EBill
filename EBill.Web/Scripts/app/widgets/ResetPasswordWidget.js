$.widget("NS.ResetPasswordWidget",
{
    options: {
        templateId: 'reset-password',
    },
    _init: function () {
        this.options.parentElement = this.element;
        var element = NS.Utils.String.format("<div data-bind='template:{ name:{0}}'></div>", NS.Utils.String.format('"{0}"', this.options.templateId));
        $(this.element).append(element);
        this.options.contentElement = $("div", this.element);
    },
    load: function (userId) {
        var viewModel = new NS.ViewModels.ResetPasswordViewModel();
        viewModel.Init(userId);
        this.options.viewModel = viewModel;
        ko.applyBindings(viewModel, this.options.contentElement[0]);

        this._initAplicationUIActions();

        $(this.options.contentElement).dialog({
            dialogClass: 'no-close',
            title: languagePack['Scripts.app.widgets.ResetPasswordWidget.js.Title'],
            position: ["center", "center"],
            modal: true,
            closeOnEscape: false,
            draggable: false,
            resizable: false,
            width: 600,
            height: 'auto',
            create: function (event, ui) {
                $(this).parents(".ui-dialog").css("padding", 0);
                $(this).parents(".ui-dialog").css({ "border": 'solid 1px #ccc' });
                $(this).parents(".ui-dialog:first").find(".ui-dialog-content").css("padding", 0);
            },
            close: function (event, ui) {
                $(this).remove();
            }
        });
    },
    _initAplicationUIActions: function () {
        var self = this;
        var viewModel = this.options.viewModel;
        var contentElement = self.options.contentElement[0];

        $('#btn-reset', contentElement).bind('click', function () {
            NS.Controls.Dialog.confirmDialog(languagePack['Scripts.app.widgets.confirmDialog.Confirm'],languagePack['Scripts.app.widgets.confirmDialog.Message'],
                            function () {
                                viewModel.ResetPassword();
                                $(contentElement).dialog("close");
                            });
        });

        $('#btn-cancel', contentElement).bind('click', function () {
            $(contentElement).dialog("close");
        });
    },
    destroy: function () {
        this.options.viewModel = null;
        $(this.element).empty();
        $.Widget.prototype.destroy.call(this);
    }
});
