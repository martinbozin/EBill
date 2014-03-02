$.widget("NS.NewRequestWidget",
{
    options: {
        templateId: 'new-request',
    },
    _init: function () {
        this.options.parentElement = this.element;
        var element = NS.Utils.String.format("<div data-bind='template:{ name:{0}}'></div>",
                NS.Utils.String.format('"{0}"', this.options.templateId)
        );
        $(this.element).append(element);
        this.options.contentElement = $("div", this.element);
    },
    load: function () {
        //Init View Model
        var viewModel = new NS.ViewModels.NewRequestViewModel();
        viewModel.Init();
        viewModel.DirtyFlag = new ko.dirtyFlag(viewModel, false, viewModel.IgnoreMappings);

        //Set Up Validator
        var validator = new NS.Validators.NewRequestViewModelValidator();
        validator.setupValidationRules(viewModel);

        //Bind
        viewModel.setContext(this.options.contentElement);
        this.options.viewModel = viewModel;
        ko.applyBindings(viewModel, this.options.contentElement[0]);

        //INIT UI EVENTS
        this._initAplicationUIActions();
    },
    edit: function (requestId) {
        //Init View Model
        var viewModel = new NS.ViewModels.NewRequestViewModel();
        viewModel.Edit(requestId);
        viewModel.DirtyFlag = new ko.dirtyFlag(viewModel, false, viewModel.IgnoreMappings);

        //Set Up Validator
        var validator = new NS.Validators.NewRequestViewModelValidator();
        validator.setupValidationRules(viewModel);

        //Bind
        viewModel.setContext(this.options.contentElement);
        this.options.viewModel = viewModel;
        ko.applyBindings(viewModel, this.options.contentElement[0]);

        //INIT UI EVENTS
        this._initAplicationUIActions();
    },
    _initAplicationUIActions: function () {
        var self = this;
        var viewModel = this.options.viewModel;
        var contentElement = self.options.contentElement[0];

        var saveOrUpdateRequest = function () {
            var model = ClearMappings(viewModel);
            var requestModel = {
                RequestId: model.RequestId,
                RequestTypeId: model.RequestTypeId,
                ConstructionTypeId: model.ConstructionTypeId,
                ConstructionDescription: model.ConstructionDescription,
                ConstructionAddress: model.ConstructionAddress,
                ContactPerson: model.ContactPerson,
                Email: model.Email,
                Mobile: model.Mobile,
                Phone: model.Phone,
                SMSNotifications: model.SMSNotifications,
                Investors: model.Investors,
                RequestMunicipalities: model.RequestMunicipalities,
                Agree: model.Agree
            };

            var contentHolder = $('<div class="confirm-wrap" />')
                .html(languagePack['Scripts.app.widgets.NewRequestWidget.js.SeProcesiraPocekajte']);

            var modal = $('<div />').append(contentHolder);
            modal.dialog({
                resizable: false,
                width: 550,
                height: 300,
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
                    var dlg = this;
                    setTimeout(function () {
                        var retVal;
                        if (viewModel.RequestId() == undefined) {
                            retVal = NS.Repository.PublicRequest.SaveRequest(requestModel);
                            if (retVal.Result == 'True') {
                                viewModel.RequestId(retVal.ID);
                                //tuke kreirame kolace i go prefrlame vo Edit Mode
                                //poso vnesil podatoci i baranjeto e kreirano vo baza
                                $.cookie('last_created_request', retVal.ID, { expires: 7, path: '/' });
                                window.location.replace(baseUrl + 'Public/Requests/Edit/' + retVal.ID);
                            }
                        } else {
                            retVal = NS.Repository.PublicRequest.UpdateRequest(requestModel);
                        }
                        if (retVal != null && retVal.Result == 'False') {
                            NS.Controls.Dialog.errorDialog(languagePack['Scripts.app.widgets.NewRequestWidget.js.Greska'], languagePack['Scripts.app.widgets.PublicRequestsWidget.js.Licence']);
                        } else {
                            $(document).trigger('on-close-processing-dialog', viewModel.currentWizardStep());
                        }
                        $(dlg).dialog('close');
                    }, 250);
                },
                close: function () {
                    $(this).remove();
                }
            }).dialog('open');
        };

        var $rootwizard = $('#rootwizard', contentElement);
        $rootwizard.bootstrapWizard({
            tabClass: 'nav nav-tabs',
            onTabClick: function (tab, navigation, index) {
                return false;
            },
            onNext: function (tab, navigation, index) {
                switch (index) {
                    case 1:
                        if (viewModel.step1Errors().length > 0) {
                            viewModel.step1Errors.showAllMessages();
                            return false;
                        }

                        if (viewModel.ContactPerson() == undefined) {
                            var firstInvestor = viewModel.Investors()[0];
                            viewModel.ContactPerson(firstInvestor.InvestorName());
                        }
                        break;
                    case 2:
                        if (viewModel.step2Errors().length > 0) {
                            viewModel.step2Errors.showAllMessages();
                            return false;
                        }

                        saveOrUpdateRequest();

                        return false;
                        break;
                    case 3:
                        //if (viewModel.step3Errors().length > 0) {
                        //    viewModel.step3Errors.showAllMessages();
                        //    return false;
                        //}  
                        if (viewModel.RequestDocuments().length == 0) {
                            NS.Controls.Dialog.confirmDialog(languagePack['Scripts.app.widgets.confirmDialog.Confirm'], languagePack['Scripts.app.widgets.NewRequestWidget.js.NemateDokumenti'],//'Немате прикачено ниту еден документ за барањето. Дали сакате да продолжите?',
                                function () {                            
                                    $($rootwizard).bootstrapWizard('show', 3);
                                    viewModel.currentWizardStep(viewModel.currentWizardStep() + 1);
                                    $('html, body').animate({ scrollTop: 0 }, 'slow');
                                });
                            return false;
                        }                     
                        $('html, body').animate({ scrollTop: 0 }, 'slow');
                        break;
                }
                viewModel.currentWizardStep(viewModel.currentWizardStep() + 1);
                return true;
            },
            onTabShow: function (tab, navigation, index) {
                var $total = navigation.find('li').length;
                var $current = index + 1;

                if ($current >= $total) {
                    $rootwizard.find('.pager .next').hide();
                    $rootwizard.find('.pager .finish').show();
                    $rootwizard.find('.pager .finish').removeClass('disabled');
                } else {
                    $rootwizard.find('.pager .next').show();
                    $rootwizard.find('.pager .finish').hide();
                }
            }
        });

        $(document).on('on-close-processing-dialog', function (e, currentWizardStep) {
            if (currentWizardStep == 2) { //dokolku doaga od cekor 2
                $($rootwizard).bootstrapWizard('show', 2);
                viewModel.currentWizardStep(viewModel.currentWizardStep() + 1);
            } else {
                //dokolku doaga od finish cekorot
                window.location.href = baseUrl + 'Public/Requests/Details/' + viewModel.RequestId();
            }
        });

        $('#rootwizard .finish', contentElement).click(function () {
            if (viewModel.step4Errors().length > 0) {
                viewModel.step4Errors.showAllMessages();
                return false;
            }
            saveOrUpdateRequest();
        });

        $(document).on("click", "#tooltip1Dialog1", function () {
            $('#dialogTip1').dialog({
                height: 400,
                width: 450,
                modal: true,
                resizable: false,
                buttons: {
                    "OK": function () {
                        $(this).dialog("close");
                    },
                },
                close: function () {
                    $(this).dialog("close");
                }
            });
        });

        $(document).on("click", "#tooltip1Dialog2", function () {
            $('#dialogTip2').dialog({
                height: 400,
                width: 450,
                resizable: false,
                modal: true,
                buttons: {
                    "OK": function () {
                        $(this).dialog("close");
                    },
                },
                close: function () {
                    $(this).dialog("close");
                }
            });
        });

        $(document).on("click", ".attach-document", function () {
  
            var docType = ko.dataFor(this);
            var context = ko.contextFor(this);

            var widgetHolder = $.createWidgetHolder();
            $(widgetHolder).NewRequestAttachDocumentWidget({
                onAfterUpload: function () {
                    viewModel.LoadRequestDocuments();
                }
            });
            $(widgetHolder).NewRequestAttachDocumentWidget("load", context.$root.RequestId(), docType);
        });

        $(document).on("click", ".define-attributes", function () {
            var docType = ko.dataFor(this);
            var context = ko.contextFor(this);

            var widgetHolder = $.createWidgetHolder();
            $(widgetHolder).NewRequestDefineAttributesWidget({
                onAfterAttributesSaved: function () {
                    viewModel.LoadRequestAttributes();
                }
            });
            $(widgetHolder).NewRequestDefineAttributesWidget("load", context.$root.RequestId(), docType);
        });

        $(document).on("click", "li.documents-tab", function () {
            var rel = $(this).attr('rel');
            $(this).addClass('active');
            $('li.attributes_tab[rel=' + rel + ']').removeClass('active');
            $('div.tab-pane-documents[rel=' + rel + ']').show();
            $('div.tab-pane-attributes[rel=' + rel + ']').hide();
        });

        $(document).on("click", "li.attributes_tab", function () {
            var rel = $(this).attr('rel');
            $(this).addClass('active');
            $('li.documents-tab[rel=' + rel + ']').removeClass('active');
            $('div.tab-pane-documents[rel=' + rel + ']').hide();
            $('div.tab-pane-attributes[rel=' + rel + ']').show();
        });

        //Dokolku e apla novo krerano baranje go nosime na cekorot so dokumentite
        //ova e za test $.cookie('last_created_request', '0cc9c804-52c4-460e-ba6a-4880ee3d3e54');
        //da se vidi deka odi na 3tiot cekor 
        if ($.cookie('last_created_request') != null) {
            $.removeCookie('last_created_request', { path: '/' });
            $($rootwizard).bootstrapWizard('show', 2);
            viewModel.currentWizardStep(3);
        }
    },
    destroy: function () {
        this.options.viewModel = null;
        $(this.element).empty();
        $.Widget.prototype.destroy.call(this);
    }
});
