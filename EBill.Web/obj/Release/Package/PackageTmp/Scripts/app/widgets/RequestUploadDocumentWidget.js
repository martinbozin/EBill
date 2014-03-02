$.widget("NS.RequestUploadDocumentWidget", {
    options: {
        templateId: 'request-upload-document',
    },
    _init: function () {
        this.options.parentElement = this.element;
        var element = NS.Utils.String.format("<div data-bind='template:{ name:{0}}'></div>", NS.Utils.String.format('"{0}"', this.options.templateId));
        $(this.element).append(element);
        this.options.contentElement = $("div", this.element);
    },
    load: function (requestId, requestDocumentId, fileName,comment,filePath) {
        var self = this;
        var viewModel = new NS.ViewModels.RequestUploadDocumentViewModel();
        viewModel.Init(requestId, requestDocumentId, fileName, comment, filePath);
        viewModel.setContext(this.options.contentElement);
        viewModel.DirtyFlag = new ko.dirtyFlag(viewModel, false, viewModel.IgnoreMappings);

        this.options.viewModel = viewModel;
        ko.applyBindings(viewModel, self.element[0]);

        //INIT UI EVENTS
        this._initAplicationUIActions();
        
        //OPEN AS DIALOG
        $(this.options.contentElement).dialog({
            dialogClass: 'no-close',
            title: languagePack['Scripts.app.widgets.RequestUploadDocumentWidget.js.PrikaciDokument'],//'Прикачи Документ',
            position: ["center", "center"],
            modal: true,
            closeOnEscape: false,
            draggable: false,
            resizable: false,
            width: 500,
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
        var viewModel = self.options.viewModel;
        var contentElement = self.options.contentElement[0];

        $('#btn-save', contentElement).bind('click', function () {
            
            NS.Controls.Dialog.confirmDialog(languagePack['Scripts.app.widgets.confirmDialog.Confirm'], languagePack['Scripts.app.widgets.confirmDialog.Message'],
                         function () {
                             var requestId = viewModel.RequestId();
                             //se podgotvuva objektniot model
                             var requestData = {
                                 FileName: viewModel.FileName(),
                                 RequestId: requestId,
                                 RequestDocumentId: viewModel.RequestDocumentId(),
                                 DocumentTypeId: 73,
                                 Comment: viewModel.Comment(),
                                 FilePath: viewModel.FilePath(),
                                 DocumentTypeName: languagePack['Scripts.app.widgets.RequestUploadDocumentWidget.js.DopolnitelenDokument'],//"Дополнителен документ",
                             };
                
                             //se prikacuva dokumentot
                             $.ajaxFileUpload({
                                 url: baseUrl + 'SharedRequest/UploadDocument',
                                 fileElementId: 'fileUpload',
                                 data: requestData,
                                 secureuri: false,
                                 global: false,
                                 dataType: 'json',
                                 complete: function (d) {
                                 
                                     var error = $.parseJSON(d.responseText);
                                     var errorMessageDesplay = error.message;
                                     var errorMessage = error.ok;
                                     if (errorMessage == false) {
                                         $('#error').text(errorMessageDesplay);
                                         $('#Comment').val("");
                                         $('#error').css('color', 'red');
                                         $('#btn-save').attr('disabled', 'disabled');
                                         return false;
                                     }
                                     
                                     $(contentElement).dialog("close");
                                     window.location.href = baseUrl + 'Admin/Requests/Details/' + viewModel.RequestId();
                                 }
                             });
                           
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