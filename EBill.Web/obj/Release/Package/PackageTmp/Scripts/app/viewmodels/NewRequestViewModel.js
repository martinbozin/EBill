
///////////////////////////////////////////////////////////////////////////////////////
//ovoj model e strino za tuka  za kreiranje na BARANJE
// ne se koristi za prikaz na opstinite
NS.ViewModels.RequestMunicipality = function () {
    var self = this;

    var request;
    self.Init = function (rqst) {
        request = rqst;
    };

    self.MunicipalityId = ko.observable(undefined)
                                        .extend({
                                            required: true
                                        });

    self.MunicipalityId.subscribe(function (newValue) {
        if (newValue == null)
            return;

        if (request == undefined)
            return;

        //Proverka za duplikat opstina
        var foundNum = 0;
        var len = request.RequestMunicipalities().length;
        if (len > 0) {
            var rm;
            for (var i = 0; i < len; i++) {
                rm = request.RequestMunicipalities()[i];
                if (rm.MunicipalityId() == newValue) {
                    foundNum++;
                }
            }
            if (foundNum > 1) {
                rm = request.RequestMunicipalities()[len - 1];
                rm.MunicipalityId(null);
                return;
            }
        }
        
        //Od koga ke se izbere opstina potrebno e da se 
        //napolnat site dostapni katastarski opstini za istata
        self.AvailableCadastreMunicipalities([]);
        self.SelectedCadastreMunicipalities([]);
        var cadastreMunicipalities = NS.Repository.Lookups.GetCadastreMunicipalities(newValue);
        self.AvailableCadastreMunicipalities(cadastreMunicipalities);

        var item = new NS.ViewModels.RequestMunicipalityCadastreMunicipality();
        item.Init(self);
        item.MunicipalityId(self.MunicipalityId());
        self.SelectedCadastreMunicipalities.push(item);
    });

    self.AvailableCadastreMunicipalities = ko.observableArray([]);
    self.SelectedCadastreMunicipalities = ko.observableArray([]);

    //////////////////////////////////////////////////////////////////////
    self.addCadastreMunicipality = function () {
        var item = new NS.ViewModels.RequestMunicipalityCadastreMunicipality();
        item.Init(self);
        item.MunicipalityId(self.MunicipalityId());
        self.SelectedCadastreMunicipalities.push(item);
    };

    self.removeCadastreMunicipality = function (item) {
        NS.Controls.Dialog.confirmDialog("Потврда...", "Дали сте сигурни дека сакате да го отстраните катастарската општина?", function () {
            self.SelectedCadastreMunicipalities.remove(item);
        });
    };

    self.canAddCadastreMunicipality = ko.computed(function () {
        for (var i = 0; i < self.SelectedCadastreMunicipalities().length; i++) {
            var item = self.SelectedCadastreMunicipalities()[i];
            if (item.CadastreMunicipalityId() == undefined || item.CadastreParcel() == undefined) {
                return false;
            }
        }
        return true;
    });
    //////////////////////////////////////////////////////////////////////
};

NS.ViewModels.RequestMunicipalityCadastreMunicipality = function () {
    var self = this;

    self.MunicipalityId = ko.observable()
        .extend({
            required: true
        });

    self.CadastreMunicipalityId = ko.observable(undefined)
        .extend({
            required: true
        });

    self.CadastreParcel = ko.observable()
        .extend({
            required: true,
            maxLength: 500,
        });

    ////////////////////////////////////////////////////////////////////////////////////
    var requestMunicipality;
    self.Init = function (rm) {
        requestMunicipality = rm;
    };

    self.CadastreMunicipalityId.subscribe(function (newValue) {
        if (requestMunicipality != undefined) {
            var foundNum = 0;
            var len = requestMunicipality.SelectedCadastreMunicipalities().length;
            if (len > 0) {
                var cm;
                for (var i = 0; i < len; i++) {
                    cm = requestMunicipality.SelectedCadastreMunicipalities()[i];
                    if (cm.CadastreMunicipalityId() == newValue) {
                        foundNum++;
                    }
                }
                if (foundNum > 1) {
                    cm = requestMunicipality.SelectedCadastreMunicipalities()[len - 1];
                    cm.CadastreMunicipalityId(null);
                }
            }
        }
    });
    ////////////////////////////////////////////////////////////////////////////////////

};
///////////////////////////////////////////////////////////////////////////////////////
NS.ViewModels.UploadDocumentViewModel = function () {
    var self = this;

    self.FileInputElement = ko.observable();
    self.FileName = ko.observable(null).extend({
        required: true
    });

    self.UploadStarted = ko.observable(false);

    self.UploadSuccess = ko.observable(false);
    self.UploadFailed = ko.observable(false);
    self.UploadFailedMessage = ko.observable(null);

    self.canRemoveDocument = ko.computed(function () {
        if (self.UploadSuccess()) {
            //|| self.UploadFailed()) {
            return false;
        }
        return true;
    });
};

