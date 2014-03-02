NS.Repository.Pos = {};


NS.Repository.Pos.GetSelectedPos = function (userId) {
    var rawData = null;
    debugger;
    NS.Utils.AJAX.post(
        baseUrl + 'SuperAdmin/MasterAdmins/GetSelectedPos',
        {
            userId: userId
        },
        function (data) {
            rawData = data;
        },
         function (response) {
             NS.Utils.AJAX.parseErors(response, document);
         },
        false
    );
    return rawData;
};


NS.Repository.Pos.SetSelectedPos = function (userId, selectedPos, ctx) {
    var rawData = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SuperAdmin/MasterAdmins/SetSelectedPos',
        {
            userId: userId,
            selectedPos: selectedPos
        },
        function (data) {
            rawData = data;
        },
        function (response) {
            NS.Utils.AJAX.parseErors(response, ctx);
        },
        false
    );
    return rawData;
};




NS.Repository.Pos.SetSelectedPosToNull = function (userId, ctx) {
    var rawData = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SuperAdmin/MasterAdmins/SetSelectedPosToNull',
        {
            userId: userId
 
        },
        function (data) {
            rawData = data;
        },
        function (response) {
            NS.Utils.AJAX.parseErors(response, ctx);
        },
        false
    );
    return rawData;
};


NS.Repository.Pos.GetSelectedUsersForPos = function (posId) {
    var rawData = null;
    debugger;
    NS.Utils.AJAX.post(
        baseUrl + 'SuperAdmin/MasterAdmins/GetSelectedUsersForPos',
        {
            posId: posId
        },
        function (data) {
            rawData = data;
        },
         function (response) {
             NS.Utils.AJAX.parseErors(response, document);
         },
        false
    );
    return rawData;
};



NS.Repository.Pos.GetNotSelectedUsersForPos = function (posId) {
    var rawData = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SuperAdmin/MasterAdmins/GetNotSelectedUsersForPos',
        {
            posId: posId
        },
        function (data) {
            rawData = data;
        },
        null,
        false
    );
    return rawData;
};

NS.Repository.Pos.SetSelectedUserForPos = function (posId, selectedUsers, ctx) {
    debugger;
    var rawData = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SuperAdmin/MasterAdmins/SetSelectedUserForPos',
        {
            posId: posId,
            selectedUsers: selectedUsers
        },
        function (data) {
            rawData = data;
        },
        function (response) {
            NS.Utils.AJAX.parseErors(response, ctx);
        },
        false
    );
    return rawData;
};
NS.Repository.Pos.SetSelectedUserForPosToNull = function (posId, ctx) {
    debugger;
    var rawData = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SuperAdmin/MasterAdmins/SetSelectedUserForPosToNull',
        {
            posId: posId,
 
        },
        function (data) {
            rawData = data;
        },
        function (response) {
            NS.Utils.AJAX.parseErors(response, ctx);
        },
        false
    );
    return rawData;
};

NS.Repository.Pos.GetAllUsers = function () {
    debugger;
    var rawData = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SuperAdmin/MasterAdmins/GetAllUsers',
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
