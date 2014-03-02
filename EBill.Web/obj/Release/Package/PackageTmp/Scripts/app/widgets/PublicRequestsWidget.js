$.widget("NS.PublicRequestsWidget", {
    options: {
        templateId: 'public-requests-list',
        isDetailsView: false
    },
    _init: function () {
        this.options.parentElement = this.element;
        var element = NS.Utils.String.format("<div data-bind='template:{ name:{0}}'></div>", NS.Utils.String.format('"{0}"', this.options.templateId));
        $(this.element).append(element);
        this.options.contentElement = $("div", this.element);
    },
    load: function () {
        var self = this;

        var viewModel = new NS.ViewModels.PublicRequestsViewModel();
        viewModel.Init();

        viewModel.setContext(this.options.contentElement);
        viewModel.DirtyFlag = new ko.dirtyFlag(viewModel, false, viewModel.IgnoreMappings);
        this.options.viewModel = viewModel;

        ko.applyBindings(viewModel, self.element[0]);

        this._initAplicationUIActions();
    },
    loadById: function (requestId) {
        var self = this;
        self.options.requestId = requestId;
        self.options.isDetailsView = true;

        var viewModel = new NS.ViewModels.PublicRequestViewModel();
        viewModel.Reload = function () {
            var data = NS.Repository.PublicRequest.GetFullRequestById(self.options.requestId);
            if (!!data) {
                viewModel.mapFromJson(data);
                viewModel.LoadInvestors();
                viewModel.LoadDocuments();
                viewModel.LoadNotifications();
            }
        };
        viewModel.Reload();

        viewModel.DirtyFlag = new ko.dirtyFlag(viewModel, false, viewModel.IgnoreMappings);
        this.options.viewModel = viewModel;
        ko.applyBindings(viewModel, self.element[0]);

        this._initAplicationUIActions();
    },
    _initAplicationUIActions: function () {
        var self = this;
        var viewModel = self.options.viewModel;
        var contentElement = self.options.contentElement;

        //if(self.options.isDetailsView) {
        //    $(".view-details", contentElement).hide();
        //}

        $("#txtFromDate").datepicker({
            maxDate: 0,
            changeMonth: true,
            changeYear: true,
            onSelect: function (dateText, inst) {
                $('#txtToDate').datepicker('option', 'minDate', dateText);
            },
            onClose: function () {
                $(this).change();
            }
        });

        $("#txtToDate").datepicker({
            maxDate: 0,
            changeMonth: true,
            changeYear: true,
            onSelect: function (dateText, inst) {
                $('#txtFromDate').datepicker('option', 'maxDate', dateText);
            },
            onClose: function () {
                $(this).change();
            }
        });

        $(contentElement).on('click', '.row-document-type', function (e) {
            $(this).next(".row-documents").slideToggle(100);
        });

        $(contentElement).on('click', '.view-details', function (e) {
            var requestId = ko.dataFor(this).Request().RequestId();
            window.location.href = baseUrl + 'Public/Requests/Details/' + requestId;
        });

        $(contentElement).on('click', '.view-change', function (e) {
            var requestId = ko.dataFor(this).Request().RequestId();
            window.location.href = baseUrl + 'Public/Requests/Edit/' + requestId;
        });

        $(contentElement).on('click', '.show-cadastre-municipalities', function (e) {
            $(this).next("div").slideToggle(100);
        });

        //Потпиши и Поднеси барање
        $(contentElement).on('click', '.view-sent', function () {
            var requestId = ko.dataFor(this).Request().RequestId();
            var isLicenceAgrementChecked = NS.Repository.PublicRequest.CheckedRequest(requestId);

            if (isLicenceAgrementChecked) {
     
                signRequest(requestId, viewModel, null, true, function () {                
                    var isSuccess = NS.Repository.PublicRequest.SendRequest(requestId);
                    if (isSuccess) {
                        NS.Controls.Dialog.infoDialog(languagePack['Scripts.app.widgets.PublicRequestsWidget.js.Baranje'],
                        languagePack['Scripts.app.widgets.PublicRequestsWidget.js.BaranjePodeneseno'],
                        function () {
                            viewModel.Reload();
                            window.location.href = baseUrl + 'Public/Requests/';
                        });
                    }
                });
            } else {
                var holder = $("<div>" + languagePack['Scripts.app.widgets.PublicRequestsWidget.js.Licence'] + "</div>");
                $(holder).dialog({
                    resizable: false,
                    width: 600,
                    height: 'auto',
                    bgiframe: true,
                    autoOpen: false,
                    modal: true,
                    overlay: {
                        backgroundColor: '#000',
                        opacity: 0.5
                    },
                    title: languagePack['Scripts.app.widgets.confirmDialog.Confirm'],
                    open: function () {
                        //hide close button.
                        $(this).parent().children().children('.ui-dialog-titlebar-close').hide();
                    },
                    buttons: {
                        "Продолжи": function () {

                            var isSuccess = NS.Repository.PublicRequest.SetLicenceForRequest(requestId);
                            if (!isSuccess) {
                                //TODO ALERT DEKE NE MOZE
                                $(this).dialog("close");
                                return false;
                            }

                            $(this).dialog("close");
                            signRequest(requestId, viewModel, null, true, function () {
                                var isSuccess = NS.Repository.PublicRequest.SendRequest(requestId);
                                if (isSuccess) {
                                    NS.Controls.Dialog.infoDialog(languagePack['Scripts.app.widgets.PublicRequestsWidget.js.Baranje'],
                                    languagePack['Scripts.app.widgets.PublicRequestsWidget.js.BaranjePodeneseno'],
                                    function () {
                                        viewModel.Reload();
                                        window.location.href = baseUrl + 'Public/Requests/';
                                    });
                                }
                            });
                        },
                        "Откажи": function () {
                            $(this).dialog("close");
                        }
                    }
                }).dialog('open');
            }
        });

        $(contentElement).on('click', '.view-delete', function () {
            var requestId = ko.dataFor(this).Request().RequestId();
            NS.Controls.Dialog.confirmDialog(languagePack['Scripts.app.widgets.confirmDialog.Confirm'], languagePack['Scripts.app.widgets.PublicRequestsWidget.js.MessageDelete'],
                         function () {
                             var isSuccess = NS.Repository.PublicRequest.DeleteRequest(requestId);
                             if (isSuccess) {
                                 if (self.options.isDetailsView) {
                                     window.location.href = baseUrl + 'Public/Requests/';
                                 } else {
                                     viewModel.Reload();
                                 }
                             }
                         });
        });

        $(contentElement).on('click', '.view-finance', function (e) {
            var requestId = ko.dataFor(this).Request().RequestId();
            window.location.href = baseUrl + 'Public/Requests/Finance/' + requestId;
        });

        $(contentElement).on('click', '.print-request', function (e) {
            var requestId = ko.dataFor(this).Request().RequestId();
            document.location.href = baseUrl + 'SharedRequest/PrintRequest/?requestId=' + requestId;
        });

        $(contentElement).on('click', '.withdrawn-request', function (e) {
            var requestId = ko.dataFor(this).Request().RequestId();
            NS.Controls.Dialog.confirmDialog(languagePack['Scripts.app.widgets.confirmDialog.Confirm'], languagePack['Scripts.app.widgets.PublicRequestsWidget.js.PotvrdaZaOtkaziBaranje'],
                function () {
                    signRequest(requestId, null, null, false, function () {
                        NS.Controls.Dialog.infoDialog(languagePack['Scripts.app.widgets.confirmDialog.Confirm'], languagePack['Scripts.app.widgets.PublicRequestsWidget.js.OtkaziBaranje'],
                            function () {
                                viewModel.Reload();
                            });
                    });
                });
        });
        

        $(document).on("click", ".request-upload-document", function (e) {
            var widgetHolder = $("<div></div>").appendTo(document);

            var request = ko.contextFor(this).$root;
            var requestId = request.Request().RequestId();
            $(widgetHolder).RequestUploadFinanceWidget({
                //onSave: function () {
                //}
            });
            $(widgetHolder).RequestUploadFinanceWidget("load", requestId);

            e.preventDefault();
            return false;
        });

        $(document).on("click", ".request-upload-document2", function (e) {

  //NS.Controls.Dialog.confirmDialog(languagePack['Scripts.app.widgets.confirmDialog.Confirm'], languagePack['Scripts.app.widgets.confirmDialog.Message'],
  //                       function () {
  //                           var requestId = viewModel.Request().RequestId();
  //                           var RequestDocumentId;
  //                           for (var i = 0; i < viewModel.RequestDocuments().length; i++) {
  //                               RequestDocumentId = viewModel.RequestDocuments()[i].RequestDocumentId();
  //                           }
  //                           //se podgotvuva objektniot model
  //                           var requestData = {
  //                               RequestId: requestId,
  //                               RequestDocumentId: 0,
  //                               DocumentTypeId: 101,
  //                               DocumentTypeName: "Уплатница за платени комуналии",
  //                           };

  //                           //se prikacuva dokumentot
  //                           $.ajaxFileUpload({
  //                               url: baseUrl + 'SharedRequest/UploadDocument',
  //                               fileElementId: 'fileUpload',
  //                               data: requestData,
  //                               secureuri: false,
  //                               global: false,
  //                               dataType: 'json',
  //                               complete: function () {
  //                                   var isSuccess = NS.Repository.PublicRequest.SetStateAfterAttachUtillity(requestId);
  //                                   if (isSuccess) {
  //                                       NS.Controls.Dialog.infoDialog(languagePack['Scripts.app.widgets.confirmDialog.Confirm'], languagePack['Scripts.app.widgets.PublicRequestsWidget.js.UploadMessage'],
  //                                       function () {
  //                                           window.location.reload();
  //                                       });
  //                                   }
  //                               }
  //                           });
  //                       });
        });
        

        $(document).on("click", ".attach-document", function () {
 
            var docType = ko.dataFor(this);
            var requestId = viewModel.Request().RequestId();
            var data = NS.Repository.Lookups.GetRequestTypeDetailsUtilities(docType.Request().RequestTypeId());
            if (!!data) {
 
                //requestTypeViewModel.mapFromJson(data);
                //docType = requestTypeViewModel.ProcessDocuments()[0];

                docType = new NS.ViewModels.DocumentTypeViewModel();
                docType.mapFromJson(data.ProcessDocuments[0]);

            }
 
            var widgetHolder = $.createWidgetHolder();
            $(widgetHolder).NewRequestAttachDocumentWidget({
                onAfterUpload: function (d) {
                    viewModel.LoadDocuments();
                }                 
            });

            $(widgetHolder).NewRequestAttachDocumentWidget("load", requestId, docType);
        });



    },
    destroy: function () {
        this.options.viewModel = null;
        $(this.element).empty();
        $.Widget.prototype.destroy.call(this);
    }
});