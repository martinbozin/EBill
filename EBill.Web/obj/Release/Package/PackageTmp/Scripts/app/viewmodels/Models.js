NS.ViewModels.LookupViewModel = function () {
    var self = this;
    self.Text = ko.observable();
    self.Value = ko.observable();

    self.MapFromDataRow = function (data) {
        self.Text(data.Text);
        self.Value(data.Value);
    };
};

NS.ViewModels.RoleViewModel = function () {
    var self = this;
    self.RoleId = ko.observable();
    self.RoleName = ko.observable();
    self.RoleNameTrans = ko.observable();

    self.MapFromDataRow = function (data) {
        self.RoleId(data.RoleId);
        self.RoleName(data.RoleName);
        self.RoleNameTrans(data.RoleNameTrans);
    };
};

NS.ViewModels.UserViewModel = function () {
    var self = this;
    self.Id = ko.observable();
    self.UserName = ko.observable();
    self.FirstName = ko.observable();
    self.LastName = ko.observable();
    self.InstitutionId = ko.observable();
    self.Roles = ko.observableArray();
    self.Roles = ko.observableArray();
    self.InstitutionTag = ko.observableArray();

    self.isArchiver = function () {
        for (var i = 0; i < this.Roles().length; i++) {
            var role = this.Roles()[i];
            if (role.RoleName == 'Archiver') {
                return true;
            }
        }
        return false;
    };

    self.isRakovoditel = function () {
        for (var i = 0; i < this.Roles().length; i++) {
            var role = this.Roles()[i];
            if (role.RoleName == 'Rakovoditel') {
                return true;
            }
        }
        return false;
    };

    self.isSluzbenik = function () {
        for (var i = 0; i < this.Roles().length; i++) {
            var role = this.Roles()[i];
            if (role.RoleName == 'Sluzbenik') {
                return true;
            }
        }
        return false;
    };

    self.isKontrolor = function () {
        for (var i = 0; i < this.Roles().length; i++) {
            var role = this.Roles()[i];
            if (role.RoleName == 'Kontrolor') {
                return true;
            }
        }
        return false;
    };

    self.isFinansii = function () {
        for (var i = 0; i < this.Roles().length; i++) {
            var role = this.Roles()[i];
            if (role.RoleName == 'Finansii') {
                return true;
            }
        }
        return false;
    };

    self.isPotvrduvac = function () {
        for (var i = 0; i < this.Roles().length; i++) {
            var role = this.Roles()[i];
            if (role.RoleName == 'PotvrduvacPlakanje') {
                return true;
            }
        }
        return false;
    };

    self.isGradonacalnik = function () {
        for (var i = 0; i < this.Roles().length; i++) {
            var role = this.Roles()[i];
            if (role.RoleName == 'Gradonacalnik') {
                return true;
            }
        }
        return false;
    };

    self.isMinister = function () {
        for (var i = 0; i < this.Roles().length; i++) {
            var role = this.Roles()[i];
            if (role.RoleName == 'Minister') {
                return true;
            }
        }
        return false;
    };

    self.isDirektor = function () {
        for (var i = 0; i < this.Roles().length; i++) {
            var role = this.Roles()[i];
            if (role.RoleName == 'Direktor') {
                return true;
            }
        }
        return false;
    };

    self.isExternal = function () {
        for (var i = 0; i < this.Roles().length; i++) {
            var role = this.Roles()[i];
            if (role.RoleName == 'ExternalUsers') {
                return true;
            }
        }
        return false;
    };
    self.Inspektor = function () {
        for (var i = 0; i < this.Roles().length; i++) {
            var role = this.Roles()[i];
            if (role.RoleName == 'Inspektor') {
                return true;
            }
        }
        return false;
    };

    self.isMTVSupervisor = function () {
        for (var i = 0; i < this.Roles().length; i++) {
            var role = this.Roles()[i];
            if (role.RoleName == 'MTVSupervisor') {
                return true;
            }
        }
        return false;
    };


    self.isInRole = function (roleName) {
        for (var i = 0; i < this.Roles().length; i++) {
            var role = this.Roles()[i];
            if (role.RoleName == roleName) {
                return true;
            }
        }
        return false;
    };
};

