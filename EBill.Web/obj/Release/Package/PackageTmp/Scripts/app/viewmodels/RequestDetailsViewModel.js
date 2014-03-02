//Внесување во Архива
NS.ViewModels.ArchiveRequestViewModel = function () {
    var self = this;

    self.RequestId = ko.observable();
    self.ArchiveNumber = ko.observable('');
    self.Comment = ko.observable();

    self.Init = function (requestId) {
        self.RequestId(requestId);
    };

    self.canSave = ko.computed(function () {
        if (self.ArchiveNumber() != '') {
            return true;
        }
        return false;
    });

    self.GetActionModelName = function () {
        return 'ArchiveRequestViewModel';
    };

    self.IgnoreMappings = {
        both: [
            "_ctx",
            "IgnoreMappings",
            "Init",
            "Save",
            "canSave",
            "GetActionModelName"
        ],
        dirty: [

        ],
        json: [

        ]
    };
};

//Раководител го доделува барањето на некој службеник 
NS.ViewModels.DefineEmployeeForRequestViewModel = function () {
    var self = this;
    var _ctx = this;

    self.RequestId = ko.observable();
    self.Comment = ko.observable();
    self.EmployeeId = ko.observable(0);

    self.AllEmployers = ko.observableArray();
    self.GetEmployersForRequest = ko.observableArray();

    self.Init = function (requestId) {
        self.RequestId(requestId);

        self.AllEmployers(NS.Repository.Request.GetAllEmployers());
        self.GetEmployersForRequest(NS.Repository.Request.GetSelectedEmployersForRequest(requestId));

        if (self.GetEmployersForRequest() != null) {
            self.EmployeeId(self.GetEmployersForRequest().Id);
        }
    };

    self.Save = function () {
        var result = NS.Repository.Request.AssignRequest(ClearMappings(self), _ctx);
        return result;
    };

    self.canSave = ko.computed(function () {
        if (self.EmployeeId() > 0) {
            return true;
        }
        return false;
    });

    self.setContext = function (ctx) {
        _ctx = ctx;
    };

    self.GetActionModelName = function () {
        return 'DefineEmployeeForRequestViewModel';
    };

    self.IgnoreMappings = {
        both: [
            "IgnoreMappings",
            "AllEmployers",
            "GetEmployersForRequest",
            "canSave",
            "GetActionModelName"
        ],
        dirty: [],
        json: []
    };

};

