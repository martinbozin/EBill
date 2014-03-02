NS.SIGNER = NS.SIGNER || {};

NS.SIGNER.SignRequest = function (requestId, openDialog, callBack) {
    if (!deployJava.versionCheck('1.7+')) {
        var holder = '<div id="' + new Date().getTime() + '"></div>';
        $(holder).JavaCheckerWidget({});
    } else {
        if (openDialog) {
            NS.Controls.Dialog.confirmDialog(
                window.languagePack['Scripts.app.widgets.confirmDialog.Confirm'],
                window.languagePack['Scripts.app.widgets.PublicRequestsWidget.js.MessageSignSend'],
                function () {
                    NS.SIGNER.SignRequest2(requestId, callBack);
                });
        } else {
            NS.SIGNER.SignRequest2(requestId, callBack);
        }
    }
};

//da ne se koristi direktno, da se koristi samo signRequest, bidejki ima dopolnitelni proverki za java
NS.SIGNER.SignRequest2 = function (requestId, callBack) {
    //OPEN  SELECT CERTIFICATE DIALOG
    var widgetHolder = $.createWidgetHolder();
    $(widgetHolder).SelectCertificateWidget({});

    NS.Controls.Dialog.getBlockUI();

    //SELECT THE CERTIFICATE 
    $(widgetHolder).SelectCertificateWidget("load", function (selectedCert) {
        //GET SELECTED CERTIFICATE
        var thumbPrint = selectedCert.Thumbprint();
        //GET THE XML FOR SIGNIGN
        var xmlDocument = NS.Repository.Request.GetRequestForSigning(requestId);
        //SIGN
        $(widgetHolder).SelectCertificateWidget("signDocument", thumbPrint, xmlDocument, function (signedDoc) {
            return callBack(true, signedDoc);
        });
        //END  - SIGN
    }); //END  - SELECT THE CERTIFICATE 
};

NS.SIGNER.GetCerForUser = function (userName) {
    if (!deployJava.versionCheck('1.7+')) {
        var holder = '<div id="' + new Date().getTime() + '"></div>';
        $(holder).JavaCheckerWidget({});
    } else {
        //OPEN  SELECT CERTIFICATE DIALOG
        var widgetHolder = $.createWidgetHolder();
        $(widgetHolder).SelectCertificateWidget({});

        NS.Controls.Dialog.getBlockUI();

        //SELECT THE CERTIFICATE 
        $(widgetHolder).SelectCertificateWidget("load", function (selectedCert) {
            //GET SELECTED CERTIFICATE
            var thumbPrint = selectedCert.Thumbprint();
            //GET THE XML FOR SIGNIGN
            var xmlDocument = '<userCer></userCer>';
            //SIGN
            $(widgetHolder).SelectCertificateWidget("signDocument", thumbPrint, xmlDocument, function (signedDoc) {
                //SAVE TO DATABASE
                var returnStatus = NS.Repository.Users.GetCerForUser(userName, signedDoc);
                if (returnStatus == 1) {
                    NS.Controls.Dialog.errorDialog(
                        window.languagePack['Scripts.app.widgets.NewRequestWidget.js.Greska'], //"Грешка...",
                        window.languagePack['Scripts.app.widgets.PublicRequestsWidget.js.DigitalenPotpisPostoi'] //"Веќе постои корисник со овој дигитален потпис. Обидете се повторно."
                    );
                }
                else if (returnStatus == 2) {
                    NS.Controls.Dialog.infoDialog(
                         window.languagePack['Scripts.app.widgets.confirmDialog.Confirm'], //"Потврда...",
                        window.languagePack['Scripts.app.widgets.PublicRequestsWidget.js.DigitalenPotpisZacuvan'], //"Дигиталниот потпис е успешно зачуван.",
                        function () { });
                }
                else if (returnStatus == 3) {
                    NS.Controls.Dialog.errorDialog(
                        window.languagePack['Scripts.app.widgets.NewRequestWidget.js.Greska'], //"Грешка...",
                        window.languagePack['Scripts.app.widgets.PublicRequestsWidget.js.DigitalenPotpisNepronajden'] //"Дигиталниот потпис не е пронајден. Обидете се повторно."
                    );
                }
                return returnStatus;
            });
            //END  - SIGN
        }); //END  - SELECT THE CERTIFICATE 
    }
};