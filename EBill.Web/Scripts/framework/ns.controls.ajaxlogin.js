$(function () {
    $(document).ajaxError(function (event, request, settings) {
        if (request.status === 401) {
            window.location.href = baseUrl + "/Account/Login";
        }
    });
});

