
(function ($) {
    $.fn.latin = function (options) {
        $.fn.latin.init();
        options = $.extend({}, $.fn.latin.defaults, options);

        this.each(function () {
            var opts = $.fn.latin.elementOptions(this, options);

            $(this).bind('keypress', function (e) {

                //Доколку не е дозволено да се внесуваат броеви треба да се прекине настанот
                if ($(this).hasClass("cyrillic-disallow-numbers")) {
                    if ($.fn.cyrillic.isNumber(e)) {
                        e.preventDefault();
                        return false;
                    }
                }

                if ($.browser.msie && !event.ctrlKey) {//IE
                    //Repace Key
                    var upper = $.fn.latin.isUpper(event.keyCode);
                    var rep_letter = $.fn.latin.cyr5ko_tast(event.keyCode, upper);
                    if (rep_letter) {
                        //IE Support
                        window.event.keyCode = rep_letter.charCodeAt();
                    }
                }
                else if (!e.ctrlKey) {//DOM

                    if ($.browser.safari) {
                        //Chrome Safari Support
                        var upper = $.fn.latin.isUpper(e.which);
                        var rep_letter = $.fn.latin.cyr5ko_tast(e.which, upper);
                        if (rep_letter) {

                            var newEvent = document.createEvent('TextEvent');
                            newEvent.initTextEvent('textInput', true, true, null, rep_letter);

                            e.preventDefault();
                            e.stopPropagation();
                            e.stopImmediatePropagation();

                            this.dispatchEvent(newEvent);
                        }

                    } else if ($.browser.opera) {
                        //Opera
                        var upper = $.fn.latin.isUpper(e.which);
                        var rep_letter = $.fn.latin.cyr5ko_tast(e.which, upper);
                        if (rep_letter) {

                            var CaretPosS = this.selectionStart;
                            var CaretPosE = this.selectionEnd;

                            insertionS = CaretPosS == -1 ? CaretPosE : CaretPosS;
                            insertionE = CaretPosE;

                            e.preventDefault();
                            e.stopPropagation();
                            e.stopImmediatePropagation();

                            var tmp = this.value;
                            this.value = tmp.substring(0, insertionS) + rep_letter + tmp.substring(insertionS, tmp.length);

                            //alert("This plugin not work best in Opera!!!");
                        }

                    } else {

                        //Firefox 
                        var upper = $.fn.latin.isUpper(e.which);
                        var rep_letter = $.fn.latin.cyr5ko_tast(e.which, upper);
                        if (rep_letter) {
                            var newEvent = document.createEvent("KeyEvents");
                            newEvent.initKeyEvent("keypress", true, true, document.defaultView,
                                              e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 0, rep_letter.charCodeAt(0));

                            e.preventDefault();
                            e.stopPropagation();
                            e.stopImmediatePropagation();

                            e.target.dispatchEvent(newEvent);
                        }
                    }
                }

            });

        });
        return this;
    }

    $.fn.latin.elementOptions = function (ele, options) {
        return $.metadata ? $.extend({}, options, $(ele).metadata()) : options;
    };

    $.fn.latin.defaults =
    {
        AZBk: new Array()
    };

    $.fn.latin.init = function () {
        opts = $.fn.latin.defaults;
        var i1 = 0;
        opts.AZBk[i1++] = new Array("ë", "Ë", "59", "58");
        opts.AZBk[i1++] = new Array("ç", "Ç", "91", "123");
        opts.AZBk[i1++] = new Array("a", "A", "1072", "1040");
        opts.AZBk[i1++] = new Array("b", "B", "1073", "1041");
        opts.AZBk[i1++] = new Array("c", "C", "1094", "1062");
        opts.AZBk[i1++] = new Array("d", "D", "1076", "1044");
        opts.AZBk[i1++] = new Array("e", "E", "1077", "1045");
        opts.AZBk[i1++] = new Array("f", "F", "1092", "1060");
        opts.AZBk[i1++] = new Array("g", "G", "1075", "1043");
        opts.AZBk[i1++] = new Array("h", "H", "1093", "1061");
        opts.AZBk[i1++] = new Array("i", "I", "1080", "1048");
        opts.AZBk[i1++] = new Array("j", "J", "1112", "1032");
        opts.AZBk[i1++] = new Array("k", "K", "1082", "1050");
        opts.AZBk[i1++] = new Array("l", "L", "1083", "1051");
        opts.AZBk[i1++] = new Array("m", "M", "1084", "1052");
        opts.AZBk[i1++] = new Array("n", "N", "1085", "1053");
        opts.AZBk[i1++] = new Array("o", "O", "1086", "1054");
        opts.AZBk[i1++] = new Array("p", "P", "1087", "1055");
        opts.AZBk[i1++] = new Array("q", "Q", "1113", "1033");
        opts.AZBk[i1++] = new Array("r", "R", "1088", "1056");
        opts.AZBk[i1++] = new Array("s", "S", "1089", "1057");
        opts.AZBk[i1++] = new Array("t", "T", "1090", "1058");
        opts.AZBk[i1++] = new Array("u", "U", "1091", "1059");
        opts.AZBk[i1++] = new Array("v", "V", "1074", "1042");
        opts.AZBk[i1++] = new Array("w", "W", "1114", "1034");
        opts.AZBk[i1++] = new Array("x", "X", "1119", "1039");
        opts.AZBk[i1++] = new Array("y", "Y", "1109", "1029");
        opts.AZBk[i1++] = new Array("z", "Z", "1079", "1047");

        opts.AZBk[i1++] = new Array("ç", "Ç", "1096", "1064");
        opts.AZBk[i1++] = new Array("ë", "Ë", "1095", "1063");
        opts.AZBk[i1++] = new Array("'", '"', "1116", "1036");
        opts.AZBk[i1++] = new Array("]", "}", "1107", "1027");
        opts.AZBk[i1++] = new Array("\\", "|", "1078", "1046");
        
    };

    $.fn.latin.cyr5ko_tast = function (keyCode, upper) {
        opts = $.fn.latin.defaults;
        for (var i = 0; i < opts.AZBk.length; i++) {
            if (upper) {
                fromKeyCode = opts.AZBk[i][3];
                if (keyCode == fromKeyCode) {
                    toLetter = opts.AZBk[i][1];
                    return toLetter;
                }
            }
            else {
                fromKeyCode = opts.AZBk[i][2];
                if (keyCode == fromKeyCode) {
                    toLetter = opts.AZBk[i][1];
                    return toLetter;
                }
            }
        }
        if (keyCode >= 97) {
            return String.fromCharCode(keyCode).toUpperCase();
        }
        return false;
    }

    $.fn.latin.isUpper = function (key) {
        opts = $.fn.latin.defaults;
        for (var i = 0; i < opts.AZBk.length; i++) {
            if (key == opts.AZBk[i][3]) {
                return 1;
            }
        }
        return 0;
    }


    $.fn.latin.getKeyCode = function (e) {
        if (!e) {
            //if the browser did not pass the event information to the
            //function, we will have to obtain it from the event register
            if (window.event) {
                //Internet Explorer
                e = window.event;
            } else {
                //total failure, we have no way of referencing the event
                return;
            }
        }
        if (typeof (e.keyCode) == 'number') {
            //DOM
            return e.keyCode;
        } else if (typeof (e.which) == 'number') {
            //NS 4 compatible
            return e.keyCode;
        } else if (typeof (e.charCode) == 'number') {
            //also NS 6+, Mozilla 0.9+
            return e.keyCode;
        } else {
            //total failure, we have no way of obtaining the key code
            return
        }
    };

    $.fn.latin.oc = function (a) {
        var o = {};
        for (var i = 0; i < a.length; i++) {
            o[a[i]] = '';
        }
        return o;
    }

})(jQuery);
