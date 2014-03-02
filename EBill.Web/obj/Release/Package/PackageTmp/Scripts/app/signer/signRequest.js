var signRequest = function (requestId, model, transition, openDialog, callBack) {
    if (!deployJava.versionCheck('1.7+')) {
        var holder = '<div id="' + new Date().getTime() + '"></div>';
        $(holder).JavaCheckerWidget({});
    } else {
        if (openDialog) {
            NS.Controls.Dialog.confirmDialog(
                languagePack['Scripts.app.widgets.confirmDialog.Confirm'],
                languagePack['Scripts.app.widgets.PublicRequestsWidget.js.MessageSignSend'],
                function () {
                    signRequest2(requestId, model, transition, callBack);
                });
        } else {
            signRequest2(requestId, model, transition, callBack);
        }
    }
};

//da ne se koristi direktno, da se koristi samo signRequest, bidejki ima dopolnitelni proverki za java
var signRequest2 = function (requestId, model, transition, callBack) {
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
            //Ako modelot e razlicen od null, stanuva zbor za potpis kaj public user i 
            //vednas potpisanoto baranje se zacuvuva vo baza
            //vo sprotivno pretpostavuvame deka povikot e od tranzicija i vo toj
            //slucaj ni treba samo potpisaniot xml

            //Koga se potpisuva baranjeto od strana na Baratelot
            var isSuccess;
            if ((model != null) && (transition == null)) {
                //SAVE TO DATABASE
                isSuccess = NS.Repository.PublicRequest.SignRequest(requestId, signedDoc);

                if (isSuccess != null && isSuccess == true)
                    return callBack(true);
                else {
                    return false;
                }
            }

            //Koga se potpisuva baranjeto vo tekot na rabotata (od tranzicija vo tranzicija)
            if ((model == null) && (transition != null)) {
                //izvrsi ja tranzicijata

                NS.Controls.Dialog.getBlockUI();

                transition.Signature = signedDoc;

                setTimeout(function () {
                    $.when($(document).trigger('on-transition-element-click', transition))
                        .done(function () {
                            $.unblockUI();
                        });
                }, 150);

                return callBack(true);
            }

            //Koga se potpisuva za povlekuvanje na baranjeto od baratelot
            if ((model == null) && (transition == null)) {
                isSuccess = NS.Repository.PublicRequest.WithdrawnRequest(requestId, signedDoc);
                if (isSuccess) {
                    return callBack(true);
                }
            }
        });
        //END  - SIGN
    }); //END  - SELECT THE CERTIFICATE 
};

var getCerForUser = function (userName) {
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
                    NS.Controls.Dialog.errorDialog("Грешка...", "Веќе постои корисник со овој дигитален потпис. Обидете се повторно.");
                }
                else if (returnStatus == 2) {
                    NS.Controls.Dialog.infoDialog("Потврда...", "Дигиталниот потпис е успешно зачуван.", function () { });
                }
                else if (returnStatus == 3) {
                    NS.Controls.Dialog.errorDialog("Грешка...", "Дигиталниот потпис не е пронајден. Обидете се повторно.");
                }

                return returnStatus;
            });
            //END  - SIGN
        }); //END  - SELECT THE CERTIFICATE 
    }
};