NS.ViewModels.NewRequestAttachDocumentViewModel = function () {
    var self = this;
    var _ctx = null;

    self.RequestId = ko.observable();
    self.DocumentType = ko.observable();
    self.Comment = ko.observable().extend({
        maxLength: 500
    });

    self.Documents = ko.observableArray([]);
    self.Documents.subscribe(function (newValue) {
        self.PrepareDocumentsForUpload();
    });
    self.DocumentsForUpload = ko.observableArray([]);

    self.Init = function (requestId, docType) {
        self.RequestId(requestId);
        self.DocumentType(docType);
    };

    self.PrepareDocumentsForUpload = function () {
        self.DocumentsForUpload.removeAll();
        for (var i = 0; i < self.Documents().length; i++) {
            var doc = self.Documents()[i];
            if (doc.UploadSuccess() == false && doc.UploadFailed() == false) {
                if ($('#' + doc.FileInputElement()).val().length > 0) {
                    self.DocumentsForUpload.push(doc);
                }
            }
        }
    };

    self.ResetForm = function () {
        self.Comment(null);
    };

    self.removeDocument = function (item) {
        $('#' + item.FileInputElement()).remove();
        self.Documents.remove(item);
    };

    self.canSubmitDocuments = ko.computed(function () {
        return self.DocumentsForUpload().length > 0;
    });

    self.setContext = function (ctx) {
        _ctx = ctx;
    };

    self.IgnoreMappings = {
        both: [
            "IgnoreMappings"
        ],
        dirty: [],
        json: []
    };
};

NS.ViewModels.NewRequestDefineAttributesViewModel = function () {
    var self = this;
    var _ctx = null;

    self.RequestId = ko.observable();
    self.DocumentType = ko.observable();

    self.Attributes = ko.observableArray();

    self.Init = function (requestId, docType) {

        self.RequestId(requestId);
        self.DocumentType(docType);

        var data = NS.Repository.PublicRequest.GetDocumentsAtrributesForRequestAndDocumentType(self.RequestId(), self.DocumentType().DocumentTypeId());
        if (!!data) {
            for (var i = 0; i < data.length; i++) {
                var item = new NS.ViewModels.RequestDocumentAttributeViewModel();
                item.mapFromJson(data[i]);
                item.setupValidationRules();
                self.Attributes.push(item);
            }
        }
    };

    self.setContext = function (ctx) {
        _ctx = ctx;
    };

    self.IgnoreMappings = {
        both: [
            "IgnoreMappings"
        ],
        dirty: [],
        json: []
    };
};

