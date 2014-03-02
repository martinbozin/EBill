$.widget("NS.UsersGridWidget",
{
    options: {
        gridUrl: null,
        languagesLoookupUrl: null,
        instututionsLoookupUrl: null,
        resetPassword: false,
        addRoles: false
    },
    load: function () {
        this._initAplicationUIActions();
    },
    _initAplicationUIActions: function () {
        var self = this;

        var hasInstututions = (self.options.instututionsLoookupUrl != null);

        var $grid = $(self.element);
        $grid.Grid(
             {
                 rowNum: 20,
                 rowList: [10, 20, 50, 100],
                 gridUrl: self.options.gridUrl,
                 colNames: [languagePack['Scripts.app.widgets.UsersGridWidget.js.KorisnickoIme'], languagePack['Scripts.app.widgets.UsersGridWidget.js.Ime'], languagePack['Scripts.app.widgets.UsersGridWidget.js.Prezime'], languagePack['Scripts.app.widgets.UsersGridWidget.js.Jazik'], languagePack['Scripts.app.widgets.UsersGridWidget.js.Jazik'], languagePack['Scripts.app.widgets.UsersGridWidget.js.Institucija'], languagePack['Scripts.app.widgets.UsersGridWidget.js.Institucija'], languagePack['Scripts.app.widgets.UsersGridWidget.js.Aktiven'], ''],
                 colModel: [
                     {
                         name: 'UserName',
                         index: 'UserName',
                         sortable: true,
                         search: true,
                         searchoptions: {
                             sopt: ['cn']
                         },
                         editable: true,
                         editoptions: {
                             size: 40,
                             maxlength: 255
                         },
                         editrules: {
                             required: true,
                             email: true
                         },
                     },
                     {
                         name: 'FirstName',
                         index: 'FirstName',
                         sortable: true,
                         search: true,
                         searchoptions: {
                             sopt: ['cn']
                         },
                         editable: true,
                         editoptions: {
                             size: 40,
                             maxlength: 255
                         },
                         editrules: {
                             required: true
                         },
                     },
                     {
                         name: 'LastName',
                         index: 'LastName',
                         sortable: true,
                         search: true,
                         editable: true,
                         editoptions: {
                             size: 20,
                             maxlength: 20
                         },
                         editrules: {
                             required: true
                         },
                     },
                     {
                         name: 'PreferedLanguage',
                         index: 'PreferedLanguage',
                         search: true,
                         editable: true,
                         edittype: 'select',
                         editoptions: {
                             dataUrl: self.options.languagesLoookupUrl,
                             buildSelect: function (data) {
                                 var select = NS.Controls.JQGRID.buildLoookupDropDown(data, false);
                                 return select;
                             }
                         },
                         editrules: {
                             edithidden: true,
                             required: true
                         },
                         hidden: true,
                         align: 'center'
                     },
                     {
                         name: 'PreferedLanguageName',
                         index: 'PreferedLanguage.Id',
                         searchoptions: {
                             sopt: ['eq'],
                             dataUrl: self.options.languagesLoookupUrl,
                             buildSelect: function (data) {
                                 var select = NS.Controls.JQGRID.buildLoookupDropDown(data, true);
                                 return select;
                             }
                         },
                         stype: 'select',
                         editrules: {
                             edithidden: false
                         },
                         align: 'center'
                     },
                     {
                         name: 'InstitutionId',
                         index: 'Institution.Id',
                         search: true,
                         editable: hasInstututions,
                         edittype: 'select',
                         editoptions: {
                             dataUrl: self.options.instututionsLoookupUrl,
                             buildSelect: function (data) {
                                 var select = NS.Controls.JQGRID.buildLoookupDropDown(data, false);
                                 return select;
                             }
                         },
                         editrules: {
                             edithidden: hasInstututions,
                             required: true
                         },
                         hidden: true,
                         align: 'center'
                     },
                     {
                         name: 'InstitutionName',
                         index: 'Institution.Name',
                         searchoptions: {
                             sopt: ['eq'],
                             dataUrl: self.options.instututionsLoookupUrl,
                             buildSelect: function (data) {
                                 var select = NS.Controls.JQGRID.buildLoookupDropDown(data, true);
                                 return select;
                             }
                         },
                         stype: 'select',
                         editrules: {
                             edithidden: false
                         },
                         hidden: !hasInstututions,
                         align: 'left'
                     },
                     {
                         name: 'IsActive',
                         index: 'IsActive',
                         sortable: true,
                         search: true,
                         editable: true,
                         searchoptions: {
                             sopt: ['eq'],
                             value: ":" + languagePack['eDozvoli.Web.Grids.Site'] + ";true:" + languagePack['eDozvoli.Web.Grids.Da'] + ";false:" + languagePack['eDozvoli.Web.Grids.Ne'] + ""
                         },
                         stype: 'select',
                         formatter: 'checkbox',
                         edittype: 'checkbox',
                         editoptions: {
                             value: "True:False",
                             defaultValue: function () {
                                 return 'True';
                             }
                         },
                         editrules: {
                             required: true
                         },
                         align: 'center'
                     },
                     {
                         name: 'Actions',
                         index: 'Actions',
                         sortable: false,
                         search: false,
                         editable: false,
                         title: false,
                         align: 'center'
                     }
                 ],
                 addCaption: languagePack['Scripts.app.widgets.UsersGridWidget.js.NovKorisnik'],
                 editCaption: languagePack['Scripts.app.widgets.UsersGridWidget.js.PromeniKorisnik'],
                 hasFilterToolbar: true,
                 windowHeightMinus: 350,
                 gridComplete: function () {
                     var ids = $grid.Grid("getDataIDs");
                     for (var i = 0; i < ids.length; i++) {
                         var rowId = ids[i];
                         var actions = '';
                         if (self.options.addRoles) {
                             actions = actions + '<button type="button" data-id="' + rowId + '" class="set-roles btn btn-link">' + languagePack['Scripts.app.widgets.UsersGridWidget.js.Ulogi'] + '</button>';
                         }
                         if (self.options.resetPassword) {
                             if (actions != '') {
                                 actions = actions + ' | ';
                             }
                             actions = actions + '<button type="button" data-id="' + rowId + '" class="reset-password btn btn-link">' + languagePack['Scripts.app.widgets.UsersGridWidget.js.ResetirajLozinka'] + '</button>';
                         }

                         $grid.Grid('setRowData', { Id: rowId, Actions: actions });
                     }

                     if (self.options.resetPassword) {
                         $(".reset-password", $grid).bind('click', function () {
                             var userId = $(this).data('id');
                             var holder = $.createWidgetHolder();
                             $(holder).ResetPasswordWidget({});
                             $(holder).ResetPasswordWidget("load", userId);
                         });
                     }

                     if (self.options.addRoles) {
                         $(".set-roles", $grid).bind('click', function () {
                             var userId = $(this).data('id');
                             var holder = $.createWidgetHolder();
                             $(holder).SetRolesWidget({});
                             $(holder).SetRolesWidget("load", userId);
                         });
                     }
                 }
             }
        );
        $grid.Grid("load");

        $("#addUser").bind('click', function () {
            $("#add_component_users_grid_grid").click();
        });

        $(document).on('on-row-filter-element-click', function (event, prm) {
            $grid.Grid("reloadWithParams", { roleName: prm });
        });
    },
    destroy: function () {
        this.options.viewModel = null;
        $(this.element).empty();
        $.Widget.prototype.destroy.call(this);
    }
});
