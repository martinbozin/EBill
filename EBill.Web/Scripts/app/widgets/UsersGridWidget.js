$.widget("NS.UsersGridWidget",
{
    options: {
        gridUrl: null,
        languagesLoookupUrl: null,
        instututionsLoookupUrl: null,
        posLoookupUrl: null,
        resetPassword: false,
        addRoles: false,
        addPoses: false
    },
    load: function () {
        this._initAplicationUIActions();
    },
    _initAplicationUIActions: function () {
        var self = this;

        var hasInstututions = (self.options.instututionsLoookupUrl != null);
        debugger;
        var $grid = $(self.element);
        $grid.Grid(
             {
                 rowNum: 20,
                 rowList: [10, 20, 50, 100],
                 gridUrl: self.options.gridUrl,
                 colNames: ['Корисничко име', 'Име', 'Презиме','Јазик', 'Јазик', 'Активен', 'Акции'],
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
                    //{
                    //    name: 'PosId',
                    //    index: 'PosId',
                    //    search: true,
                    //    //editable: hasInstututions,
                    //    edittype: 'select',
                    //    editoptions: {
                    //        dataUrl: self.options.posLoookupUrl,
                    //        buildSelect: function (data) {
                    //            var select = NS.Controls.JQGRID.buildLoookupDropDown(data, false);
                    //            return select;
                    //        }
                    //    },
                    //    editrules: {
                    //        //edithidden: hasInstututions,
                    //        required: true
                    //    },
                    //    hidden: true,
                    //    align: 'center'
                    //},
                    // {
                    //     name: 'Pos',
                    //     index: 'Pos',
                    //     sortable: true,
                    //     searchoptions: {
                    //         sopt: ['eq'],
                    //         dataUrl: self.options.posLoookupUrl,
                    //         buildSelect: function (data) {
                    //             var select = NS.Controls.JQGRID.buildLoookupDropDown(data, true);
                    //             return select;
                    //         }
                    //     },
                    //     editable: true,
                    //     edittype: 'select',
                    //     editoptions: {
                    //         dataUrl: self.options.posLoookupUrl,
                    //         buildSelect: function (data) {
                    //             var select = NS.Controls.JQGRID.buildLoookupDropDown(data, false);
                    //             return select;
                    //         }
                    //     },
                    //     editrules: {
                    //         edithidden: false
                    //     },
                    //     //hidden: !hasInstututions,
                    //     align: 'left'
                    // },
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
                         name: 'IsActive',
                         index: 'IsActive',
                         sortable: true,
                         search: true,
                         editable: true,
                         searchoptions: {
                             sopt: ['eq'],
                             value: ":" + "Сите" + ";true:" + "Да" + ";false:" + "Не" + ""
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
                 addCaption: "Нов корисник",
                 editCaption: "Промени корисник",
                 hasFilterToolbar: true,
                 windowHeightMinus: 350,
                 gridComplete: function () {
                     var ids = $grid.Grid("getDataIDs");
                     for (var i = 0; i < ids.length; i++) {
                         var rowId = ids[i];
                         var actions = '';
                         if (self.options.addRoles) {
                             actions = actions + '<button type="button" data-id="' + rowId + '" class="set-roles btn btn-link">' + "Улоги" + '</button>';
                         }
                         debugger;
                         //var rowData = $grid.Grid("getRowData", rowId);
                         if (self.options.addPoses) {
                             if (actions != '') {
                                 actions = actions + ' | ';
                             }
                             debugger;
                             actions = actions + '<button type="button" data-id="' + rowId + '" class="set-poses btn btn-link">' + "POS" + '</button>';
                         }
                         
                         if (self.options.resetPassword) {
                             if (actions != '') {
                                 actions = actions + ' | ';
                             }
                             actions = actions + '<button type="button" data-id="' + rowId + '" class="reset-password btn btn-link">' + "Рестартирај лозинка" + '</button>';
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
                     
                     $(".set-poses", $grid).bind('click', function () {
                         var userId = $(this).data('id');
                         var holder = $.createWidgetHolder();
                         $(holder).DefinePosWidget({});
                         $(holder).DefinePosWidget("load", userId);
                     });

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
