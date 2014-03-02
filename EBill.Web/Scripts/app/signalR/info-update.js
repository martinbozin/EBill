$(function () {
    var chat = $.connection.chat;

    chat.client.send = function (message) {
        displayMessage(message, 'Warning');
    };

    $.connection.hub.start().done(function () {
        //init here
        $("#btn-send-message", "#notify-users").click(function () {
            var message = $('#txt-message', "#notify-users").val();
            if (message != undefined && message.length > 0)
                chat.server.send(message);
        });
    });
});