NS.ViewModels.RequestHistoryDocumentModel = function () {
    var self = this;

    self.Id = ko.observable();
    self.DocumentTypeName = ko.observable();
    self.FileName = ko.observable();
    self.Modified = ko.observable();
    self.ModifiedBy = ko.observable();

    self.mapFromJson = function (data) {

        self.Id(data.Id);
        self.DocumentTypeName(data.DocumentTypeName);
        self.FileName(data.FileName);
        if (data.Modified != null) {
            var fromJsonDate1 = NS.Utils.Date.parseDateFromJson(data.Modified);
            var mkDate1 = NS.Utils.Date.toMKString(fromJsonDate1);
            self.Modified(mkDate1);
        }
        self.ModifiedBy(data.ModifiedBy);
    };
};

NS.ViewModels.RequestHistoryModel = function () {
    var self = this;

    self.Id = ko.observable();
    self.Comment = ko.observable();
    self.State = ko.observable();
    self.Modified = ko.observable();
    self.ModifiedBy = ko.observable();
    self.Documents = ko.observableArray();

    self.mapFromJson = function (data) {

        self.Id(data.Id);
        self.Comment(data.Comment);
        self.State(window.languagePack["eDozvoli.Web.States.Name." + data.State + ""]);
        if (data.Modified != null) {
            var fromJsonDate1 = NS.Utils.Date.parseDateFromJson(data.Modified);
            var mkDate1 = NS.Utils.Date.toFullMKString(fromJsonDate1);
            self.Modified(mkDate1);
        }
        self.ModifiedBy(data.ModifiedBy);

        for (var i = 0; i < data.Documents.length; i++) {
            var item = new NS.ViewModels.RequestHistoryDocumentModel();
            item.mapFromJson(data.Documents[i]);
            self.Documents.push(item);
        }
    };
};

NS.ViewModels.RequestViewModel = function () {
    var self = this;

    self.ArchiveNumber = ko.observable();
    self.RequestId = ko.observable();

    self.RequestTypeId = ko.observable();
    self.RequestTypeName = ko.observable();

    self.ConstructionTypeId = ko.observable();
    self.ConstructionTypeName = ko.observable();
    self.ConstructionDescription = ko.observable();
    self.ConstructionAddress = ko.observable();

    self.StateId = ko.observable();
    self.StateTitle = ko.observable();
    self.StateTag = ko.observable();
    self.PublicGroup = ko.observable();

    self.ContactPerson = ko.observable();
    self.Mobile = ko.observable();
    self.Email = ko.observable();
    self.Phone = ko.observable();
    self.SMS = ko.observable();

    self.Created = ko.observable();
    self.Modified = ko.observable();
    self.AssignedTo = ko.observable();

    self.Level1Status = ko.observable();
    self.Level2Status = ko.observable();
    self.Level3Status = ko.observable();
    self.Level4Status = ko.observable();

    self.Utilities = ko.observable();
    self.FreeUtilities = ko.observable();
    self.UtilitySkopje = ko.observable();

    self.mapFromJson = function (data) {

        self.ArchiveNumber(data.ArchiveNumber);
        self.RequestId(data.RequestId);

        self.RequestTypeId(data.RequestTypeId);
        self.RequestTypeName(data.RequestTypeName);

        self.StateId(data.StateId);
        self.StateTitle(window.languagePack["eDozvoli.Web.States.Name." + data.StateTitle + ""]);
        self.StateTag(data.StateTag);
        self.PublicGroup(window.languagePack["eDozvoli.Web.PublicStates.Name." + data.PublicGroup + ""]);

        self.ConstructionTypeId(data.ConstructionTypeId);
        self.ConstructionTypeName(window.languagePack["eDozvoli.Web.ConstructionType.Name." + data.ConstructionTypeName + ""]);
        self.ConstructionDescription(data.ConstructionDescription);
        self.ConstructionAddress(data.ConstructionAddress);

        self.ContactPerson(data.ContactPerson);
        self.Mobile(data.Mobile);
        self.Email(data.Email);
        self.Phone(data.Phone);
        self.SMS(data.SMS);

        if (data.Created != null) {
            var fromJsonDate2 = NS.Utils.Date.parseDateFromJson(data.Created);
            var mkDate2 = NS.Utils.Date.toMKString(fromJsonDate2);
            self.Created(mkDate2);
        }

        if (data.Modified != null) {
            var fromJsonDate1 = NS.Utils.Date.parseDateFromJson(data.Modified);
            var mkDate1 = NS.Utils.Date.toMKString(fromJsonDate1);
            self.Modified(mkDate1);
        }
        self.AssignedTo(data.AssignedTo);

        self.Level1Status(data.Level1Status);
        self.Level2Status(data.Level2Status);
        self.Level3Status(data.Level3Status);
        self.Level4Status(data.Level4Status);

        self.Utilities(data.Utilities);
        self.FreeUtilities(window.languagePack["eDozvoli.Web.Request.FreeUtilities." + data.FreeUtilities + ""]);
        self.UtilitySkopje(data.UtilitySkopje);

    };
};