//////////////////////////////////////////////////////////////////////////////////////
//Барањето е доделено на некој службеник 
//и истиот го обработува
//ИЛИ
//Барањето е доделено на некој контролор 
//за потврда на статусот и институциите на барањето
//ИЛИ
//Барањето е доделено на раководител
//за потврда на статусот и институциите на барањето
NS.ViewModels.ProcessRequestViewModel = function () {
    var self = this;

    self.RequestId = ko.observable();
    self.StatusId = ko.observable(0);
    self.Comment = ko.observable();

    self.GetAllAvalibleInstitutionForRequest = ko.observableArray();
    self.SelectedInstitutionsForRequest = ko.observableArray([]);

    self.Init = function (requestId) {
        self.RequestId(requestId);

        var data = NS.Repository.Request.GetAvalibleInstitutionForRequest(requestId);
        if (!!data) {
            for (var i = 0; i < data.length; i++) {
                var item = new NS.ViewModels.RequestInstitutionsViewModel();
                item.mapFromJson(data[i]);
                self.GetAllAvalibleInstitutionForRequest.push(item);
            }
        }

        //Load Request Notifications
        data = NS.Repository.Request.GetRequestNotifications(requestId);
        if (!!data) {
            for (i = 0; i < data.length; i++) {
                self.SelectedInstitutionsForRequest.push(data[i].ExternalInstitutionId.toString());
            }
        }
    };

    self.canSave = ko.computed(function () {
        if (self.StatusId() != undefined) {
            return true;
        }
        return false;
    });

    self.GetActionModelName = function () {
        return 'ProcessRequestViewModel';
    };

    self.IgnoreMappings = {
        both: [
            "_ctx",
            "IgnoreMappings",
            "Init",
            "Save",
            "Init",
            "canSave",
            "areLoadedAvalibleInstitutions",
            "GetAllAvalibleInstitutionForRequest",
            "GetActionModelName"
        ],
        dirty: [

        ],
        json: [

        ]
    };
};
//////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////
//Барањето е доделено на институциите и се чека на одговор - Кај Службеник
//ИЛИ
//Барањето е доделено на институциите и се чека на одговор - Кај Контролор
//ИЛИ
//Барањето е доделено на институциите и се чека на одговор - Кај Раководител
NS.ViewModels.InstitutionProcessRequestViewModel = function () {
    var self = this;

    self.RequestId = ko.observable();
    self.StatusId = ko.observable(0);
    self.Comment = ko.observable();
    self.UtilitySkopje = ko.observable(0);

    self.Answers = ko.observableArray();
    self.SendDaysToInstitution = ko.observable();

    self.Neighborhoods = ko.observableArray();

    self.Init = function (requestId) {
        self.RequestId(requestId);

        var data1 = NS.Repository.Request.GetDaysFromSendToInstitution(requestId);
        if (!!data1) {
            self.SendDaysToInstitution(data1.SendDaysToInstitution);
        }

        if (!window.currentUser.isExternal()) {
            var data = NS.Repository.Request.GetRequestNotifications(requestId);
            if (!!data) {
                for (var i = 0; i < data.length; i++) {
                    var item = new NS.ViewModels.RequestNotificationViewModel();
                    item.MapFromJson(data[i]);
                    self.Answers.push(item);
                }
            }
        }

        self.Neighborhoods.push(new NS.ViewModels.NeighborhoodViewModel());
    };

    self.canSave = ko.computed(function () {
        if (self.StatusId() != undefined) {
            return true;
        }
        return false;
    });

    self.removeNeighborhood = function () {
        self.Neighborhoods.remove(this);
    };

    self.canAddNeighborhood = ko.computed(function () {
        var allValid = true;
        for (var i = 0; i < self.Neighborhoods().length; i++) {
            var ith = self.Neighborhoods()[i];
            if (ith.neighborhoodName() == '' || ith.neighborhoodAddress() == '' || ith.neighborhoodCadastreParcel() == '') {
                allValid = false;
                continue;
            }
        }
        return allValid;
    });

    self.addNeighborhood = function () {
        self.Neighborhoods.push(new NS.ViewModels.NeighborhoodViewModel());
    };

    self.GetActionModelName = function () {
        return 'InstitutionProcessRequestViewModel';
    };

    self.IgnoreMappings = {
        both: [
            "_ctx",
            "IgnoreMappings",
            "Init",
            "Init",
            "canSave"
        ],
        dirty: [

        ],
        json: [

        ]
    };
};
//////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////
//Барањето е доделено на Финансии- На Финансии
NS.ViewModels.FinanceProcessRequestViewModel = function () {
    var self = this;

    self.RequestId = ko.observable();
    self.Comment = ko.observable();
    self.Utilities = ko.observable().extend({
        required: true,
        message: 'Полето е задолжително'
    });

    self.Init = function (requestId) {
        self.RequestId(requestId);

    };
    self.IsFreeFromUtilities = ko.observable(false);

    self.IsFreeFromUtilitiesAction = ko.computed(function () {
        if (self.IsFreeFromUtilities() == true) {
            self.IsFreeFromUtilities(true);

        }
        return;
    });

    self.GetActionModelName = function () {
        return 'FinanceProcessRequestViewModel';
    };

    self.IgnoreMappings = {
        both: [
            "_ctx",
            "IgnoreMappings",
            "Init",
            "Init",
            "canSave"
        ],
        dirty: [

        ],
        json: [

        ]
    };
};

