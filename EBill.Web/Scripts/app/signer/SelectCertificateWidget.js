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

            signer.LoadCertificateList("callbackCerts", function (certList) {

                //CHECK
                if (certList == null || certList.length == 0) {
                    NS.Controls.Dialog.infoDialog(
                        window.languagePack['Scripts.app.widgets.NewRequestWidget.js.Izvestuvanje'], // 'Известување...',
                        window.languagePack['Scripts.app.widgets.SelectCertificateWidget.js.NepronajdenSertifikat'] //'Нема пронајдени дигитални сертификати.'
                    );
                    return;
                }

                //Filter
                var viewModel = new NS.ViewModels.CertListViewModel();
                for (var i = 0; i < certList.length; i++) {
                    var cer = certList[i];
                    if (cer.Issuer().toString().indexOf('KIBS') > 0) {
                        viewModel.Items.push(cer);
                    } else if (cer.Issuer().toString().indexOf('Telekom') > 0) {
                        viewModel.Items.push(cer);
                    }
                }

                //BIND VIEW
                self.options.viewModel = viewModel;
                self.options.successCallback = successCallback;
                ko.applyBindings(viewModel, self.options.contentElement[0]);

                //OPEN SELECT DIALOG
                $(self.options.contentElement).dialog({
                    dialogClass: 'no-close',
                    title: languagePack['Scripts.app.widgets.SelectCertificateWidget.js.Title'],//'Избор на дигитален сертификат',
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
            //ERROR WHILE SIGNING
            alert(e);
        }
    },
    signDocument: function (thumbPrint, xmlDoc, successCallback) {
        try {
            var signerElement = $("#signerApp");
            var signer = signerElement[0];

            signer.SignDocument("callbackSignedRequest", thumbPrint, xmlDoc, function (signedDoc) {

                if (signedDoc == "") {
                    var errorMessage = signer.getError();
                    switch (errorMessage) {
                        case "WRONG_PIN":
                            NS.Controls.Dialog.errorDialog(languagePack['Scripts.app.widgets.SelectCertificateWidget.js.Greshka'],
                                //"Грешка при потпишување", 
                                languagePack['Scripts.app.widgets.SelectCertificateWidget.js.PogresenPin']
                                //"Пинот кој го внесовте е погрешен."
                            );
                            break;
                        case "NO_CERT_FOUND":
                            NS.Controls.Dialog.errorDialog(languagePack['Scripts.app.widgets.SelectCertificateWidget.js.Greshka'],
                                //"Грешка при потпишување", 
                                languagePack['Scripts.app.widgets.SelectCertificateWidget.js.SertificatNepronajden']
                                //"Дигиталниот сертификат не е пронајден."
                            );
                            break;
                        default:
                            NS.Controls.Dialog.errorDialog(languagePack['Scripts.app.widgets.SelectCertificateWidget.js.Greshka'],
                                //"Грешка при потпишување",
                                languagePack['Scripts.app.widgets.SelectCertificateWidget.js.PreinstalSertifikat']
                                //"Генерална грешка при потпишување.<br/> Ве молиме преинсталирајте ги драјверите за сертификатот."
                            );
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