NS.ViewModels.RequestInvestorViewModel = function () {
    var self = this;
    self.Id = ko.observable();
    self.InvestorName = ko.observable().extend({
        required: true
    });
    self.Address = ko.observable().extend({
        required: true
    });

    self.mapFromJson = function (data) {
        self.Id(data.Id);
        self.InvestorName(data.InvestorName);
        self.Address(data.Address);
    };
};

//se koristi za da se napolnat site institucii koi treba da se izvestat
NS.ViewModels.RequestInstitutionsViewModel = function () {
    var self = this;

    self.Value = ko.observable();
    self.Text = ko.observable();

    self.mapFromJson = function (data) {

        self.Value(data.Value);
        self.Text(data.Text);
    };
};

//Дозволени Типови на Атрибути
///////////////////////////////////////////////////////////////////////////
NS.ViewModels.TypeOfAttribute = function () {
    var self = this;
    self.Type = ko.observable();
    self.Name = ko.observable();
};

function GetAllowedAttributeTypes() {
    var attributes = ko.observableArray([]);

    var attr = new NS.ViewModels.TypeOfAttribute();
    attr.Type('string');
    attr.Name('Текст');
    attributes.push(attr);

    attr = new NS.ViewModels.TypeOfAttribute();
    attr.Type('int');
    attr.Name('Број');
    attributes.push(attr);

    attr = new NS.ViewModels.TypeOfAttribute();
    attr.Type('email');
    attr.Name('Емаил');
    attributes.push(attr);

    attr = new NS.ViewModels.TypeOfAttribute();
    attr.Type('datetime');
    attr.Name('Датум');
    attributes.push(attr);

    return attributes();
};

NS.ViewModels.GetAttributeTypeByTypeName = function (typeName) {
    var attributes = GetAllowedAttributeTypes();
    for (var i = 0; i < attributes.length; i++) {
        var attr = attributes[i];
        if (attr.Type() == typeName) {
            return attr;
        }
    }
    return null;
};
///////////////////////////////////////////////////////////////////////////

//Детали за Тип на Документ
NS.ViewModels.DocumentTypeViewModel = function () {
    var self = this;

    self.DocumentTypeId = ko.observable();
    self.DocumentTypeName = ko.observable();
    self.DocumentTypeDescription = ko.observable();

    self.AllowedExtensions = ko.observable();
    self.Required = ko.observable();

    self.Attributes = ko.observableArray([]);

    self.mapFromJson = function (data) {

        self.DocumentTypeId(data.Id);
        self.DocumentTypeName(data.Name);
        self.DocumentTypeDescription(data.Description);

        self.AllowedExtensions(data.AllowedExtensions);
        self.Required(data.Required);

        var i;
        if (!!data.Attributes) {
            for (i = 0; i < data.Attributes.length; i++) {
                var attrData = data.Attributes[i];
                var item = new NS.ViewModels.RequestDocumentAttributeViewModel();
                item.mapFromJson(attrData);
                self.Attributes.push(item);
            }
        }
    };
};

