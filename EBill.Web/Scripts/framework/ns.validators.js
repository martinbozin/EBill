NS.Validators = {
    SetupValidationSettings: function () {
        ko.validation.configure({
            insertMessages: true,
            decorateElement: true,
            errorsAsTitle: false,
            errorsAsTitleOnModified: false,
            registerExtenders: true,
            messagesOnModified: false,
            parseInputAttributes: true,
            messageTemplate: null,
            errorElementClass: 'input-validation-error'
        });
    },
    SetupPopupValidationSettings: function () {
        ko.validation.configure({
            insertMessages: false,
            decorateElement: true,
            errorsAsTitleOnModified: true,
            registerExtenders: true,
            messagesOnModified: false,
            parseInputAttributes: true,
            messageTemplate: null,
            errorElementClass: 'input-validation-error'
        });
    }
};

ko.validation.rules['checked'] = {
    validator: function (value) {
        if (!value) {
            return false;
        }
        return true;
    }
};
ko.validation.registerExtenders();
