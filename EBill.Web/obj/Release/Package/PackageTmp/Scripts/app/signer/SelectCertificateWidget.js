$.widget("NS.SelectCertificateWidget",
{
    options: {
        templateId: 'signer/select-certificate',
    },
    _init: function () {
        this.options.parentElement = this.element;
        var element = NS.Utils.String.format("<div data-bind='template:{ name:{0}}'></div>", NS.Utils.String.format('"{0}"', this.options.templateId));
        $(this.element).append(element);
        this.options.contentElement = $("div", this.element);
    },
    load: function (successCallback) {
        var self = this;

        NS.ViewModels.CertListViewModel = function () {
            this.Items = ko.observableArray([]);
        };

        try {
            
            var signerElement = $("#signerApp");
            var signer = signerElement[0];

            signer.CertificateListFromIssuer("callbackCerts",
                "CN=KIBS Qualified Certificate Services CA, OU=Class 2 Managed PKI Individual Subscriber CA, OU=Terms of use at https://ca.kibs.com.mk/repository/rpa (c)10, OU=VeriSign Trust Network, O=KIBS AD Skopje, C=MK"
                , function (certList) {

                    //signer.LoadCertificateList("callbackCerts", function (certList) {

                    if (certList == null || certList.length == 0) {
                        alert('nema pronajdeni sertifikati');
                        return;
                    }

                    //if (certList.length == 1) {
                    //    successCallback(certList[0]);
                    //}

                    var viewModel = new NS.ViewModels.CertListViewModel();
                    viewModel.Items(certList);

                    self.options.viewModel = viewModel;
                    self.options.successCallback = successCallback;
                    ko.applyBindings(viewModel, self.options.contentElement[0]);

                    $(self.options.contentElement).dialog({
                        dialogClass: 'no-close',
                        title: 'Избор на дигитален сертификат',
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
                            $(this).remove();
                        }
                    });
                    self._initAplicationUIActions();
                });

            $.unblockUI();

        } catch (e) {
            //TODO UBAVA PORAKA
            alert(e);
        }
    },
    signDocument: function (thumbPrint, xmlDoc, successCallback) {

        var self = this;
        try {
            var signerElement = $("#signerApp");
            var signer = signerElement[0];

            signer.SignDocument("callbackSignedRequest", thumbPrint, xmlDoc, function (signedDoc) {

                if (signedDoc == "") {
                    var errorMessage = signer.getError();
                    switch (errorMessage) {
                        case "WRONG_PIN":
                            NS.Controls.Dialog.errorDialog("Грешка при потпишување", "Пинот кој го внесовте е погрешен.");
                            break;
                        case "NO_CERT_FOUND":
                            NS.Controls.Dialog.errorDialog("Грешка при потпишување", "Дигиталниот сертификат не е пронајден.");
                            break;
                        default:
                            NS.Controls.Dialog.errorDialog("Грешка при потпишување", "Генерална грешка при потпишување.<br/> Ве молиме преинсталирајте ги драјверите за сертификатот.");
                            break;
                    }
                    return;
                }
                else {
                    successCallback(signedDoc);
                }
            });

        } catch (e) {
            //TODO UBAVA PORAKA
            alert(e);
        }
    },
    _initAplicationUIActions: function () {
        var self = this;
        var viewModel = this.options.viewModel;
        var contentElement = self.options.contentElement[0];

        $('.btn-select-cert').on('click', contentElement, function (e) {
            var cert = ko.dataFor(this);
            self.options.successCallback(cert);
            $(contentElement).dialog('close');
        });
    },
    destroy: function () {
        this.options.viewModel = null;
        $(this.element).empty();
        $.Widget.prototype.destroy.call(this);
    }
});
