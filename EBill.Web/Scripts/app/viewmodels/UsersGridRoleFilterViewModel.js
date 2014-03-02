NS.ViewModels.UsersGridRoleFilterViewModel = function () {
    var self = this;
    self.AvailableRoles = ko.observableArray();
    self.Init = function () {

        var item = new NS.ViewModels.RoleViewModel();
        item.RoleName('');
        item.RoleNameTrans("Сите");//'Сите'
        self.AvailableRoles.push(item);
        debugger;
        var roles = NS.Repository.Roles.GetAllowedAdminRoles();
        for (var i = 0; i < roles.length; i++) {
            if (roles[i].RoleName() != "") {
                var translate =  roles[i].RoleName();//' + roles[i].RoleName() + '
                roles[i].RoleNameTrans(translate);
            }

            self.AvailableRoles.push(roles[i]);
        }

    };
}