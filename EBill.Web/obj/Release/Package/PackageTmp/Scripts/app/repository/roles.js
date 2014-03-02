NS.Repository.Roles = {};

NS.Repository.Roles.MapToViewModel = function (data) {
    var mappedData = ko.utils.arrayMap(data, function (item) {
        var viewModel = new NS.ViewModels.RoleViewModel();
        viewModel.MapFromDataRow(item);
        return viewModel;
    });
    return mappedData;
};

NS.Repository.Roles.GetAllowedAdminRoles = function () {
    var rawData = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SharedRoles/GetAllowedAdminRoles'
        , null
        , function (data) {
            rawData = data;
        },
        null,
        false
    );
    var mappedData = NS.Repository.Roles.MapToViewModel(rawData);
    return mappedData;
};

NS.Repository.Roles.GetRolesForUser = function (userId) {
    var rawData = null;
    NS.Utils.AJAX.post(
        baseUrl + 'SharedRoles/GetRolesForUser'
        , { userId: userId }
        , function (data) {
            rawData = data;
        },
        null,
        false
    );
    var mappedData = NS.Repository.Roles.MapToViewModel(rawData);
    return mappedData;
};