$.widget("NS.RegistrationWidget",
{
    options: {
        templateId: 'registration-start'
    },
    _init: function () {
        this.options.parentElement = this.element;
        var element = NS.Utils.String.format("<div data-bind='template:{ name:{0}}'></div>", NS.Utils.String.format('"{0}"', this.options.templateId));
        $(this.element).append(element);
        this.options.contentElement = $("div", this.element);
    },
    load: function () {
        var self = this;

        var viewModel = new NS.ViewModels.RegistrationViewModel();
        viewModel.Init();
        viewModel.setContext(this.options.contentElement);
        this.options.viewModel = viewModel;
        ko.applyBindings(viewModel, self.options.contentElement[0]);

        this._initAplicationUIActions();
    },
    _initAplicationUIActions: function () {
        var self = this;
        var viewModel = self.options.viewModel;
        var contentElement = self.options.contentElement;
        viewModel.errors = ko.validation.group(viewModel);

        /////////////////////////////////////////////////////////////////////
        //SAVE THE REGISTRATION

        $.fn.fixPlaceHolders();

        $('#continueBtn').on("click",function () {
   
            if (viewModel.errors().length > 0) {
                viewModel.errors.showAllMessages();
                return;
            } else {

                $("#dialogBox").dialog({
                    resizable: false,
                    height: 200,
                    modal: true,
                    buttons: {
                        "OK": function () {
                            var registrationModel = ClearMappings(viewModel);
                            var model = {
                                FirstName: registrationModel.FirstName,
                                LastName: registrationModel.LastName,
                                UserName: registrationModel.UserName,
                                Password: registrationModel.Password,
                                Address: registrationModel.Address,
                                CaptchaValue: registrationModel.CaptchaValue
                            };

                            var isSuccess = NS.Repository.Users.Registration(model);
                            if (isSuccess == true) {
                                window.location.href = baseUrl + 'Account/Confirmation';
                            } else {
                      
                                $('#errorLabel').text(isSuccess);
                            }
                            $(this).dialog("close");
                        },
                        Cancel: function () {
                            $(this).dialog("close");
                        }
                    }
                });
            }


        });

        var prefix = new Date().getTime();
        $('#img-captcha').attr('src', baseUrl + 'Account/CaptchaImage?prefix=' + prefix);

        $('#refreshCaptcha').click(function () {
            prefix = new Date().getTime();
            if (prefix != undefined) {              
                $('#img-captcha').attr('src', baseUrl + 'Account/CaptchaImage?t=' + prefix);
            } else {
                $('#img-captcha').attr('src', baseUrl + 'Account/CaptchaImage?t=' + prefix);
            }
           
        });

        $('#refreshCaptchaBtn').click(function () {
            prefix = new Date().getTime();
         var url = baseUrl + 'Account/CaptchaImage?prefix=' + prefix;
            if (prefix != undefined) {
                $('#img-captcha').attr('src', baseUrl + 'Account/CaptchaImage?t=' + prefix);
            } else {
                $('#img-captcha').attr('src', baseUrl + 'Account/CaptchaImage?t=' + prefix);

            }

        });
        /////////////////////////////////////////////////////////////////////
        //Vrakanje na Login Page
        $('#cancelBtn').click(function () {
            window.location.href = baseUrl + 'Account/Login';
        });

        //Proverka dali e postoecko korisnickoto ime
        $(document).on("blur", "#UserName", function (e) {
            $("#result").hide();
            var url = baseUrl + "/Account/CheckUserName";
            var name = $('#UserName').val();
            if (name.length > 0) {
                $.get(url, { input: name }, function (data) {
                    if ($('#message').children().find('.validationMessage').css('display') == "none") {
                        if (data == "Available" && $('#message').children().find('.validationMessage').css('display') == "none") {
                            $("#result").show();
                            $("#result").html("<span style='color:green'>Валиден e-mail</span>");
                            $("#UserName").css('background-color', '');
                        } else {
                            $('#message').children().find('.validationMessage').show();
                            $("#result").show();
                            $("#result").html("<span style='color:red'>Постоечки e-mail</span>");

                        }
                    }
                });
            }
        });

        //Proverka dali e tocna Captcha
        $(document).on("blur", "#CaptchaValue", function (e) {
            var url = baseUrl + "/Account/CheckCaptcha";
            var captcha = $('#CaptchaValue').val();
            if (captcha.length > 0) {
                $.get(url, { input: captcha, prefix: prefix }, function (data) {

                   if (data == "Good")  {
                   
                        $("#result1").hide();
                        $("#errortext").remove();
                            $("#CaptchaValue").css('background-color', '');
                        } else {
                            $('#message1').children().find('.validationMessage').show();
                            $("#result1").show();
                            $("#result1").html("<span id='errortext' style='color:red'>Невалидна вредност.</span>");

                        }
                    //}
                });
            }
        });
    },
    destroy: function () {
        this.options.viewModel = null;
        $(this.element).empty();
        $.Widget.prototype.destroy.call(this);
    }
});
