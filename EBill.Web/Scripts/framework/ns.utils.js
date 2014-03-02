NS.Utils = {
    String: {
        format: function () {
            var s = arguments[0];
            for (var i = 0; i < arguments.length - 1; i++) {
                var reg = new RegExp("\\{" + i + "\\}", "gm");
                s = s.replace(reg, arguments[i + 1]);
            }
            return s;
        }
    },
    Date: {
        convertJsonDate: function (jsonDate) {
            var date = eval(jsonDate.replace(/\/Date\((\d+)\)\//gi, "new Date($1)"));
            return date;
        },
        parseDateFromJson: function (date) {
            try {
                var dateFloat = parseFloat(date.replace('/Date(', ''));
                if (dateFloat > 0) {
                    return new Date(dateFloat);
                }
            } catch (e) {
                if (!!console) {
                    console.log('error parsing date: ' + date + ', error :' + e);
                }
            }
            return null;
        },
        toMKString: function (date) {
            return $.datepicker.formatDate('dd.mm.yy', date);
        }
        , toFullMKString: function (date) {
            return $.datepicker.formatDate('dd.mm.yy ', date) + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        }
    },
    Number: {
        padLeft: function (date, len, c) {
            if (!c) {
                c = " ";
            }

            if (("" + date).length >= len) {
                return "" + date;
            }
            else {
                return arguments.callee.call(
                    c + date,
                    len,
                    c
                );
            }
        },
        toMoney: function (decimals, decimalSep, thousandsSep) {
            var n = this,
                c = isNaN(decimals) ? 2 : Math.abs(decimals), //if decimal is zero we must take it, it means user does not want to show any decimal
                d = decimalSep || ',', //if no decimal separetor is passed we use the comma as default decimal separator (we MUST use a decimal separator)

            /*
            according to [http://stackoverflow.com/questions/411352/how-best-to-determine-if-an-argument-is-not-sent-to-the-javascript-function]
            the fastest way to check for not defined parameter is to use typeof value === 'undefined' 
            rather than doing value === undefined.
            */
                t = (typeof thousandsSep === 'undefined') ? '.' : thousandsSep, //if you don't want ot use a thousands separator you can pass empty string as thousands_sep value

                sign = (n < 0) ? '-' : '',
            //extracting the absolute value of the integer part of the number and converting to string
                i = parseInt(n = Math.abs(n).toFixed(c)) + '',
                j = ((j = i.length) > 3) ? j % 3 : 0;
            return sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
        }
    },
    AJAX: {
        post: function (methodUrl, postData, successCallback, errorCallback, asynchronous, postContentType, callBackParameters) {

            if (asynchronous == null)
                asynchronous = true;

            var contentType = "application/json; charset=utf-8";
            if (postContentType != null) {
                switch (postContentType) {
                    case "form":
                        contentType = "application/x-www-form-urlencoded";
                        break;
                    default:
                        contentType = "application/json; charset=utf-8";
                        if (postData)
                            postData = JSON.stringify(postData);
                        break;
                }
            } else {
                if (postData)
                    postData = JSON.stringify(postData);
            }

            $.ajax({
                traditional: true,
                mode: 'queue',
                url: methodUrl,
                async: asynchronous,
                cache: false,
                contentType: contentType,
                type: 'POST',
                data: postData,
                dataType: 'json',
                error: function (xhr) {
                    if (xhr.readyState == 0 || xhr.status == 0)
                        return;  // it's not really an error

                    var response;
                    try {
                        response = eval("(" + xhr.responseText + ")");
                    }
                    catch (e) {
                        response = xhr.responseText;
                    }

                    if ($.isFunction(errorCallback))
                        errorCallback(response, callBackParameters);
                    else {
                        NS.Utils.AJAX.parseErrorResponse(response);
                    }
                },
                success: function (d, s, x) {
                    if ($.isFunction(successCallback))
                        successCallback(d, s, x);
                }
            });
        },
        parseErrorResponse: function (response) {
            if (response.hasOwnProperty('ErrorMessage')) {
                NS.Controls.Dialog.errorDialog(
                    languagePack['Scripts.app.widgets.NewRequestWidget.js.Greska'], //'Грешка...',
                    response.ErrorMessage);
                return;
            }
            NS.Controls.Dialog.errorDialog(
                languagePack['Scripts.app.widgets.NewRequestWidget.js.Greska'], //"Грешка ...",
                response);
        },
        parseErors: function (response, ctx) {

            //clear errors
            $(".input-validation-error", ctx)
                .removeClass("input-validation-error")
                .removeAttr("title");

            //ErrorMessage
            if (response.hasOwnProperty('ErrorMessage')) {
                NS.Controls.Dialog.errorDialog(
                    languagePack['Scripts.app.widgets.NewRequestWidget.js.Greska'], //'Грешка...',
                    response.ErrorMessage);
                return;
            }

            //Error List
            if (response.hasOwnProperty('Errors')) {
                var errorMessage = "";

                for (var prop in response.Errors) {

                    if (typeof prop === "function") {
                        continue;
                    }

                    var propMessage = "";
                    for (var i = 0; i < response.Errors[prop].length; i++) {
                        var message = response.Errors[prop][i];
                        if (message != undefined) {
                            propMessage = propMessage + message + "\n";
                        }
                    }

                    var element = $("*[data-val-id='" + prop + "']", ctx);
                    if (element.length > 0) {
                        element.addClass("input-validation-error").attr("title", propMessage);
                    } else {
                        errorMessage = errorMessage + propMessage;
                    }
                }

                if (errorMessage != "") {
                    NS.Controls.Dialog.errorDialog(
                        languagePack['Scripts.app.widgets.NewRequestWidget.js.Greska'], //"Грешка ...",
                        errorMessage);
                }

                return;
            }
            NS.Controls.Dialog.errorDialog(
                languagePack['Scripts.app.widgets.NewRequestWidget.js.Greska'], //"Грешка ...",
                response);
        }
    }
};

var extractFileName = function (path) {
    //TODO TUKA REGEX-OT na GORJAN OD SERVERSIDE ZA DA MOZE DA SE PRODUCIRA ISTIOT FILENAME
    var fileName = '';
    if (path != undefined && path != '') {
        var ary = path.split("\\");
        fileName = ary[ary.length - 1];
    }
    return fileName;
};