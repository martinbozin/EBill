$.widget("NS.NewRequestDefineAttributesWidget",
{
    options: {
        templateId: 'new-request-define-attributes',
        autoClose: false
    },
    _init: function () {
        this.options.parentElement = this.element;
        var element = NS.Utils.String.format("<div data-bind='template:{ name:{0}}'></div>",
                NS.Utils.String.format('"{0}"', this.options.templateId)
        );
        $(this.element).append(element);
        this.options.contentElement = $("div", this.element);
    },
    load: function (requestId, docType) {
        var self = this;

        //Init View Model
        var viewModel = new NS.ViewModels.NewRequestDefineAttributesViewModel();
        viewModel.Init(requestId, docType);
        viewModel.DirtyFlag = new ko.dirtyFlag(viewModel, false, viewModel.IgnoreMappings);

        //set up validation
        viewModel.errors = ko.validation.group({
            Attributes: viewModel.Attributes
        }, {
            deep: true
        });

        //Bind
        viewModel.setContext(this.options.contentElement);
        this.options.viewModel = viewModel;
        ko.applyBindings(viewModel, this.options.contentElement[0]);

        //OPEN AS DIALOG
        $(this.options.contentElement).dialog({
            dialogClass: 'no-close',
            title: languagePack['Scripts.app.widgets.NewRequestDefineAttributesWidget.js.Title'],//'Дефинирање на дополнителен опис',
            position: ["center", "center"],
            modal: true,
            closeOnEscape: false,
            draggable: false,
            resizable: false,
            width: 800,
            height: 'auto',
            create: function (event, ui) {
                $(this).parents(".ui-dialog").css("padding", 0);
                $(this).parents(".ui-dialog").css({ "border": 'solid 1px #fff' });
                $(this).parents(".ui-dialog:first").find(".ui-dialog-content").css("padding", 0);
            },
            close: function (event, ui) {
                $("#process-documents-dialog").remove();
                $(self.options.contentElement).remove();
                $(this).remove();
            }
        });

        //INIT UI EVENTS
        this._initAplicationUIActions();
    },
    _initAplicationUIActions: function () {
        var self = this;
        var viewModel = this.options.viewModel;
        var contentElement = self.options.contentElement[0];

        $('#btn-save', contentElement).bind('click', function (e) {
            if (viewModel.errors().length > 0) {
                viewModel.errors.showAllMessages();
                return false;
            }

            var model = {
                RequestId: viewModel.RequestId(),
                DocumentTypeId: viewModel.DocumentType().DocumentTypeId(),
                Attributes: ClearMappings(viewModel.Attributes)
            };

            var isSuccess = NS.Repository.PublicRequest.SaveOrUpdateRequestDocumentAttributes(model);
            if (isSuccess == true) {
                self._trigger('onAfterAttributesSaved');
                $(contentElement).dialog().dialog('close');
            }
        });

        $('#btn-cancel', contentElement).bind('click', function () {
            $(contentElement).dialog().dialog('close');
        });
    },
    destroy: function () {
        this.options.viewModel = null;
        $(this.element).empty();
        $.Widget.prototype.destroy.call(this);
    }
});