//Детали за Тип на Барање
NS.ViewModels.RequestTypeViewModel = function () {
    var self = this;

    self.RequestTypeId = ko.observable();
    self.RequestTypeName = ko.observable();
    self.RequestTypeDescription = ko.observable();

    self.RequiredDocuments = ko.observableArray(); //site dokumenti koi se potrebni
    self.AdditionalDocuments = ko.observableArray(); //site dokumenti koi se dopolnitelni
    self.ProcessDocuments = ko.observableArray(); //site dokumenti koi se dopolnitelni

    self.UserDocuments = ko.observableArray();

    self.mapFromJson = function (data) {

        self.RequestTypeId(data.Id);
        self.RequestTypeName(data.Name);

        var i;
        var doc;
        var item;
        for (i = 0; i < data.RequiredDocuments.length; i++) {
            doc = data.RequiredDocuments[i];
            item = new NS.ViewModels.DocumentTypeViewModel();
            item.mapFromJson(doc);
            self.RequiredDocuments.push(item);
            self.UserDocuments.push(item);
        }

        for (i = 0; i < data.AdditionalDocuments.length; i++) {
            doc = data.AdditionalDocuments[i];
            item = new NS.ViewModels.DocumentTypeViewModel();
            item.mapFromJson(doc);
            self.AdditionalDocuments.push(item);
            self.UserDocuments.push(item);
        }

        for (i = 0; i < data.ProcessDocuments.length; i++) {
            doc = data.ProcessDocuments[i];
            item = new NS.ViewModels.DocumentTypeViewModel();
            item.mapFromJson(doc);
            self.ProcessDocuments.push(item);
        }
    };
};

//Атрибути за документ
NS.ViewModels.RequestDocumentAttributeViewModel = function () {
    var self = this;

    self.Id = ko.observable();
    self.DocumentTypeAttributeId = ko.observable();
    self.DocumentTypeAttributeName = ko.observable();
    self.DocumentTypeAttributeDescription = ko.observable();
    self.TypeOfAttribute = ko.observable();
    self.Value = ko.observable();
    self.DocumentTypeId = ko.observable();


    self.mapFromJson = function (data) {
        if (data.DocumentTypeAttributeName != undefined) {
            self.Id(data.Id);
            self.DocumentTypeId(data.DocumentTypeId);
            self.DocumentTypeAttributeId(data.DocumentTypeAttributeId);
            self.DocumentTypeAttributeName(data.DocumentTypeAttributeName);
            self.DocumentTypeAttributeDescription(data.DocumentTypeAttributeDescription);
            self.TypeOfAttribute(data.TypeOfAttribute);
            self.Value(data.Value);
        } else {
            self.Id(data.Id);
            self.DocumentTypeAttributeName(data.Name);
            self.DocumentTypeAttributeDescription(data.Description);
            self.TypeOfAttribute(data.TypeOfAttribute);
            self.Value(data.Value);
        }
    };

    self.setupValidationRules = function () {
        self.Value.extend({
            required: true,
            validation: {
                validator: function (val, para) {
                    var type = self.TypeOfAttribute();
                    if (type != undefined) {
                        switch (type) {
                            case 'int':
                                if (!ko.validation.rules.number.validator(val, true)) {
                                    this.message = ko.validation.rules.number.message;
                                    return false;
                                }
                                break;
                            case 'string':
                                var maxLength = 50;
                                if (!ko.validation.rules.maxLength.validator(val, maxLength)) {
                                    this.message = NS.Utils.String.format(ko.validation.rules.maxLength.message, maxLength);
                                    return false;
                                }
                                break;
                            case 'email':
                                if (!ko.validation.rules.email.validator(val, true)) {
                                    this.message = ko.validation.rules.email.message;
                                    return false;
                                }
                                break;
                        }
                    }
                    return true;
                },
                message: 'Невалидна вредност.'
            }
        });
    };
};