NS.ViewModels.NewRequestViewModel = function () {
    var self = this;
    var _ctx = null;

    self.RequestId = ko.observable();
    self.RequestTypeId = ko.observable();
    self.ConstructionTypeId = ko.observable(2);
    self.ConstructionDescription = ko.observable();
    self.ConstructionAddress = ko.observable();

    self.ContactPerson = ko.observable();
    self.Email = ko.observable();
    self.Mobile = ko.observable();
    self.Phone = ko.observable();
    self.SMSNotifications = ko.observable(false);

    self.EnableSMSNotifications = ko.observable(false);
    self.Mobile.subscribe(function (newValue) {
        if (newValue != undefined && newValue.length > 0) {
            self.EnableSMSNotifications(true);
        } else {
            self.SMSNotifications(false);
            self.EnableSMSNotifications(false);
        }
    });

    self.Agree = ko.observable(false);

    self.Investors = ko.observableArray();
    self.RequestMunicipalities = ko.observableArray();
    self.AvailableRequestTypes = ko.observableArray();
    self.AvailableMunicipalities = ko.observableArray();
    self.TypeOfDocuments = ko.observableArray();

    self.RequestDocuments = ko.observableArray();
    self.RequestAttributes = ko.observableArray();
    self.RequestTypeDetails = ko.observable(new NS.ViewModels.RequestTypeViewModel());

    self.Init = function () {
        self.AvailableRequestTypes(NS.Repository.Lookups.GetAllAvalibleRequestsTypes());
        self.AvailableMunicipalities(NS.Repository.Lookups.GetAllMunicipalities());
        self.Investors.push(new NS.ViewModels.RequestInvestorViewModel());

        var item = new NS.ViewModels.RequestMunicipality();
        item.Init(self);
        self.RequestMunicipalities.push(item);
    };

    self.IsInEditMode = ko.observable(false);
    self.Edit = function (requestId) {
        self.RequestId(requestId);
        self.IsInEditMode(true);

        self.AvailableRequestTypes(NS.Repository.Lookups.GetAllAvalibleRequestsTypes());
        self.AvailableMunicipalities(NS.Repository.Lookups.GetAllMunicipalities());

        //Load Request
        var data = NS.Repository.Request.GetRequestById(requestId);
        if (!!data) {

            self.ConstructionTypeId(data.ConstructionTypeId);
            self.ConstructionDescription(data.ConstructionDescription);
            self.ConstructionAddress(data.ConstructionAddress);

            self.ContactPerson(data.ContactPerson);
            self.Email(data.Email);
            self.Mobile(data.Mobile);
            self.Phone(data.Phone);
            self.SMSNotifications(data.SMS);
        }

        //Load Investors
        var data3 = NS.Repository.Request.GetRequestInvesotrs(requestId);
        var i;
        if (!!data3) {
            for (i = 0; i < data3.length; i++) {
                var item3 = new NS.ViewModels.RequestInvestorViewModel();
                item3.mapFromJson(data3[i]);
                self.Investors.push(item3);
            }
        }

        //Load Request Municipalities
        self.RequestMunicipalities.removeAll();
        var data5 = NS.Repository.Request.GetRequestMunicipalities(requestId);
        if (!!data5) {
            for (i = 0; i < data5.length; i++) {

                var rm = new NS.ViewModels.RequestMunicipality();
                rm.Init(self);
                rm.MunicipalityId(data5[i].MunicipalityId);

                rm.SelectedCadastreMunicipalities.removeAll();

                for (var j = 0; j < data5[i].SelectedCadastreMunicipalities.length; j++) {
                    var idata = data5[i].SelectedCadastreMunicipalities[j];

                    var cm = new NS.ViewModels.RequestMunicipalityCadastreMunicipality();
                    cm.Init(rm);
                    cm.MunicipalityId(idata.MunicipalityId);
                    cm.CadastreMunicipalityId(idata.CadastreMunicipalityId);
                    cm.CadastreParcel(idata.CadastreParcel);
                    rm.SelectedCadastreMunicipalities.push(cm);
                }

                self.RequestMunicipalities.push(rm);
            }
        }

        //Tipot na Baranjeto go postavuvame na kraj za da se sredi momentot na popolnuvanje na potrebnite dokumenti pri EDIT
        self.RequestTypeId(data.RequestTypeId);
    };

    self.RequestTypeId.subscribe(function (newValue) {
        var data = NS.Repository.Lookups.GetRequestTypeDetails(newValue);
        if (!!data) {
            var requestTypeViewModel = new NS.ViewModels.RequestTypeViewModel();

            requestTypeViewModel.mapFromJson(data);
            self.RequestTypeDetails(requestTypeViewModel);
            self.LoadRequestDocuments();
            self.LoadRequestAttributes();
        }
    });

    ////////////////////////////////////////////////////////////////////////
    self.LoadRequestAttributes = function () {
        self.RequestAttributes.removeAll();
        if (self.RequestId() != undefined) {
            var data = NS.Repository.PublicRequest.GetDocumentsAtrributesForRequest(self.RequestId());
            if (!!data) {
                for (var i = 0; i < data.length; i++) {
                    var item = new NS.ViewModels.RequestDocumentAttributeViewModel(self.RequestId());
                    item.mapFromJson(data[i]);
                    self.RequestAttributes.push(item);
                }
            }
        }
    };

    self.GetAttributesForType = function (docTypeId) {
        var attrs = [];
        for (var i = 0; i < self.RequestAttributes().length; i++) {
            var item = self.RequestAttributes()[i];
            if (item.DocumentTypeId() == docTypeId) {
                attrs.push(item);
            }
        }

        if (attrs.length == 0) {
            var j;
            var doc;
            for (j = 0; j < self.RequestTypeDetails().RequiredDocuments().length; j++) {
                doc = self.RequestTypeDetails().RequiredDocuments()[j];
                if (doc.DocumentTypeId() == docTypeId) {
                    attrs = doc.Attributes();
                    return attrs;
                }
            }
            for (j = 0; j < self.RequestTypeDetails().AdditionalDocuments().length; j++) {
                doc = self.RequestTypeDetails().AdditionalDocuments()[j];
                if (doc.DocumentTypeId() == docTypeId) {
                    attrs = doc.Attributes();
                    return attrs;
                }
            }
        }

        return attrs;
    };

    ////////////////////////////////////////////////////////////////////////
    self.LoadRequestDocuments = function () {
 
        self.RequestDocuments.removeAll();
        if (self.RequestId() != undefined) {
            var data = NS.Repository.PublicRequest.GetRequestDocumentsByRequestId(self.RequestId());
            if (!!data) {
                var item;
                var i;
                for (i = 0; i < data.SubmittedDocuments.length; i++) {
                    item = new NS.ViewModels.RequestDocumentViewModel(self.RequestId());
                    item.mapFromJson(data.SubmittedDocuments[i]);
                    self.RequestDocuments.push(item);
                }

                for (i = 0; i < data.AdditionalDocuments.length; i++) {
                    item = new NS.ViewModels.RequestDocumentViewModel(self.RequestId());
                    item.mapFromJson(data.AdditionalDocuments[i]);
                    self.RequestDocuments.push(item);
                }

                for (i = 0; i < data.ProcessDocuments.length; i++) {
                    item = new NS.ViewModels.RequestDocumentViewModel(self.RequestId());
                    item.mapFromJson(data.ProcessDocuments[i]);
                    self.RequestDocuments.push(item);
                }
            }
        }
    };

    self.GetDocumentsForType = function (docTypeId) {
        var res = [];
        for (var i = 0; i < self.RequestDocuments().length; i++) {
            var item = self.RequestDocuments()[i];
            if (item.DocumentTypeId() == docTypeId) {
                res.push(item);
            }
        }
        return res;
    };

    self.removeDraftDocument = function ($data) {
        
        NS.Controls.Dialog.confirmDialog(languagePack['Scripts.app.widgets.confirmDialog.Confirm'],//"Потврда...",
            languagePack['Scripts.app.viewmodels.NewRequestViewModel.js.OstranuvanjeDokumenti'],//"Дали сте сигурни дека сакате да го отстраните документот?"
            function () {
            var requestId = self.RequestId();
            var requestDocumentId = $data.RequestDocumentId();
            var data = NS.Repository.PublicRequest.RemoveDraftDocument(requestId, requestDocumentId);
            if (!!data) {
                self.LoadRequestDocuments();
            }
        });
    };
    ////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////
    ///OPSTINI i PARCELI
    self.ConstructionTypeId.subscribe(function (newValue) {
        if (newValue == undefined || newValue == null)
            return;

        if (newValue != '3') {
            //За сите други типови на градба - сите општини се можни 
            self.AvailableMunicipalities.removeAll();
            self.AvailableMunicipalities(NS.Repository.Lookups.GetAllMunicipalities());
        }
        else {
            //Градби во надлежност на Град Скопје
            //треба да се излистаат само општините во Град Скопје
            self.AvailableMunicipalities.removeAll();
            var munipalitiesFromSkopje = NS.Repository.Lookups.GetAllMunicipalitiesFromSkopje();
            self.AvailableMunicipalities(munipalitiesFromSkopje);
        }

        self.RequestMunicipalities.removeAll();
        self.addRequestMunicipality();
    });

    self.addRequestMunicipality = function () {
        var item = new NS.ViewModels.RequestMunicipality();
        item.Init(self);
        self.RequestMunicipalities.push(item);

        //re setup validation
        NS.Validators.NewRequestViewModelValidator.SetUpStep1ValidationRules(self);
    };

    self.removeRequestMunicipality = function (item) {
        self.RequestMunicipalities.remove(item);

        //re setup validation
        NS.Validators.NewRequestViewModelValidator.SetUpStep1ValidationRules(self);
    };

    self.canAddRequestMunicipality = ko.computed(function () {
        if (self.ConstructionTypeId() == '1' || self.ConstructionTypeId() == '3') {
            return true;
        }
        return false;
    });

    self.enableAddRequestMunicipality = ko.computed(function () {
        if (self.ConstructionTypeId() == '1' || self.ConstructionTypeId() == '3') {
            for (var i = 0; i < self.RequestMunicipalities().length; i++) {
                var item = self.RequestMunicipalities()[i];
                if (item.MunicipalityId() == undefined) {
                    return false;
                }

                for (var j = 0; j < item.SelectedCadastreMunicipalities().length; j++) {
                    var cm = item.SelectedCadastreMunicipalities()[j];
                    if (cm.CadastreMunicipalityId() == undefined || cm.CadastreParcel() == undefined) {
                        return false;
                    }
                }
            }
            return true;
        }
        return false;
    });

    /////////////////////////////////////////////////////////////////
    self.canAddInvestor = ko.computed(function () {
        if (self.Investors().length > 100) {
            return false;
        }

        for (var i = 0; i < self.Investors().length; i++) {
            var item = self.Investors()[i];
            if ((item.InvestorName() == '' || item.InvestorName() == undefined) || (item.Address() == '' || item.Address() == undefined)) {
                return false;
            }
        }

        return true;
    });

    self.removeInvestor = function (item) {
        if (NS.Controls.Dialog.confirmDialog(
            languagePack['Scripts.app.widgets.confirmDialog.Confirm'],
            languagePack['Scripts.app.viewmodels.NewRequestViewModel.js.OstranuvanjeInvestitor'],
            //"Дали сте сигурни дека сакате да го отстраните инвеститорот ?"
            function () {
                self.Investors.remove(item);

            //re setup validation
            NS.Validators.NewRequestViewModelValidator.SetUpStep1ValidationRules(self);
        }));
    };

    self.addInvestor = function () {
        var item = new NS.ViewModels.RequestInvestorViewModel();
        self.Investors.push(item);

        //re setup validation
        NS.Validators.NewRequestViewModelValidator.SetUpStep1ValidationRules(self);
    };
    /////////////////////////////////////////////////////////////////
    //WIZARD
    self.currentWizardStep = ko.observable(1);

    self.prevButtonClick = function () {
        self.currentWizardStep(self.currentWizardStep() - 1);
    };

    self.showPreviuosButton = ko.computed(function () {
        if (self.currentWizardStep() == 1)
            return false;
        return true;
    });
    /////////////////////////////////////////////////////////////////

    self.setContext = function (ctx) {
        _ctx = ctx;
    };

    self.IgnoreMappings = {
        both: [
            "IgnoreMappings",
            "RequiredDocuments",
            "AvailableMunicipalities",
            "AvailableRequestTypes",
            "RequestDocuments",
            "canAddInvestor",
            "showPreviuosButton",
            "enableAddDocumentButton",
            "currentWizardStep",
            "IsInEditMode",
            "RequestTypeDetails",
            "canAddRequestMunicipality",
            "enableAddRequestMunicipality",
            "step1Errors",
            "step2Errors",
            "step3Errors",
            "step4Errors"
        ],
        dirty: [],
        json: []
    };
};

