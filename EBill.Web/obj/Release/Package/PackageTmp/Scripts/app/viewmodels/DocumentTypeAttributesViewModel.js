///Модел за Атрибут на Тип на Документ
NS.ViewModels.DocumentTypeAttributeModel = function () {
    var self = this;
    self.Id = ko.observable();
    self.Name = ko.observable();
    self.NameAl = ko.observable();
    self.Description = ko.observable();
    self.DescriptionAl = ko.observable();
    self.Tag = ko.observable();
    self.TypeOfAttribute = ko.observable(); //od tip TypeOfAttribute

    self.mapFromJson = function (data) {
        self.Id(data.Id);
        self.Name(data.Name);
        self.NameAl(data.NameAl);
        self.Description(data.Description);
        self.DescriptionAl(data.DescriptionAl);
        self.Tag(data.Tag);
        var typeOfAttribute = NS.ViewModels.GetAttributeTypeByTypeName(data.TypeOfAttribute.Type);
        if (typeOfAttribute != null) {
            self.TypeOfAttribute(typeOfAttribute);
        }
    };
};

NS.ViewModels.DocumentTypeAttributesViewModel = function () {
    var self = this;
    var _ctx = null;

    self.DocumentTypeId = ko.observable();

    self.SelectedAttributes = ko.observableArray();
    self.AllowedTypeOfAttributes = ko.observableArray(GetAllowedAttributeTypes());

    var initial = 0;
    self.Init = function (documentTypeId) {
        self.DocumentTypeId(documentTypeId);
        var selected = NS.Repository.DocumentsAtributes.GetDocumentAttributes(documentTypeId);
        $.map(selected, function (item) {
            var documentTypeAttribute = new NS.ViewModels.DocumentTypeAttributeModel();
            documentTypeAttribute.mapFromJson(item);
            self.SelectedAttributes.push(documentTypeAttribute);
        });
        initial = self.SelectedAttributes().length;
    };

    self.add = function () {
        var newItem = new NS.ViewModels.DocumentTypeAttributeModel();
        newItem.Name('');
        newItem.Description('');
        newItem.TypeOfAttribute(new NS.ViewModels.TypeOfAttribute());
        self.SelectedAttributes.push(newItem);
    };

    self.EnableAddButton = ko.computed(function () {
        if (self.SelectedAttributes().length == 0) {
            return true;
        }
        for (var i = 0; i < self.SelectedAttributes().length ; i++) {
            var attr = self.SelectedAttributes()[i];
            if (attr.Name() == '' || attr.NameAl() == '') {
                return false;
            }
        }
        return true;
    });

    self.EnableConfirmButton = ko.computed(function () {
        for (var i = 0; i < self.SelectedAttributes().length ; i++) {
            var attr = self.SelectedAttributes()[i];
            if (attr.Name() != '' && attr.NameAl() != '') {
                return true;
            }
        }
        if (initial > 0 && self.SelectedAttributes().length == 0) {
            //saka da gi izbrise site
            return true;
        }
        return false;
    });
    
    self.remove = function (item) {
        $.each(self.SelectedAttributes(), function () {
            self.SelectedAttributes.remove(item);
        });
    };

    self.setContext = function (ctx) {
        _ctx = ctx;
    };
    self.Save = function () {
        var documentTypeId = self.DocumentTypeId();
        var attributes = self.SelectedAttributes();
        var result = NS.Repository.DocumentsAtributes.SetDocumentAttributes(documentTypeId, ClearMappings(attributes));
        return result;
    };

    self.IgnoreMappings = {
        both: [
            "IgnoreMappings",
            "AllowedTypeOfAttributes"
        ],
        dirty: [],
        json: []
    };
};