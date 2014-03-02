NS.Repository.Users = {};

NS.Repository.Users.AddRoles = function (userId, selectedRoles, ctx) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SharedUsers/AddRoles'
        , {
            userId: userId,
            selectedRoles: selectedRoles
        }
        , function (data) {
            result = data;
        },
        function (response) {
            NS.Utils.AJAX.parseErors(response, ctx);
        },
        false
    );
    return result != null;
};

NS.Repository.Users.ResetPassword = function (userId, ctx) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SharedUsers/ResetPassword'
        , {
            userId: userId
        }
        , function (data) {
            result = data;
        },
        function (response) {
            NS.Utils.AJAX.parseErors(response, ctx);
        },
        false
    );
    return result != null;
};

NS.Repository.Users.Registration = function (model) {
    var rawData = null;
    var errors = [];
    NS.Utils.AJAX.post(
        baseUrl + 'Account/Registration',
        {
            model: model
        },
        function (data) {
            rawData = data;
        },
        function (response) {

            if (response.Errors.UserName != undefined) {
                for (var i = 0; i < response.Errors.UserName.length; i++) {
                    errors.push(response.Errors.UserName[i]);
                }
            }
            if (response.Errors.CaptchaValue != undefined) {
                for (var i = 0; i < response.Errors.CaptchaValue.length; i++) {
                    errors.push(response.Errors.CaptchaValue[i]);
                }
            }


        },
        false
    );
    if (errors.length > 0) {
        rawData = errors;
        return rawData;
    }
    return rawData != null;
};



NS.Repository.Users.RegistrationConfirmation = function (model) {
    var rawData = null;
    NS.Utils.AJAX.post(
        baseUrl + 'Account/Confirmation',
        {
            model: model
        },
        function (data) {
            rawData = data;
        },
        function (response) {
            NS.Utils.AJAX.parseErors(response, document);
        },
        false
    );
    return rawData;
};


NS.Repository.Users.ForgotPassword = function (username) {
    var rawData = null;
    var error;
    NS.Utils.AJAX.post(
        baseUrl + 'Account/ForgotPassword',
        {
            username: username
        },
        function (data) {
            rawData = data;
        },
        function (response) {
            error = response.ErrorMessage;
        },
        false
    );
    if (error != undefined) {
        rawData = error;
        return rawData;
    }
    return rawData != null;
};


NS.Repository.Users.ForgotPasswordConfirmation = function (model) {
    var rawData = null;
    NS.Utils.AJAX.post(
        baseUrl + 'Account/ForgotPasswordConfirmation',
        {
            model: model
        },
        function (data) {
            rawData = data;
        },
        function (response) {
            NS.Utils.AJAX.parseErors(response, document);
        },
        false
    );
    return rawData != null;
};

NS.Repository.Users.Captcha = function (prefix) {
    var rawData = new Image();

    NS.Utils.AJAX.post(
        baseUrl + 'Account/CaptchaImage',
        {
            prefix: prefix
        },
        function (data) {
            rawData = data;
        },
        function (response) {
            NS.Utils.AJAX.parseErors(response, document);
        },
        false
    );
    return rawData != null;
};

NS.Repository.Users.GetCerForUser = function (userName, signature) {
    var result = null;
    NS.Utils.AJAX.post(
        baseUrl + 'Account/UploadCertificate',
        {
            UserName: userName,
            Signature: signature
        },
        function (data) {
            result = data;
        },
        null,
        false
    );
    return result;
};