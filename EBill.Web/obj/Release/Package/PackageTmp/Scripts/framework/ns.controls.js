NS.Controls = {
    Dialog: {
        confirmDialog: function (title, content, callback, cancelCallback) {
            var contentHolder = $('<div class="confirm-wrap" />').html(content);
            var modal = $('<div />').append(contentHolder);
            modal.dialog({
                modal: true,
                resizable: false,
                width: 550,
                height: 300,
                title: title,
                buttons: [{
                    text: languagePack['eDozvoli.Web.framework.ns.controls.Prodolzi'],//'Продолжи'
                    click: function () {
                        if (!!callback && typeof callback == 'function') {
                            callback();
                        }
                        $(this).dialog('close');
                    }
                }, {
                    text: languagePack['eDozvoli.Web.framework.ns.controls.Otkazi'],//'Откажи'
                    click: function () {
                        if (!!cancelCallback && typeof cancelCallback == 'function') {
                            cancelCallback();
                        }
                        $(this).dialog('close');
                    }
                }],
                close: function () {
                    $(this).remove();
                }
            }).dialog('open');
        },
        errorDialog: function (title, content) {
            var contentHolder = $('<div class="error-wrap" />').html(content);
            var modal = $('<div />').append(contentHolder);
            modal.dialog({
                modal: true,
                resizable: false,
                width: 800,
                height: 600,
                title: title,
                buttons: [{
                    text: 'OK',
                    click: function () { $(this).dialog('close'); }
                }],
                close: function () {
                    $(this).remove();
                }
            }).dialog('open');
        },
        getBlockUI: function () {
            $.blockUI({
                baseZ: 2000,
                centerY: 0,
                message: 'Вчитување...',
                css: {
                    top: '9px',
                    height: '40px', 'line-height': '40px',
                    background: '#fcf7c1',
                    color: '#4a4a4a', 'font-weight': '700', 'font-size': '11px', 'text-transform': 'uppercase',
                    border: 'solid 1px #fad426', 'border-radius': '5px',
                },
                overlayCSS: {
                    backgroundColor: '#000',
                    opacity: 0.3,
                    cursor: 'wait',
                    position: 'absolute'
                }
            });
        },
        infoDialog: function (title, content, callback, cancelCallback) {
            var contentHolder = $('<div class="confirm-wrap" />').html(content);
            var modal = $('<div />').append(contentHolder);
            modal.dialog({
                modal: true,
                resizable: false,
                width: 550,
                height: 300,
                title: title,
                buttons: [{
                    text: 'OK',
                    click: function () {
                        if (!!callback && typeof callback == 'function') {
                            callback();
                        }
                        $(this).dialog('close');
                    }
                }],
                close: function () {
                    $(this).remove();
                }
            }).dialog('open');
        }
    },
    FORM: {
        changeEnterBehavior: function (ctx) {
            var inputs = $('input:text, select, textarea', ctx).not(':disabled').not('.stop');
            inputs.bind('keypress', function (e) {
                if (e.which == 13) {
                    var nextInput = inputs[inputs.index(this) + 1];
                    if (!!nextInput) {
                        try {
                            nextInput.select();
                        } catch (ex) {
                            nextInput.focus();
                        }
                    } else {
                        $('.btn-primary').focus();
                    }
                }
                return false;
            });
        }
    },
    JQGRID: {
        ListItem: function (id, name, code) {
            this.Id = id;
            this.Name = name;
            this.Code = code;
        },
        buildLoookupDropDown: function (list, showNullItem) {

            var listItems;
            if (list.responseText)
                listItems = JSON.parse(list.responseText);
            else
                listItems = JSON.parse(list);

            var result = '<select>';
            if (showNullItem != undefined && showNullItem == true) {
                var nullItem = NS.Utils.String.format('<option value="{0}">{1}</option>', "", languagePack['eDozvoli.Web.framework.ns.controls.Site']);//"Сите..."
                result += nullItem;
            }

            for (var i = 0; i < listItems.length; i++) {
                var item = listItems[i];
                var itm = NS.Utils.String.format('<option value="{0}">{1}</option>', item.Value, item.Text);
                result += itm;
            }

            result += '</select>';
            return result;
        }
    },
    JQUERYUI: {
        initAutoComplete: function (elem, lookupUrl, selectCallBack, blurCallBack) {
            $(elem).autocomplete({
                autoFocus: true,
                source: function (request, response) {
                    $.ajax({
                        url: lookupUrl,
                        data: request,
                        cache: false,
                        dataType: "json",
                        type: "POST",
                        success: function (serverResponse) {
                            response($.map(serverResponse, function (item) {
                                return {
                                    label: item.Name,
                                    value: item.Code,
                                    data: item
                                };
                            }));
                        }
                    });
                },
                minLength: 2,
                select: function (event, ui) {
                    selectCallBack(ui);
                }
            }).blur(function () {
                blurCallBack(this);
            }).focus(function () {
                //selectedValue = data.Item.Code();
            })._renderItem = function (ul, item) {
                var itemTemplate = "\
                    <table style=\"width:350px;\" cellspacing=\"0\" border=\"1\">\
                            <tr>\
                                <td style=\"width:35px\">{0}</td>\
                                <td>{1}</td>\
                            </tr>\
                    </table>";

                itemTemplate = String.format(itemTemplate, item.data.Code, item.label);

                return $("<li></li>")
        		.data("item.autocomplete", item)
        		.append('<a>' + itemTemplate + '</a>')
        		.appendTo(ul);
            };
        }
    }
};

$(function () {

    //FIX ZA TABOVITE
    $.fn.__tabs = $.fn.tabs;
    $.fn.tabs = function (a, b, c, d, e, f) {
        var base = location.href.replace(/#.*$/, '');
        $('ul>li>a[href^="#"]', this).each(function () {
            var href = $(this).attr('href');
            $(this).attr('href', base + href);
            console.log(base + href);
        });
        $(this).__tabs(a, b, c, d, e, f);
    };
    
    $('.tipTip').livequery(function () {
        $(this).each(function () {
            $(this).tipTip({
            });
        });
    });

    //GLOBALNO PODESUVANJE ZA AJAX REQUESTITE
    var isBlocked = false;
    var ajaxRequests = 0;
    $(document).ajaxStart(function () {
        if (!isBlocked) {
            NS.Controls.Dialog.getBlockUI();
            isBlocked = true;
        }
        ajaxRequests++;
    });

    $(document).ajaxComplete(function () {
        setTimeout(function () {
            if (isBlocked && ajaxRequests <= 1) {
                $.unblockUI();
                $.blockUI.defaults.css.cursor = 'default';
                isBlocked = false;
            }
            ajaxRequests--;
        }, 30);
    });

});

