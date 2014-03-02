$.widget("NS.RequestsGridWidget",
{
    options: {
        gridUrl: null,
        statusOptionsUrl: null,
    },
    load: function () {
        this._initAplicationUIActions();
    },
    _initAplicationUIActions: function () {
        var self = this;

        var $grid = $(self.element);

        $grid.Grid(
             {
                 rowNum: 20,
                 rowList: [10, 20, 50, 100],
                 sortorder: 'asc',
                 sortname: 'SendDate',
                 gridUrl: self.options.gridUrl,
                 colNames: [
                            languagePack['Scripts.app.widgets.RequestsGridWidget.js.BrojNaBaranje'],
                            languagePack['Scripts.app.widgets.RequestsGridWidget.js.ArhivskiBroj'],
                            languagePack['Scripts.app.widgets.RequestsGridWidget.js.Status'],
                            languagePack['Scripts.app.widgets.RequestsGridWidget.js.TipNaBaranje'],
                            languagePack['Scripts.app.widgets.RequestsGridWidget.js.TipNaBaranje'],
                            languagePack['Scripts.app.widgets.RequestsGridWidget.js.InvestitorIme'],
                            languagePack['Scripts.app.widgets.RequestsGridWidget.js.InvestitorAdresa'],
                            languagePack['Scripts.app.widgets.RequestsGridWidget.js.Opstina'],
                            languagePack['Scripts.app.widgets.RequestsGridWidget.js.Pristignato'],
                            languagePack['Scripts.app.widgets.RequestsGridWidget.js.Odgovoren'], ''],
                 colModel: [
                     {
                         name: 'RequestId',
                         index: 'RequestId',
                         align: 'center',
                         hidden: true
                     },
                      {
                          name: 'ArchiveNumber',
                          index: 'ArchiveNumber',
                          align: 'center'
                      },
                  {
                      name: 'StateTag',
                      index: 'StateTag',
                      align: 'center',
                      formatter: stateFormatter,
                      searchoptions: {
                          sopt: ['eq'],
                          dataUrl: self.options.statusOptionsUrl,
                          buildSelect: function (data) {

                              var listItems = JSON.parse(data);

                              var result = '<select>';
                              var nullItem = NS.Utils.String.format('<option value="{0}">{1}</option>', "", languagePack['eDozvoli.Web.framework.ns.controls.Site']);//"Сите..."
                              result += nullItem;

                              for (var i = 0; i < listItems.length; i++) {
                                  var item = listItems[i];
                                  var itm = NS.Utils.String.format('<option value="{0}">{1}</option>', item.StateTag, stateFormatter(item.StateTag));
                                  result += itm;
                              }

                              result += '</select>';
                              return result;

                          }
                      },
                      stype: 'select'
                  },
                       {
                           name: 'RequestTypeId',
                           index: 'RequestTypeId',
                           align: 'center',
                           hidden: true
                       },
                     {
                         name: 'RequestTypeName',
                         index: 'RequestTypeName',
                         align: 'center',
                         hidden: true
                     },
                     {
                         name: 'InvestorName',
                         index: 'InvestorName',
                         align: 'center',
                         search: false,
                         sortable: false
                     },
                        {
                            name: 'InvestorAddress',
                            index: 'InvestorAddress',
                            align: 'center',
                            search: false,
                            sortable: false
                        },
                       {
                           name: 'Municipalities',
                           index: 'Municipalities',
                           align: 'center',
                           search: false,
                           sortable: false
                       },
                       {
                           name: 'SendDate',
                           index: 'SendDate',
                           align: 'center',
                           formatter: 'date',
                           formatoptions: {
                               newformat: 'd.m.Y'
                           },
                           searchoptions: {
                               sopt: ['date?:eq']
                           }
                       },
                       {
                           name: 'AssignedTo',
                           index: 'AssignedTo',
                           align: 'center',
                           hidden: !window.currentUser.isRakovoditel(),
                           searchoptions: {
                               sopt: ['eq'],
                               dataUrl: baseUrl + 'Admin/Requests/GetAllEmployers',
                               buildSelect: function (data) {

                                   var listItems = JSON.parse(data);

                                   var result = '<select>';
                                   var nullItem = NS.Utils.String.format('<option value="{0}">{1}</option>', "", languagePack['eDozvoli.Web.framework.ns.controls.Site']);//"Сите..."
                                   result += nullItem;

                                   for (var i = 0; i < listItems.length; i++) {
                                       var item = listItems[i];
                                       var itm = NS.Utils.String.format('<option value="{0}">{1}</option>', item.Id, item.FirstName + ' ' + item.LastName);
                                       result += itm;
                                   }

                                   result += '</select>';
                                   return result;

                               }
                           },
                           stype: 'select'
                       },
                     {
                         name: 'Actions',
                         index: 'Actions',
                         sortable: false,
                         search: false,
                         editable: false,
                         title: false,
                         align: 'center',
                         width: '120px'
                     }
                 ],

                 doubleClickHandler: function (rowId) {
                     var rowData = $grid.Grid("getRowData", rowId);
                     var requestId = rowData.RequestId;
                     window.location.href = baseUrl + 'Admin/Requests/Details/' + requestId;
                 },
                 hasFilterToolbar: true,
                 resizeContainer: $("#requests_tabs"),
                 windowHeightMinus: 330,
                 userCanModifyRecord: false,
                 gridComplete: function () {
                     var ids = $grid.Grid("getDataIDs");
                     for (var i = 0; i < ids.length; i++) {
                         var rowId = ids[i];
                         var rowData = $grid.Grid("getRowData", rowId);

                         var actions = '';
                         actions = actions + '<button type="button" data-id="' + rowData.RequestId + '" class="view-details details-ico btn btn-link">' + languagePack['Scripts.app.widgets.RequestsGridWidget.js.Detali'] + '</button>';

                         //if (window.currentUser.isRakovoditel()) {
                         //    //samo rakovoditel moze da dodeli predmet
                         //    actions = actions + " | " + '<button type="button" data-id="' + rowData.RequestId + '" class="define-employe-request btn btn-link">Додели предмет</button>';
                         //}

                         $grid.Grid('setRowData', { Id: rowId, Actions: actions });

                         $(".view-details", $grid).bind('click', function () {
                             var requestId = $(this).data('id');
                             window.location.href = baseUrl + 'Admin/Requests/Details/' + requestId;
                         });

                         //if (window.currentUser.isRakovoditel()) {
                         //    //samo rakovoditel moze da dodeli predmet
                         //    $(".define-employe-request", $grid).bind('click', function () {
                         //        var requestId = $(this).data('id');
                         //        var holder = $.createWidgetHolder();
                         //        $(holder).DefineEmployeeForRequestWidget({});
                         //        $(holder).DefineEmployeeForRequestWidget("load", requestId);
                         //    });
                         //}
                     }
                 }
             }
        );

        function stateFormatter(cellvalue, options, rowObject) {
            return window.languagePack["eDozvoli.Web.States.Name." + cellvalue + ""];
        }
        $grid.Grid("load");

        $("#refreshGrid").bind('click', function () {
            $("#refresh_component_action_required_grid_grid").click();
        });

    },
    destroy: function () {
        this.options.viewModel = null;
        $(this.element).empty();
        $.Widget.prototype.destroy.call(this);
    }
});
