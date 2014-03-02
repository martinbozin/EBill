NS.ViewModels.UsersGridRoleFilterViewModel = function () {
    var self = this;
    self.AvailableRoles = ko.observableArray();
    self.Init = function () {

        var item = new NS.ViewModels.RoleViewModel();
        item.RoleName('');
        item.RoleNameTrans(window.languagePack['Admin.Users.Index.cshtml.Site']);//'Сите'
        self.AvailableRoles.push(item);

        var roles = NS.Repository.Roles.GetAllowedAdminRoles();
        for (var i = 0; i < roles.length; i++) {
            if (roles[i].RoleName() != "") {
                var translate = window.languagePack['Admin.Users.Index.cshtml.' + roles[i].RoleName() + ''];//' + roles[i].RoleName() + '
                roles[i].RoleNameTrans(translate);
            }

            self.AvailableRoles.push(roles[i]);
        }

    };
}