//Барањето е доделено на Финансии- На Контролор/Градоначалник
NS.ViewModels.FinanceControllorProcessRequestViewModel = function () {
    var self = this;

    self.RequestId = ko.observable();
    self.Comment = ko.observable();

    self.Init = function (requestId) {
        self.RequestId(requestId);

    };

    self.GetActionModelName = function () {
        return 'FinanceControllorProcessRequestViewModel';
    };

    self.IgnoreMappings = {
        both: [
            "_ctx",
            "IgnoreMappings",
            "Init"
        ],
        dirty: [

        ],
        json: [

        ]
    };
};

//Барањето е испратено до Барателот и се чека на уплата на комуналиите- На Финансии
NS.ViewModels.Finance2ProcessRequestViewModel = function () {
    var self = this;

    self.RequestId = ko.observable();
    self.StatusId = ko.observable(0);
    self.Comment = ko.observable();


    self.Init = function (requestId) {
        self.RequestId(requestId);
    };


    self.GetActionModelName = function () {
        return 'Finance2ProcessRequestViewModel';
    };

    self.IgnoreMappings = {
        both: [
            "_ctx",
            "IgnoreMappings",
            "Init",
            "Init",
            "canSave"
        ],
        dirty: [

        ],
        json: [

        ]
    };
};
//////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////
//Барањето е испратено до служба и се чека на одобрување или одбивање - Кај Служба
NS.ViewModels.ApproveRequestViewModel = function () {
    var self = this;

    self.RequestId = ko.observable();
    self.StatusId = ko.observable(0);
    self.Comment = ko.observable();

    self.Init = function (requestId) {
        self.RequestId(requestId);
    };


    self.GetActionModelName = function () {
        return 'ApproveRequestViewModel';
    };

    self.IgnoreMappings = {
        both: [
            "_ctx",
            "IgnoreMappings",
            "Init",
            "Init",
            "canSave"
        ],
        dirty: [

        ],
        json: [

        ]
    };
};
//////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////
//Барањето е испратено до служба и се чека на одобрување или одбивање - Кај Служба
NS.ViewModels.WithdrawnRequestViewModel = function () {
    var self = this;

    self.RequestId = ko.observable();
    self.StatusId = ko.observable(0);
    self.Comment = ko.observable();

    self.Init = function (requestId) {
        self.RequestId(requestId);
    };


    self.GetActionModelName = function () {
        return 'WithdrawnRequestViewModel';
    };

    self.IgnoreMappings = {
        both: [
            "_ctx",
            "IgnoreMappings",
            "Init",
            "Init",
            "canSave"
        ],
        dirty: [

        ],
        json: [

        ]
    };
};
//////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////////////
//РОКОВИ
NS.ViewModels.RequestDeadlineItemViewModel = function () {
    var self = this;

    self.Phase = ko.observable();
    self.Status = ko.observable();
    self.Total = ko.observable();

    self.mapFromJson = function (data) {
        self.Phase(window.languagePack["eDozvoli.Web.Phase.Name." + data.Phase + ""]);
        self.Status((window.languagePack["eDozvoli.Web.Phase.Status." + data.Status + ""]));
        self.Total(data.Total);
    };
};

NS.ViewModels.RequestDeadlineViewModel = function () {
    var self = this;

    self.Request = ko.observable();
    self.RequestDeadlines = ko.observableArray([]);

    self.Total = ko.observable();

    self.Init = function (request) {
        self.Request(request);

        var data = NS.Repository.Request.GetRequestDeadlines(self.Request().RequestId());
        if (!!data) {
            for (var i = 0; i < data.RequestDeadlines.length; i++) {
                var item = new NS.ViewModels.RequestDeadlineItemViewModel();
                item.mapFromJson(data.RequestDeadlines[i]);
                self.RequestDeadlines.push(item);
            }
            self.Total(data.Total);
        }
    };

    self.IgnoreMappings = {
        both: [
            "_ctx",
            "IgnoreMappings",
            "Init"
        ],
        dirty: [

        ],
        json: [

        ]
    };
};
//////////////////////////////////////////////////////////////////////////////////////

