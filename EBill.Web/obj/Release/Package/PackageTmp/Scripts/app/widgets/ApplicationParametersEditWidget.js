(function ($) {
    $.widget("NS.ApplicationParametersEditWidget",
    {
        options: {
            templateId: 'application-parameter-edit'
        },
        _init: function () {
            this.options.parentElement = this.element;
            var element = NS.Utils.String.format("<div data-bind='template:{ name:{0}}'></div>", NS.Utils.String.format('"{0}"', this.options.templateId));
            $(this.element).append(element);
            this.options.contentElement = $("div", this.element);
        },
        load: function (appParamId) {
            var self = this;

            var viewModel = new NS.ViewModels.ApplicationParameterEditViewModel();
            viewModel.Init(appParamId);
            viewModel.setContext(this.options.contentElement);
            viewModel.DirtyFlag = new ko.dirtyFlag(viewModel, false, viewModel.IgnoreMappings);
            this.options.viewModel = viewModel;
            ko.applyBindings(viewModel, self.element[0]);

            $(this.options.contentElement).dialog({
                dialogClass: 'no-close',
                title: languagePack['Scripts.app.widgets.ApplicationParametersEditWidget.js.Title'],
                position: ["center", "center"],
                modal: true,
                closeOnEscape: false,
                draggable: false,
                resizable: false,
                width: 600,
                height: 'auto',
                create: function (event, ui) {
                    $(this).parents(".ui-dialog").css("padding", 0);
                    $(this).parents(".ui-dialog").css({ "border": 'solid 1px #fff' });
                    $(this).parents(".ui-dialog:first").find(".ui-dialog-content").css("padding", 0);
                },
                close: function (event, ui) {
                    $(this).remove();
                }
            });

            this._initAplicationUIActions();
        },
        _initAplicationUIActions: function () {
            var self = this;
            var viewModel = self.options.viewModel;
            var contentElement = self.options.contentElement;

            $("#btn-cancel", contentElement).bind("click", function () {
                $(contentElement).dialog('close');
            });

            $("#btn-save", contentElement).bind("click", function () {
                if (viewModel.Save()) {
                    self._trigger("onSave");
                    $(contentElement).dialog('close');
                }
            });

            if ($("#txt-parameter-value").hasClass("string")) {
                $("#txt-parameter-value").attr("maxLength", 250);
            } else if ($("#txt-parameter-value").hasClass("int")) {
                $("#txt-parameter-value").attr("maxLength", 10);
                $("#txt-parameter-value").numeric();
            } else if ($("#txt-parameter-value").hasClass("datetime")) {
                $("#txt-parameter-value").datepicker({
                    dateFormat: 'dd.mm.yy'
                });
            } else if ($("#txt-parameter-value").hasClass("float")) {
                $("#txt-parameter-value").attr("maxLength", 10);
                $("#txt-parameter-value").autoNumeric({ aSep: '.', aDec: ',' });
            } else if ($("#txt-parameter-value").hasClass("byte")) {
                $("#txt-parameter-value").attr("maxLength", 3);
                $("#txt-parameter-value").numeric();
            } else if ($("#txt-parameter-value").hasClass("date")) {
                $("#txt-parameter-value").attr("maxLength", 8);
                $("#txt-parameter-value").numeric();
            }
        },
        destroy: function () {
            this.options.viewModel = null;
            $(this.element).empty();
            $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);
