NS.Repository.Lookups = {};

NS.Repository.Lookups.GetAllPos = function () {
    var rawData = null;
    NS.Utils.AJAX.post(
        baseUrl + 'Lookups/GetAllPos',
        null,
        function (data) {
            rawData = data;
        },
        null,
        false
    );
    return rawData;
};

NS.Repository.Lookups.GetAllUsers = function () {
    debugger;
    var rawData = null;
    NS.Utils.AJAX.post(
        baseUrl + 'Lookups/GetAllUsers',
        null,
        function (data) {
            rawData = data;
        },
        null,
        false
    );
    debugger;
    return rawData;
};





