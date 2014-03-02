$(document).ready(function () {
    handleAjaxMessages();
    displayMessages();
});
function displayMessage(message, messageType) {
    $("#messagewrapper").html('<div class="messagebox ' + messageType.toLowerCase() + '"></div>');
    $("#messagewrapper .messagebox").text(message);
    displayMessages();
}

function displayMessages() {
    if ($("#messagewrapper").children().length > 0) {
        $("#messagewrapper").show();
        $(document).click(function () {
            clearMessages();
        });
    }
    else {
        $("#messagewrapper").hide();
    }
}

function clearMessages() {
    $("#messagewrapper").fadeOut(500, function () {
        $("#messagewrapper").empty();
    });
}

function handleAjaxMessages() {
    $(document).ajaxSuccess(function (event, request) {
        checkAndHandleMessageFromHeader(request);
    }).ajaxError(function (event, request) {
        var xMessageType = request.getResponseHeader('X-Message-Type');
        if (xMessageType == undefined || xMessageType == null) {
            return;
        }
        if (request.responseText != undefined && request.responseText != '') {
            displayMessage(request.responseText, "error");
        }
    });
}

function checkAndHandleMessageFromHeader(request) {
    var msg = request.getResponseHeader('X-Message');
    if (msg) {
        displayMessage(msg, request.getResponseHeader('X-Message-Type'));
    }
}