//Документ кој се прикачува за одредено барање
NS.ViewModels.RequestDocumentViewModel = function (requestId) {
    var self = this;

    self.RequestId = ko.observable(requestId);
    self.RequestDocumentId = ko.observable(0);

    self.DocumentTypeId = ko.observable();
    self.DocumentTypeName = ko.observable();

    self.FileName = ko.observable(null);
    self.Comment = ko.observable();

    self.IsDraft = ko.observable();

    self.FileDownloadUrl = ko.computed(function () {
        if (self.RequestDocumentId() > 0) {
            if (self.FileName() != null) {
                return baseUrl + 'SharedRequest/DownloadDocument/?requestId=' + self.RequestId() + '&fileName=' + self.FileName() + '&t=' + new Date().getTime();
            }
        }
        return '';
    });

    self.Created = ko.observable();
    self.CreatedBy = ko.observable();
    self.Modified = ko.observable();
    self.ModifiedBy = ko.observable();

    self.mapFromJson = function (data) {

        self.RequestId(data.RequestId);
        self.RequestDocumentId(data.RequestDocumentId);

        self.DocumentTypeId(data.DocumentTypeId);
        self.DocumentTypeName(data.DocumentTypeName);

        self.IsDraft(data.IsDraft);

        self.Comment(data.Comment);
        self.FileName(data.FileName);

        var fromJsonDate1;
        var mkDate1;
        if (data.Created != null) {
            fromJsonDate1 = NS.Utils.Date.parseDateFromJson(data.Created);
            mkDate1 = NS.Utils.Date.toMKString(fromJsonDate1);
            self.Created(mkDate1);
        }
        self.CreatedBy(data.CreatedBy);

        if (data.Modified != null) {
            fromJsonDate1 = NS.Utils.Date.parseDateFromJson(data.Modified);
            mkDate1 = NS.Utils.Date.toMKString(fromJsonDate1);
            self.Modified(mkDate1);
        }
        self.ModifiedBy(data.ModifiedBy);
    };

    self.IgnoreMappings = {
        both: [
            "IgnoreMappings"
        ],
        dirty: [],
        json: []
    };
};

//Одговори од иснтитуции за предмет
NS.ViewModels.RequestNotificationViewModel = function () {
    var self = this;

    self.Id = ko.observable();
    self.ExternalInstitutionId = ko.observable();
    self.ExternalInstitutionName = ko.observable();
    self.ResponseStatus = ko.observable();
    self.Comment = ko.observable();
    self.Modified = ko.observable();

    self.MapFromJson = function (data) {
        self.Id(data.Id);
        self.ExternalInstitutionId(data.ExternalInstitutionId);
        self.ExternalInstitutionName(data.ExternalInstitutionName);

        if (data.ResponseStatus == 0) {
            self.ResponseStatus(languagePack['Scripts.app.viewmodels.Models.js.Odobreno']);//"Одобрено"
        }
        if (data.ResponseStatus == 1) {
            self.ResponseStatus(languagePack['Scripts.app.viewmodels.Models.js.Odobreno']);//"Одобрено"
        }
        if (data.ResponseStatus == 2) {
            self.ResponseStatus(languagePack['Scripts.app.viewmodels.Models.js.Odobreno']);//"Одобрено"
        }
        if (data.ResponseStatus == null) {
            self.ResponseStatus(languagePack['Scripts.app.viewmodels.Models.js.NemaSeusteOdgovor']);//"Нема сеуште одговор"
        }
        self.Comment(data.Comment);

        if (data.Modified != null) {
            var fromJsonDate1 = NS.Utils.Date.parseDateFromJson(data.Modified);
            var mkDate1 = NS.Utils.Date.toMKString(fromJsonDate1);
            self.Modified(mkDate1);
        }
    };
};