NS.Validators.NewRequestViewModelValidator = function () {
    this.setupValidationRules = function (instance) {
        NS.Validators.SetupValidationSettings();

        NS.Validators.NewRequestViewModelValidator.SetUpStep1ValidationRules(instance);
        NS.Validators.NewRequestViewModelValidator.SetUpStep2ValidationRules(instance);
        NS.Validators.NewRequestViewModelValidator.SetUpStep3ValidationRules(instance);
        NS.Validators.NewRequestViewModelValidator.SetUpStep4ValidationRules(instance);
    };
};

///////////////////////////////////////////////////////////////////////////
//STEP 1
NS.Validators.NewRequestViewModelValidator.SetUpStep1ValidationRules = function (instance) {
    instance.ConstructionDescription.extend({
        required: true,
        maxLength: 500
    });

    instance.ConstructionAddress.extend({
        required: true,
        maxLength: 500
    });

    //////////////////////////////////////////////////////////////////////////////////////
    ko.validation.rules['minInvestors'] = {
        validator: function (val, otherVal) {
            if (val.length == 0) {
                return false;
            }
            if (val.length < otherVal) {
                return false;
            }
            var item = val[0];
            if (item.InvestorName() == '' || item.InvestorName() == undefined || item.Address() == '' || item.Address() == undefined) {
                return false;
            }
            return true;
        },
        message: languagePack['Scripts.app.viewmodels.NewRequestViewModel.js.MinimumDefiniranjeInvestitori']//'Морате да дeфинирате минимум {0} инвеститор.'
    };
    ko.validation.registerExtenders();

    instance.Investors.extend({
        minInvestors: 1
    });
    //////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////////////////
    ko.validation.rules['minRequestMunicipalities'] = {
        validator: function (val, otherVal) {
            if (val.length == 0) {
                return false;
            }

            if (val.length < otherVal) {
                return false;
            }

            var item = val[0];

            if (item.MunicipalityId() == undefined) {
                return false;
            }

            for (var i = 0; i < item.SelectedCadastreMunicipalities().length; i++) {
                var cm = item.SelectedCadastreMunicipalities()[i];
                if (cm.CadastreMunicipalityId() == undefined || cm.CadastreParcel() == undefined) {
                    return false;
                }
            }

            return true;
        },
        message: languagePack['Scripts.app.viewmodels.NewRequestViewModel.js.MinimumDefiniranjeKoKp']//'Морате да дeфинирате општина, катастарска општина и парцела.'
    };
    ko.validation.registerExtenders();

    instance.RequestMunicipalities.extend({
        minRequestMunicipalities: 1
    });
    //////////////////////////////////////////////////////////////////////////////////////

    instance.step1Errors = ko.validation.group({
        ConstructionDescription: instance.ConstructionDescription,
        ConstructionAddress: instance.ConstructionAddress,
        Investors: instance.Investors,
        RequestMunicipalities: instance.RequestMunicipalities,
    }, {
        deep: true
    });
};
///////////////////////////////////////////////////////////////////////////   