//Детали за Барање
NS.ViewModels.RequestDetailsViewModel = function () {
    var self = this;
    var _ctx = null;

    self.RequestId = ko.observable();
    self.Request = ko.observable(new NS.ViewModels.RequestViewModel());
    self.RequestHistory = ko.observableArray([]);
    self.AvailableMunicipalities = ko.observableArray([]);
    self.RequestInvestors = ko.observableArray([]);
    self.SubmittedDocuments = ko.observableArray([]);
    self.ProcessDocuments = ko.observableArray([]);
    self.AdditionalDocuments = ko.observableArray([]);
    self.RequestMunicipalities = ko.observableArray([]);

    //Presmetka na denovite za predmetot
    self.DaysFromSend = ko.observable();
    self.DaysInCurrentState = ko.observable();

    self.ActionModel = ko.observable();
    self.RequestDeadlineModel = ko.observable(new NS.ViewModels.RequestDeadlineViewModel());
    self.Request2UserNotificationModel = ko.observable(new NS.ViewModels.Request2UserNotificationViewModel());
    self.WorkflowModel = ko.observable();

    self.Init = function (requestId) {

        self.RequestId(requestId);

        //Load All Municipality
        self.AvailableMunicipalities(NS.Repository.Lookups.GetAllMunicipalities());

        //Load Request
        self.LoadRequestDetails();

        //Load RequestMunicipalities
        self.LoadRequestMunicipalities();

        //Load Documents
        self.LoadDocuments();

        //Load Investors
        self.LoadInvestors();

        var data5 = NS.Repository.Request.GetRequestDaysFromSend(requestId);
        if (!!data5) {
            self.DaysFromSend(data5.DaysFromSend);
            self.DaysInCurrentState(data5.DaysInCurrentState);
        }

        ////////////////////////////////////////////////////////////
        var actionModel;
        if (self.Request().StateTag() == 'Sended') {
            actionModel = new NS.ViewModels.ArchiveRequestViewModel();
            actionModel.Init(requestId);
            self.ActionModel(actionModel);
        }
        else if (self.Request().StateTag() == 'Archived') {
            actionModel = new NS.ViewModels.DefineEmployeeForRequestViewModel();
            actionModel.Init(requestId);
            self.ActionModel(actionModel);
        } else if (self.Request().StateTag() == 'AssignedTo'
                || self.Request().StateTag() == 'AssignedToController'
                || self.Request().StateTag() == 'AssignedToHead'
                || self.Request().StateTag() == 'CanceledMajorApprove'
            ) {
            actionModel = new NS.ViewModels.ProcessRequestViewModel();
            actionModel.Init(requestId);
            if (self.Request().Level1Status() != null) {
                actionModel.StatusId(self.Request().Level1Status());
            }
            self.ActionModel(actionModel);
        }
        else if (self.Request().StateTag() == 'Institutions'
            || self.Request().StateTag() == 'InstitutionToController'
            || self.Request().StateTag() == 'InstitutionToHead'
            || self.Request().StateTag() == 'CanceledMajorApprove'
            ) {
            actionModel = new NS.ViewModels.InstitutionProcessRequestViewModel();
            actionModel.Init(requestId);
            if (self.Request().Level2Status() != null) {
                actionModel.StatusId(self.Request().Level2Status());
            }
            self.ActionModel(actionModel);
        }
        else if (self.Request().StateTag() == 'Finance') {
            actionModel = new NS.ViewModels.FinanceProcessRequestViewModel();
            actionModel.Init(requestId);
            self.ActionModel(actionModel);
        } else if (self.Request().StateTag() == 'FinanceToControllor') {
            actionModel = new NS.ViewModels.FinanceControllorProcessRequestViewModel();
            actionModel.Init(requestId);
            self.ActionModel(actionModel);
        } else if (self.Request().StateTag() == 'FinanceMajorApprove') {
            actionModel = new NS.ViewModels.FinanceControllorProcessRequestViewModel();
            actionModel.Init(requestId);
            self.ActionModel(actionModel);
        } else if (self.Request().StateTag() == 'Finance2') {
            actionModel = new NS.ViewModels.Finance2ProcessRequestViewModel();
            actionModel.Init(requestId);
            if (self.Request().Level3Status() != null) {
                actionModel.StatusId(self.Request().Level3Status());
            }
            self.ActionModel(actionModel);
        }
        else if (self.Request().StateTag() == 'OfficerApprove'
                || self.Request().StateTag() == 'ControllorApprove'
                || self.Request().StateTag() == 'HeadApprove'
                || self.Request().StateTag() == 'MajorApproveRequest'
                || self.Request().StateTag() == 'CanceledMajorApprove'
            ) {
            actionModel = new NS.ViewModels.ApproveRequestViewModel();
            actionModel.Init(requestId);
            if (self.Request().Level4Status() != null) {
                actionModel.StatusId(self.Request().Level4Status());
            }
            self.ActionModel(actionModel);
        }
        else if (self.Request().StateTag() == 'Approved') {
            actionModel = new NS.ViewModels.ApproveRequestViewModel();
            actionModel.Init(requestId);
            if (self.Request().Level4Status() != null) {
                actionModel.StatusId(self.Request().Level4Status());
            }
            self.ActionModel(actionModel);
        }
        else if (self.Request().StateTag() == 'Withdrawn') {
            actionModel = new NS.ViewModels.WithdrawnRequestViewModel();
            actionModel.Init(requestId);
            if (self.Request().Level4Status() != null) {
                actionModel.StatusId(self.Request().Level4Status());
            }
            self.ActionModel(actionModel);
        }


        var workflowModel = new NS.ViewModels.WorkflowViewModel();
        workflowModel.Init(requestId);
        self.WorkflowModel(workflowModel);

        ////////////////////////////////////////////////////////////////////////////
        //SET UP WORKFLOW ACTIONS
        if (actionModel != null) {
            if (actionModel.StatusId != undefined) {
                //ACTION - ENABLE/DISABLE BUTTONS
                var onStatusChange = function (statusId) {
                    var i;
                    var transition;
                    var currentState = self.Request().StateTag();
                    switch (currentState) {

                        case 'AssignedTo':
                            break;
                        case 'AssignedToController':
                            for (i = 0; i < workflowModel.AvailableTransitions().length; i++) {
                                transition = workflowModel.AvailableTransitions()[i];

                                if (transition.TAG() == 'GoBack') {
                                    if (statusId == 0) {
                                        transition.Enabled(false);
                                    } else {
                                        transition.Enabled(true);
                                    }
                                }
                            }
                            break;
                        case 'AssignedToHead':
                            for (i = 0; i < workflowModel.AvailableTransitions().length; i++) {
                                transition = workflowModel.AvailableTransitions()[i];

                                if (transition.TAG() == 'GoBack') {
                                    if (statusId == 0) {
                                        transition.Enabled(false);
                                    } else {
                                        transition.Enabled(true);
                                    }
                                }
                                else
                                    if (transition.TAG() == 'HeadToInstitutions') {
                                        if (statusId == 1 || statusId == 2) {
                                            transition.Enabled(false);
                                        } else {
                                            transition.Enabled(true);
                                        }
                                    }
                            }
                            break;
                        case 'Institutions':

                            break;
                        case 'InstitutionToController':
                            for (i = 0; i < workflowModel.AvailableTransitions().length; i++) {
                                transition = workflowModel.AvailableTransitions()[i];

                                if (transition.TAG() == 'GoBack') {
                                    if (statusId == 0) {
                                        transition.Enabled(false);
                                    } else {
                                        transition.Enabled(true);
                                    }
                                }
                            }
                            break;
                        case 'InstitutionToHead':
                            for (i = 0; i < workflowModel.AvailableTransitions().length; i++) {
                                transition = workflowModel.AvailableTransitions()[i];

                                if (transition.TAG() == 'GoBack') {
                                    if (statusId == 0) {
                                        transition.Enabled(false);
                                    } else {
                                        transition.Enabled(true);
                                    }
                                }
                                else
                                    if (transition.TAG() == 'HeadToFinance') {
                                        if (statusId == 1) {
                                            transition.Enabled(false);
                                        } else {
                                            transition.Enabled(true);
                                        }
                                    }
                            }
                            break;
                        case 'Finance2':
                            break;
                        case 'OfficerApprove':
                            break;
                        case 'ControllorApprove':
                            for (i = 0; i < workflowModel.AvailableTransitions().length; i++) {
                                transition = workflowModel.AvailableTransitions()[i];

                                if (transition.TAG() == 'GoBack') {
                                    if (statusId == 0) {
                                        transition.Enabled(false);
                                    } else {
                                        transition.Enabled(true);
                                    }
                                }
                            }
                            break;
                        case 'HeadApprove':
                            for (i = 0; i < workflowModel.AvailableTransitions().length; i++) {
                                transition = workflowModel.AvailableTransitions()[i];

                                if (transition.TAG() == 'GoBack') {
                                    if (statusId == 0) {
                                        transition.Enabled(false);
                                    } else {
                                        transition.Enabled(true);
                                    }
                                }
                                else
                                    if (transition.TAG() == 'MajorApproveRequest') {
                                        if (statusId == 1) {
                                            transition.Enabled(false);
                                        } else {
                                            transition.Enabled(true);
                                        }
                                    }
                            }
                            break;

                        case 'MajorApproveRequest':
                            for (i = 0; i < workflowModel.AvailableTransitions().length; i++) {
                                transition = workflowModel.AvailableTransitions()[i];

                                if (transition.TAG() == 'GoBack') {
                                    transition.Enabled(true);
                                }
                                transition.Enabled(true);
                            }
                            break;

                        case 'CanceledMajorApprove':
                            for (i = 0; i < workflowModel.AvailableTransitions().length; i++) {
                                transition = workflowModel.AvailableTransitions()[i];
                                if (transition.TAG() == 'GoBack') {
                                    transition.Enabled(true);
                                }
                            }
                            break;
                        case 'Appeal':
                            break;
                        case 'Effect':
                            break;
                        case 'Withdrawn':
                            for (i = 0; i < workflowModel.AvailableTransitions().length; i++) {
                                transition = workflowModel.AvailableTransitions()[i];
                                if (transition.TAG() == 'GoBack') {
                                    transition.Enabled(true);
                                }


                            }
                            break;
                        default:
                    }
                };

                //ON STATUS CHANGE
                actionModel.StatusId.subscribe(function (newValue) {
                    onStatusChange(newValue);
                });

                //INIT
                onStatusChange(actionModel.StatusId());
            }
        }
        ////////////////////////////////////////////////////////////////////////////

        //ACTIVATE TRANSITIONS
        $(document).bind('on-transition-element-click', function (event, currentTransition) {
            var actionModelName = self.ActionModel().GetActionModelName();
            var actionModelAsJson = ko.toJSON(ClearMappings(self.ActionModel()));
            var isSuccess = NS.Repository.Workflow.ActivateTransition(self.RequestId(), currentTransition.TransitionId(), actionModelName, actionModelAsJson, currentTransition.Signature);
            if (isSuccess) {
                if (currentTransition.SuccessFunction() != null) {
                    eval(currentTransition.SuccessFunction());
                }
            }
        });

        //REQUEST HISTORY
        if (self.canViewHistory()) {
            //Load Request History
            self.LoadHistory();
        }

        //REQUEST DEADLINES && REQUEST 2 USER NOTIFICATION
        if (self.canViewDeadlines()) {
            self.RequestDeadlineModel().Init(self.Request());
            self.Request2UserNotificationModel().Init(self.Request());
        }
    };

    //OLD VALUES
    self.MunicipalityId = ko.observable(); //treba za RE-ASSIGN 
    self.ConstructionTypeId = ko.observable();

    self.canReAssignRequest = ko.computed(function () {

        if (window.currentUser.isRakovoditel() && self.Request().StateTag() == 'Archived' && self.Request().ConstructionTypeId() == '2') {
            return true;
        }

        return false;
    });

    self.ReAssignRequest = function () {
        NS.Controls.Dialog.confirmDialog(languagePack['Scripts.app.widgets.confirmDialog.Confirm'], languagePack['Scripts.app.viewmodels.RequestDetailsViewModel.js.PotvrdaZaPremestuvanjeNaPredmet'], // 'Дали сте сигурни дека сакате да го префрлите предметот на избраната општина?'
            function () {
                //signature
                var signature = null;
                //OPEN  SELECT CERTIFICATE DIALOG
                var widgetHolder = $.createWidgetHolder();
                $(widgetHolder).SelectCertificateWidget({});

                NS.Controls.Dialog.getBlockUI();

                //SELECT THE CERTIFICATE 
                $(widgetHolder).SelectCertificateWidget("load", function (selectedCert) {
                    //GET SELECTED CERTIFICATE
                    var thumbPrint = selectedCert.Thumbprint();
                    //GET THE XML FOR SIGNIGN
                    var xmlDocument = NS.Repository.Request.GetRequestForSigning(self.RequestId());
                    //SIGN
                    $(widgetHolder).SelectCertificateWidget("signDocument", thumbPrint, xmlDocument, function (signedDoc) {
                        //NS.Controls.Dialog.getBlockUI();
                        var isSuccess = NS.Repository.PublicRequest.SignRequest(self.RequestId(), signedDoc);
                        if (isSuccess) {
                            signature = signedDoc;
                            $.unblockUI();

                            var done = NS.Repository.Request.ReAssignRequest(self.RequestId(), self.Request().ConstructionTypeId(), self.Request().MunicipalityId(), signature, _ctx);
                            if (done)
                                window.location.href = baseUrl + 'Admin/Requests/';
                        }
                    });
                });
            });
    };

    self.DeleteDocument = function (item) {
        NS.Controls.Dialog.confirmDialog(languagePack['Scripts.app.widgets.confirmDialog.Confirm'], languagePack['Scripts.app.viewmodels.RequestDetailsViewModel.js.PotvrdaZaBrisenjeDokument'],//'Дали сте сигурни дека сакате да го избришете документот?'
            function () {
                var isSuccess = NS.Repository.Request.DeleteDocumentFromRequest(self.RequestId(), item.RequestDocumentId(), _ctx);
                if (isSuccess) {
                    self.LoadDocuments();
                }
            });
    };

    self.LoadRequestDetails = function () {

        var data = NS.Repository.Request.GetRequestById(self.RequestId());
        if (!!data) {
            var item = new NS.ViewModels.RequestViewModel();
            item.mapFromJson(data);

            self.Request(item);

            self.ConstructionTypeId(self.Request().ConstructionTypeId());
        }
    };

    self.LoadRequestMunicipalities = function () {
        var data5 = NS.Repository.Request.GetRequestMunicipalities(self.RequestId());
        if (!!data5) {
            for (var i = 0; i < data5.length; i++) {

                var rm = new NS.ViewModels.RequestMunicipalityViewModel();
                rm.MunicipalityId(data5[i].MunicipalityId);
                rm.MunicipalityName(data5[i].MunicipalityName);

                for (var j = 0; j < data5[i].SelectedCadastreMunicipalities.length; j++) {
                    var idata = data5[i].SelectedCadastreMunicipalities[j];

                    var cm = new NS.ViewModels.RequestMunicipalityCadastreMunicipalityViewModel();
                    cm.MunicipalityId(idata.MunicipalityId);
                    cm.CadastreMunicipalityId(idata.CadastreMunicipalityId);
                    cm.CadastreMunicipalityName(idata.CadastreMunicipalityName);
                    cm.CadastreParcel(idata.CadastreParcel);
                    rm.CadastreMunicipalities.push(cm);
                }

                self.RequestMunicipalities.push(rm);
            }
        }
    };

    self.LoadHistory = function () {
        var data2 = NS.Repository.Request.GetRequestHistory(self.RequestId());
        if (!!data2) {
            self.RequestHistory.removeAll();
            for (var i = 0; i < data2.length; i++) {
                var item2 = new NS.ViewModels.RequestHistoryModel();
                item2.mapFromJson(data2[i]);
                self.RequestHistory.push(item2);
            }
        }
    };

    self.LoadDocuments = function () {
        var data4 = NS.Repository.Request.GetRequestDocumentsByRequestId(self.RequestId());
        self.ProcessDocuments.removeAll();
        self.SubmittedDocuments.removeAll();
        self.AdditionalDocuments.removeAll();
        if (!!data4) {

            var docData;
            var i;
            var item4;

            for (i = 0; i < data4.SubmittedDocuments.length; i++) {
                docData = data4.SubmittedDocuments[i];
                item4 = new NS.ViewModels.RequestDocumentViewModel(self.RequestId());
                item4.mapFromJson(docData);
                self.SubmittedDocuments.push(item4);
            }

            for (i = 0; i < data4.ProcessDocuments.length; i++) {
                docData = data4.ProcessDocuments[i];
                item4 = new NS.ViewModels.RequestDocumentViewModel(self.RequestId());
                item4.mapFromJson(docData);
                self.ProcessDocuments.push(item4);
            }

            for (i = 0; i < data4.AdditionalDocuments.length; i++) {
                docData = data4.AdditionalDocuments[i];
                item4 = new NS.ViewModels.RequestDocumentViewModel(self.RequestId());
                item4.mapFromJson(docData);
                self.AdditionalDocuments.push(item4);
            }
        }
    };

    self.LoadInvestors = function () {
        var data3 = NS.Repository.Request.GetRequestInvesotrs(self.RequestId());
        if (!!data3) {
            for (var i = 0; i < data3.length; i++) {
                var item3 = new NS.ViewModels.RequestInvestorViewModel();
                item3.mapFromJson(data3[i]);
                self.RequestInvestors.push(item3);
            }
        }
    };

    self.Reload = function () {
        self.LoadRequestDetails();
        self.LoadHistory();
        self.LoadDocuments();
    };

    //////////////////////////////////////////////////////////////////////
    self.isReadOnly = function () {
        if (window.currentUser.isMTVSupervisor()) {
            return false;
        }
        return false;
    };

    self.canViewHistory = ko.computed(function () {
        if (window.currentUser.isExternal()) {
            return false;
        }
        return true;
    });

    self.canViewDeadlines = ko.computed(function () {
        if (window.currentUser.isRakovoditel()
            || window.currentUser.isGradonacalnik()
            || window.currentUser.isMinister()
            || window.currentUser.isDirektor()) {
            return true;
        }
        return false;
    });

    self.canViewAction = ko.computed(function () {
        if (self.isReadOnly()) {
            return false;
        }
        return true;
    });

    self.canModifyDocument = function ($data) {
        if (self.isReadOnly()) {
            return false;
        }
        return $data.IsAllowedToModify();
    };

    //da prikaci dokument finansii od opstinata
    self.canUploadDocument = function ($data) {
        if (window.currentUser.isFinansii()
             && $data.Request().StateTag() == "Finance") {
            return true;
        }
        else if (window.currentUser.isExternal() && $data.Request().StateTag() == "Institutions") {
            return true;
        } else {
            return false;
        }
    };

    self.canDefineUtilityMunicipality = function ($data) {
        var data = NS.Repository.Request.GetRequestMunicipalities($data.Request().RequestId());
        for (var i = 0; i < data.length; i++) {
            if (data[i].ParentInstitutionName != null)
                return true;
        }
        return false;
    };

    //////////////////////////////////////////////////////////////////////
    self.IgnoreMappings = {
        both: [
            "_ctx",
            "IgnoreMappings",
            "RequestHistory",
            "AvailableMunicipalities",
            "RequestInvestors",
            "RequestDocuments",
            "canReAssignRequest",
            "WorkflowModel",
            "RequestDeadlineModel",
            "Request2UserNotificationModel",
            "canViewHistory"
        ],
        dirty: [

        ],
        json: [

        ]
    };

    self.setContext = function (ctx) {
        _ctx = ctx;
    };
};