//КОМШИЈА
NS.ViewModels.NeighborhoodViewModel = function () {
    var self = this;

    self.neighborhoodName = ko.observable('');
    self.neighborhoodAddress = ko.observable('');
    self.neighborhoodCadastreParcel = ko.observable('');
};
//////////////////////////////////////////////////////////////////////////////////////


//Нотификации пратени до корисникот (Request2UserNotification)
NS.ViewModels.Request2UserNotificationItemViewModel = function () {
    var self = this;

    self.NotificationTypeName = ko.observable();
    self.Comment = ko.observable();
    self.Active = ko.observable();
    self.Cerated = ko.observable();
    self.CeratedBy = ko.observable();
    self.Modified = ko.observable();
    self.ModifiedBy = ko.observable();

    self.mapFromJson = function (data) {
        if (data.NotificationTypeName == "IncompleteRequest") {
            self.NotificationTypeName("Некомплетно барање");
        }
        else if (data.NotificationTypeName == "PayingUtilities") {
            self.NotificationTypeName("Плаќање на комуналии");
        }
        self.Comment(data.Comment);
        if (data.Active == true) {
            self.Active("Активна");
        }
        else if (data.Active == false) {
            self.Active("Неактивна");
        }
        if (data.Cerated != null) {
            var fromJsonDate1 = NS.Utils.Date.parseDateFromJson(data.Cerated);
            var mkDate1 = NS.Utils.Date.toMKString(fromJsonDate1);
            self.Cerated(mkDate1);
        }
        self.CeratedBy(data.CeratedBy);
        if (data.Modified != null) {
            var fromJsonDate2 = NS.Utils.Date.parseDateFromJson(data.Modified);
            var mkDate2 = NS.Utils.Date.toMKString(fromJsonDate2);
            self.Modified(mkDate2);
        }
        self.ModifiedBy(data.ModifiedBy);
    };
};

NS.ViewModels.Request2UserNotificationViewModel = function () {
    var self = this;

    self.Request = ko.observable();
    self.Request2UserNotification = ko.observableArray([]);

    self.Init = function (request) {
        self.Request(request);

        var data = NS.Repository.Request.GetRequest2UserNotification(self.Request().RequestId());
        if (!!data) {
            for (var i = 0; i < data.length; i++) {
                var item = new NS.ViewModels.Request2UserNotificationItemViewModel();
                item.mapFromJson(data[i]);
                self.Request2UserNotification.push(item);
            }
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
///

//ОПШТИНА ПОВРЗАНА ЗА БАРАЊЕ
NS.ViewModels.RequestMunicipalityViewModel = function () {
    var self = this;

    self.MunicipalityId = ko.observable();
    self.MunicipalityName = ko.observable();

    self.CadastreMunicipalities = ko.observableArray([]);

    self.mapFromJson = function (data) {

        self.MunicipalityId(data.MunicipalityId);
        self.MunicipalityName(data.MunicipalityName);

        if (!!data.SelectedCadastreMunicipalities) {
            for (var i = 0; i < data.SelectedCadastreMunicipalities.length; i++) {
                var item = new NS.ViewModels.RequestMunicipalityCadastreMunicipalityViewModel();
                item.mapFromJson(data.SelectedCadastreMunicipalities[i]);
                self.CadastreMunicipalities.push(item);
            }
        }
    };
};

//КАТАСТАРСКА ОПШТИНА И ПАРЦЕЛА ПОВРЗАНИ ЗА ОПШТИНА
NS.ViewModels.RequestMunicipalityCadastreMunicipalityViewModel = function () {
    var self = this;

    self.MunicipalityId = ko.observable();

    self.CadastreMunicipalityId = ko.observable();
    self.CadastreMunicipalityName = ko.observable();

    self.CadastreParcel = ko.observable();

    self.mapFromJson = function (data) {
        self.MunicipalityId(data.MunicipalityId);
        self.CadastreMunicipalityId(data.CadastreMunicipalityId);
        self.CadastreMunicipalityName(data.CadastreMunicipalityName);
        self.CadastreParcel(data.CadastreParcel);
    };
};