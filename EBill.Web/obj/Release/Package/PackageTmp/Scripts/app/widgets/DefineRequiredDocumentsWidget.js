$.widget("NS.DefineRequiredDocumentsWidget", {
    options: {
        templateId: 'define-required-documents',
    },
    _init: function () {
        this.options.parentElement = this.element;
        var element = NS.Utils.String.format("<div data-bind='template:{ name:{0}}'></div>", NS.Utils.String.format('"{0}"', this.options.templateId));
        $(this.element).append(element);
        this.options.contentElement = $("div", this.element);
    },
    load: function (requestId) {

        //Init View Model
        var viewModel = new NS.ViewModels.DefineRequiredDocumentsViewModel();
        viewModel.Init(requestId);
        viewModel.DirtyFlag = new ko.dirtyFlag(viewModel, false, viewModel.IgnoreMappings);

        //Bind
        viewModel.setContext(this.options.contentElement);
        this.options.viewModel = viewModel;
        ko.applyBindings(viewModel, this.options.contentElement[0]);

        //INIT UI EVENTS
        this._initAplicationUIActions();

        //OPEN AS DIALOG
        $(this.options.contentElement).dialog({
            dialogClass: 'no-close',
            title: languagePack['Scripts.app.widgets.DefineRequiredDocumentsWidget.js.Title'],
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
                $(this).remove();
            }
        });
    },
    _initAplicationUIActions: function () {
        var self = this;
        var viewModel = this.options.viewModel;
        var contentElement = self.options.contentElement[0];

        $('#btn-save', contentElement).bind('click', function () {
            NS.Controls.Dialog.confirmDialog(languagePack['Scripts.app.widgets.confirmDialog.Confirm'],languagePack['Scripts.app.widgets.confirmDialog.Message'],
                         function () {
                             viewModel.Save();
                             $(contentElement).dialog("close");
                         });
        });


        $('#btn-cancel', contentElement).bind('click', function () {
            $(contentElement).dialog("close");
        });

        var t = $('#multiselect', contentElement).bootstrapTransfer(
            {
                'target_id': 'multi-select-input',
                'height': '320px',
                'hilite_selection': false,
                move_elems_left2right: function (elem) {
                    console.log(elem);
                    viewModel.SelectedDocuments.push(elem.toString());
                },
                move_elems_right2left: function (elem) {
                    console.log(elem);
                    viewModel.SelectedDocuments.remove(elem.toString());
                },
                move_all: function () {
                    viewModel.SelectedDocuments([]);
                    $.map(viewModel.AvalibleDocuments(), function (item) {
                        viewModel.SelectedDocuments.push(item.Value.toString());
                    });
                },
                clear_all: function () {
                    viewModel.SelectedDocuments([]);
                }
            });
        $.map(viewModel.AvalibleDocuments(), function (item) {
            t.populate([{ value: item.Value, content: item.Text }]);
        });
        t.set_values(viewModel.SelectedDocuments());
    },
    destroy: function () {
        this.options.viewModel = null;
        $(this.element).empty();
        $.Widget.prototype.destroy.call(this);
    }
});