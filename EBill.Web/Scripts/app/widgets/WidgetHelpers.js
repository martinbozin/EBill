jQuery.extend({
    createWidgetHolder: function () {
        var elmId = 'NS_' + (Math.floor(Math.random() * 6) + 1);
        return $("<div id='" + elmId + "' class='widget-holder'></div>");
    }
});