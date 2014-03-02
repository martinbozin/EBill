$.widget("NS.AttachDocumentWidget",
{
    options: {
        templateId: 'attach-document',
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
        var viewModel = new NS.ViewModels.NewRequestAttachDocumentViewModel();
        viewModel.Init(requestId, docType);
        viewModel.DirtyFlag = new ko.dirtyFlag(viewModel, false, viewModel.IgnoreMappings);

        //set up validation
        viewModel.errors = ko.validation.group(viewModel);

        //Bind
        viewModel.setContext(this.options.contentElement);
        this.options.viewModel = viewModel;
        ko.applyBindings(viewModel, this.options.contentElement[0]);

        //OPEN AS DIALOG
        $(this.options.contentElement).dialog({
            dialogClass: 'no-close',
            title: languagePack['Scripts.app.widgets.NewRequestWidget.js.PrikacuvanjeDokumenti'],//'Прикачување на документ/и',
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

        var failedUploads;
        var filesToBeUploaded;

        var uploadFile = function (index) {
            var currentDoc = viewModel.DocumentsForUpload()[index];
            currentDoc.UploadStarted(true);

            var requestData = {
                RequestId: viewModel.RequestId(),
                Comment: viewModel.Comment(),
                DocumentTypeId: viewModel.DocumentType().DocumentTypeId(),
            };

            $.ajaxFileUpload({
                url: baseUrl + 'SharedRequest/UploadDocument',
                fileElementId: currentDoc.FileInputElement(),
                data: requestData,
                secureuri: false,
                global: false,
                dataType: 'json',
                complete: function () {
                    currentDoc.UploadStarted(false);
                    if ((index + 1) == filesToBeUploaded) {//proverka dali e zavrseno kacuvanjeto na site dokumenti
                        $(document).trigger('on-upload-complete', failedUploads);
                    }
                    if ((index + 1) < filesToBeUploaded) {//prodolzi so kacuvanje na sledniot file
                        setTimeout(function () {
                            uploadFile(index + 1);
                        }, 100);
                    }
                },
                success: function (data, status) {
                    if (data.ok) {
                        currentDoc.UploadSuccess(true);
                    } else {
                        currentDoc.UploadFailed(true);
                        currentDoc.UploadFailedMessage(data.message);
                        failedUploads++;
                    }
                },
                error: function (settings, data, exception) {
                    currentDoc.UploadFailed(true);
                    failedUploads++;
                }
            });
        };

        $('#add-document', contentElement).bind('click', function (e) {

            var btn = $(this);
            var fileInputClone = $("<input type='file' style='display:none' />");

            $(fileInputClone).bind('change', function () {

                var newValue = $(this).val();
                var ext = newValue.substr(newValue.lastIndexOf('.') + 1);
                //for (var i = 0; i < viewModel.Documents().length; i++) {
                //    var doc = viewModel.Documents()[i];
                //    if (doc.FileName() == extractFileName(newValue)) {
                //        NS.Controls.Dialog.errorDialog("Грешка при прикачување...",
                //            "Документот веке постои во листата. Ве молиме обидете се повторно.");

                //        return false;
                //    }
                //}

                var rand = new Date().getTime();
                $(fileInputClone).attr('id', 'upl_file_' + rand);
                $(fileInputClone).attr('name', 'upl_file_' + rand);
                $(fileInputClone).appendTo($(btn).parent());

                var item = new NS.ViewModels.UploadDocumentViewModel();
                item.FileName(extractFileName(newValue));
                item.FileInputElement($(fileInputClone).attr('id'));
                viewModel.Documents.push(item);

            });
            $(fileInputClone).trigger('click');
        });

        $('#btn-save', contentElement).bind('click', function (e) {

            viewModel.PrepareDocumentsForUpload();
            failedUploads = 0;
            filesToBeUploaded = viewModel.DocumentsForUpload().length;
            if (filesToBeUploaded == 0)
                return false;

            $('#process-documents-dialog').dialog({
                resizable: false,
                width: 900,
                height: 'auto',
                bgiframe: true,
                autoOpen: false,
                modal: true,
                overlay: {
                    backgroundColor: '#000',
                    opacity: 0.5
                },
                title: languagePack['Scripts.app.widgets.NewRequestWidget.js.Title'],//'Процесирање...',
                open: function () {
                    //hide close button.
                    $(this).parent().children().children('.ui-dialog-titlebar-close').hide();
                    setTimeout(function () {
                        uploadFile(0);
                    }, 350);
                }
            }).dialog('open');

            e.preventDefault();
            return false;
        });

        $('#btn-cancel', contentElement).bind('click', function () {
            $(contentElement).dialog().dialog('close');
        });

        $(document).unbind('on-upload-complete').bind('on-upload-complete', function (event, fu) {
            self._trigger('onAfterUpload');
            if (fu == 0) {
                NS.Controls.Dialog.infoDialog(languagePack['Scripts.app.widgets.confirmDialog.Confirm'], //"Потврда...", 
                     languagePack['Scripts.app.widgets.NewRequestWidget.js.DokumentiUspesnoPrikaceni'], //"Документите се успешно прикачени.",
                    function () { });
                $("#process-documents-dialog").dialog().dialog('close');
                $('#btn-cancel', contentElement).trigger('click');
            } else {
                viewModel.PrepareDocumentsForUpload();
                $("#process-documents-dialog").dialog().dialog('close');
                NS.Controls.Dialog.errorDialog(languagePack['Scripts.app.widgets.NewRequestWidget.js.GreskaPriPrikacuvanje'], //"Грешка при прикачување...",
                    languagePack['Scripts.app.widgets.NewRequestWidget.js.GreskaPriPrikacuvanjeDokumenti'], //"Се случија грешки при обидот за прикачување на документите. Ве молиме обидете се повторно.",
                    function () { });
            }
        });
    },
    destroy: function () {
        this.options.viewModel = null;
        $(this.element).empty();
        $.Widget.prototype.destroy.call(this);
    }
});