///////////////////////////////////////////////////////////////////////////
//STEP 2
NS.Validators.NewRequestViewModelValidator.SetUpStep2ValidationRules = function (instance) {
    instance.ContactPerson.extend({
        required: true,
        maxLength: 50
    });

    instance.Email.extend({
        required: true,
        email: true,
        maxLength: 50
    });

    instance.Mobile.extend({
        maxLength: 50,
        pattern: {
            message: languagePack['Scripts.app.viewmodels.NewRequestViewModel.js.NevalidenBroj'],//'Невалиден број.',
            params: /^(\+)[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]/
        }
    });

    instance.Phone.extend({
        maxLength: 50,
        number: true
    });

    instance.step2Errors = ko.validation.group({
        ContactPerson: instance.ContactPerson,
        Email: instance.Email,
        Mobile: instance.Mobile,
        Phone: instance.Phone
    });
};
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
//STEP 3
NS.Validators.NewRequestViewModelValidator.SetUpStep3ValidationRules = function (instance) {
    //instance.step3Errors = ko.validation.group(instance.selectedDocuments(), { deep: true });
};
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
//STEP 4 
NS.Validators.NewRequestViewModelValidator.SetUpStep4ValidationRules = function (instance) {
    instance.Agree.extend({
        checked: {
            message: languagePack['Scripts.app.viewmodels.NewRequestViewModel.js.Soglasnost']//'Се согласувам е задолжително поле'
        }
    });

    instance.step4Errors = ko.validation.group({
        Agree: instance.Agree
    });
};
