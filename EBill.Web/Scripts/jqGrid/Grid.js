(function ($) {

    $.widget("FZOM.Grid",
    {
        options: {
            gridId: '',
            pagerId: '',
            gridUrl: '',
            height: 600,
            rowNum: -1,
            rowList: [],
            userCanModifyRecord: true,
            userCanAddRecord: true,
            userCanDeleteRecord: true,
            hasFilterToolbar: true,
            searchOnEnter: false,
            colNames: null,
            colModel: null,
            addCaption: '',
            editCaption: '',
            resize: true,
            popupWidth: 500,
            popupHeight: 500,
            dataheight: 400,
            sortorder: 'asc',
            sortname: '',
            crudOperation: false,
            selectedRow: null,
            subGrid: false,
            subGridRowExpanded: null,
            multiselect: false,
            savemultiselectState: false,
            editOptions: {
                addCaption: "",
                editCaption: "",
                position: 'center',
                width: 550,
                height: 150,
                dataheight: 75,
                recreateForm: true,
                reloadAfterSubmit: true,
                closeAfterAdd: true,
                closeAfterEdit: true,
                modal: true,
                resize: false,
                url: '',
                checkOnUpdate: false,
                closeOnEscape: true,
                beforeShowForm: function (form) {
                    form.keydown(function (e) {
                        if (e.which == 13) {
                            $("#sData").click();
                        }
                    });
                },
                serializeEditData: function (data) {
                    if (data.oper === "add") {
                        return $.param($.extend({}, data, { id: 0 }));
                    }
                    else
                        return $.param(data);
                },
                errorTextFormat: function (data) {

                    var itemError = null;
                    try {
                        if (data.responseText)
                            itemError = JSON.parse(data.responseText);
                        else
                            itemError = JSON.parse(data);
                    }
                    catch (e) {
                        itemError = null;
                    }

                    if (itemError === null) {
                        if (data.status == 409) {
                            return data.responseText;
                        }
                        else {
                            return " Status: '" + data.statusText + "'. Error code: " + data.status;
                        }
                    }

                    if (itemError.ErrorMessage) {

                        try {
                            return itemError.ErrorMessage;
                        } catch (e) {
                        }
                    }

                    if (itemError.Errors) {
                        var errorString = "";
                        var items = $.map(itemError.Errors, function (item) {
                            return item;
                        });
                        for (i = 0; i < items.length; i++)
                            errorString += items[i] + "<br/>";

                        return errorString;
                    }

                    return " Status: '" + data.statusText + "'. Error code: " + data.status;
                }
            }
        },
        reloadWithParams: function (postData) {
            try {
                $(this.options.gridId).jqGrid('setGridParam', { postData: postData }).trigger('reloadGrid');
            }
            catch (e) {
                console.log(e);
            }
        },
        reload: function () {
            try {
                $(this.options.gridId).jqGrid().trigger('reloadGrid');
            }
            catch (e) {
                console.log(e);
            }
        },
        editRow: function (rowid, params) {
            var editparameters = {
                "keys": false,
                "oneditfunc": null,
                "successfunc": null,
                "url": null,
                "extraparam": {},
                "aftersavefunc": null,
                "errorfunc": null,
                "afterrestorefunc": null,
                "restoreAfterError": true,
                "mtype": "POST"
            };
            $.extend(true, editparameters, params);
            $(this.options.gridId).jqGrid('editRow', rowid, editparameters);
        },
        saveRow: function (rowid, params) {
            var saveparameters = {
                "successfunc": null,
                "url": null,
                "extraparam": {},
                "aftersavefunc": null,
                "errorfunc": null,
                "afterrestorefunc": null,
                "restoreAfterError": true,
                "mtype": "POST"
            };

            $.extend(true, saveparameters, params);
            $(this.options.gridId).jqGrid('saveRow', rowid, saveparameters);
        },
        restoreRow: function (rowid, params) {
            var restoreparameters = {
                "afterrestorefunc": null
            };

            $.extend(true, restoreparameters, params);
            $(this.options.gridId).jqGrid('restoreRow', rowid, restoreparameters);
        },
        setSelection: function (rowid, isSelected) {
            $(this.options.gridId).setSelection(rowid, isSelected);
        },
        selectedRow: function () {
            return $(this.options.gridId).jqGrid('getGridParam', 'selrow');
        },
        selectedRows: function () {
            return $(this.options.gridId).jqGrid('getGridParam', 'selarrrow');
        },
        getRowData: function (id) {
            var returnData = $(this.options.gridId).jqGrid("getRowData", id);
            return returnData;
        },
        getDataIDs: function () {
            var ids = $(this.options.gridId).jqGrid('getDataIDs');
            return ids;
        },
        setRowData: function (data) {
            var id = data.Id;
            $(this.options.gridId).jqGrid("setRowData", id, data);
        },
        addRowData: function (data) {
            var id = data.Id;
            $(this.options.gridId).jqGrid("addRowData", id, data, 'last');
        },
        addFilterButton: function (params) {
            jQuery(this.options.gridId).jqGrid('navGrid', this.options.pagerId).jqGrid('navButtonAdd', this.options.pagerId, params);
        },
        load: function () {
            var element = this.element;
            this.options.editOptions.url = this.options.gridUrl + "Operation";
            this.options.gridId = "" + $(element).attr("id") + "_" + "grid";
            this.options.pagerId = "" + $(element).attr("id") + "_" + "pager";
            $(element).append("<table id='" + this.options.gridId + "'></table>");
            $(element).append("<div id='" + this.options.pagerId + "'></div>");

            this.options.gridId = "#" + this.options.gridId;
            this.options.pagerId = "#" + this.options.pagerId;
            var self = this;
            this.options.editOptions.height = this.options.popupHeight;
            this.options.editOptions.width = this.options.popupWidth;
            this.options.editOptions.dataheight = this.options.dataheight;
            this.options.editOptions.addCaption = this.options.addCaption;
            this.options.editOptions.editCaption = this.options.editCaption;


            var afterShowForm = this.options.afterShowForm;
            this.options.editOptions.afterShowForm = function (form) {
                var dlgDiv = $(".ui-jqdialog");
                var parentDiv = dlgDiv.parent(); // div#gbox_list
                var dlgWidth = dlgDiv.width();
                var parentWidth = parentDiv.width();
                var dlgHeight = dlgDiv.height();
                var parentHeight = parentDiv.height();
                dlgDiv[0].style.top = Math.round((parentHeight - dlgHeight) / 2) + "px";
                dlgDiv[0].style.left = Math.round((parentWidth - dlgWidth) / 2) + "px";
                if (afterShowForm) {
                    afterShowForm(form);
                }
            };

            var onclickPgButtons = this.options.onclickPgButtons;
            this.options.editOptions.onclickPgButtons = function (which, formid, rowid) {
                if (onclickPgButtons) {
                    onclickPgButtons(which, formid, rowid);
                }
            };

            var beforeShowForm = this.options.beforeShowForm;
            this.options.editOptions.beforeShowForm = function (form) {
                if (beforeShowForm) {
                    beforeShowForm(form);
                }
            };

            var afterclickPgButtons = this.options.afterclickPgButtons;
            this.options.editOptions.afterclickPgButtons = function (which, formid, rowid) {
                if (afterclickPgButtons) {
                    afterclickPgButtons(which, formid, rowid);
                }
            };

            this.options.editOptions.onClose = function (form) {
                $(self.options.gridId).focus();
                if (self.options.selectedRow != null) {
                    $("#" + self.options.selectedRow).effect("highlight", { color: "Red" }, 400);
                }
                return true;
            };

            this.options.editOptions.editData = this.options.editData;

            this.options.editOptions.afterSubmit = function (response, postdata) {

                if (response.status === 200) {
                    switch (postdata.oper) {
                        case "del":
                            {
                                self.options.crudOperation = true;
                                self.options.selectedRow = null;
                            }
                            break;
                        case "add":
                            {
                                self.options.crudOperation = true;
                                var addItem = null;
                                if (response.responseText)
                                    addItem = JSON.parse(response.responseText);
                                else
                                    addItem = JSON.parse(response);

                                self.options.selectedRow = addItem.Id;
                            }
                            break;

                        case "edit":
                            {
                                self.options.crudOperation = true;
                                var editItem = null;
                                if (response.responseText)
                                    editItem = JSON.parse(response.responseText);
                                else
                                    editItem = JSON.parse(response);

                                self.options.selectedRow = editItem.Id;
                            }
                            break;
                        default:
                            break;
                    }
                }
                return [true, "", ""];
            };

            var idsOfSelectedRows = [], updateIdsOfSelectedRows = function (id, isSelected) {
                var index = $.inArray(id, idsOfSelectedRows);
                if (!isSelected && index >= 0) {
                    idsOfSelectedRows.splice(index, 1); // remove id from the list
                } else if (index < 0) {
                    idsOfSelectedRows.push(id);
                }
            };

            $(this.options.gridId).jqGrid({
                url: this.options.gridUrl,
                datatype: "json",
                mtype: "POST",
                autowidth: true,
                autoencode: false,
                loadonce: false,
                hidegrid: false,
                viewrecords: true,
                height: this.options.height,
                colNames: this.options.colNames,
                colModel: this.options.colModel,
                rowNum: this.options.rowNum,
                rowList: this.options.rowList,
                multiselect: this.options.multiselect,
                pager: this.options.pagerId,
                caption: '',
                sortname: this.options.sortname,
                sortorder: this.options.sortorder,
                postData: this.options.postData,
                subGrid: this.options.subGrid,
                subGridRowExpanded: this.options.subGridRowExpanded,
                jsonReader: {
                    root: "Rows",
                    page: "Page",
                    total: "Total",
                    records: "Records",
                    repeatitems: false,
                    cell: "cell",
                    id: "Id",
                    userdata: "userdata",
                    subgrid: {
                        root: "rows",
                        repeatitems: false,
                        cell: "cell"
                    }
                },
                ondblClickRow: function (rowid, iRow, iCol, e) {
                    self.options.selectedRow = rowid;

                    if (self.options.userCanModifyRecord) {
                        $(self.options.gridId).jqGrid('editGridRow', rowid, self.options.editOptions);
                    }

                    if (self.options.doubleClickHandler) {
                        self.options.doubleClickHandler(rowid);
                    }

                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                },
                editurl: this.options.gridUrl,
                ajaxSelectOptions: {
                    type: 'POST',
                    contentType: "application/json"
                },
                onSelectRow: function (id, isSelected) {
                    if (self.options.savemultiselectState) {
                        updateIdsOfSelectedRows(id, isSelected);
                    }

                    if (self.options.onRowSelected) {
                        self.options.onRowSelected(id, isSelected);
                    }
                },
                onSelectAll: function (aRowids, isSelected) {
                    if (self.options.savemultiselectState) {
                        var i, count, id;
                        for (i = 0, count = aRowids.length; i < count; i++) {
                            id = aRowids[i];
                            updateIdsOfSelectedRows(id, isSelected);
                        }
                    }

                    if (self.options.onSelectAll) {
                        self.options.onSelectAll(aRowids, isSelected);
                    }
                },
                loadComplete: function () {

                    if (self.options.savemultiselectState) {
                        var i, count;
                        for (i = 0, count = idsOfSelectedRows.length; i < count; i++) {
                            $(self.options.gridId).jqGrid('setSelection', idsOfSelectedRows[i], false);
                        }
                    }

                    if (self.options.loadComplete) {
                        self.options.loadComplete(self.options.gridId);
                    }
                },
                afterInsertRow: function (rowId, rowData, rowElem) {
                    if (self.options.afterInsertRow) {
                        self.options.afterInsertRow(rowId, rowData, rowElem);
                    }
                },
                serializeGridData: function (postData) {
                    var serializeGridData = self.options.serializeGridData;
                    if (serializeGridData) {
                        return serializeGridData(postData);
                    }
                    return postData;
                },
                gridComplete: function () {

                    if (self.options.crudOperation) {
                        $(self.options.gridId).focus();
                        if (self.options.selectedRow != null) {
                            $(self.options.gridId).setSelection(self.options.selectedRow, true);
                        }
                        else {
                            var topRow = $(self.options.gridId).getDataIDs()[0];
                            if (topRow != null) {
                                self.options.selectedRow = topRow;
                                $(self.options.gridId).setSelection(topRow, true);
                            }
                        }

                        if (self.options.selectedRow != null) {
                            $("#" + self.options.selectedRow).effect("highlight", { color: "Red" }, 400);
                        }
                    }
                    self.options.crudOperation = false;

                    var gridComplete = self.options.gridComplete;
                    if (gridComplete) {
                        return gridComplete();
                    }
                }
            });

            if (!this.options.userCanModifyRecord) {
                this.options.editOptions = null;
            }

            var deleteValue = true;
            if (!this.options.userCanDeleteRecord) {
                deleteValue = false;
            }
            else if (!this.options.userCanModifyRecord) {
                deleteValue = false;
            }

            var addValue = true;
            if (!this.options.userCanAddRecord) {
                addValue = false;
            }
            else if (!this.options.userCanModifyRecord) {
                addValue = false;
            }

            var editValue = this.options.userCanModifyRecord;

            $(this.options.gridId).navGrid(
                this.options.pagerId,
                {
                    del: deleteValue,
                    add: addValue,
                    edit: editValue,
                    search: false
                }, this.options.editOptions, this.options.editOptions, this.options.editOptions);

            if (this.options.hasFilterToolbar) {
                $(this.options.gridId).jqGrid('filterToolbar', { stringResult: true, searchOnEnter: this.options.searchOnEnter });
            }

            if (self.options.resize) {

                $(window).bind('resize', function () {
                    // Get width of parent container
                    window.setTimeout(function () {

                        var width;
                        var targetContainer;
                        if (self.options.resizeContainer) {
                            targetContainer = self.options.resizeContainer;
                            width = targetContainer.width();
                            width = width - 32; // Fudge factor to prevent horizontal scrollbars
                        } else {
                            targetContainer = $(self.element).parent().parent().parent();
                            width = targetContainer.width();
                        }

                        if (width > 0 && Math.abs(width - jQuery(self.options.gridId).width()) > 5) {
                            jQuery(self.options.gridId).setGridWidth(width);
                        }

                        if (self.options.windowHeightMinus != undefined) {
                            $(self.options.gridId).setGridHeight($(window).height() - self.options.windowHeightMinus);
                        }

                        //if (self.options.forceHeight != undefined) {
                        //    $(self.options.gridId).setGridHeight(self.options.forceHeight);
                        //}

                    }, 150);
                });

                $(window).trigger('resize');
            }

            $(this.options.gridId).jqGrid('bindKeys', null);

            if (this.options.userCanModifyRecord) {

                $(this.options.gridId).keydown(function (event) {

                    self.options.selectedRow = $(self.options.gridId).jqGrid('getGridParam', 'selrow');

                    if (event.keyCode === 46) {

                        if (self.options.selectedRow != null)
                            $(self.options.gridId).jqGrid('delGridRow', self.options.selectedRow, self.options.editOptions);
                    }

                    if (event.keyCode === 13) {
                        if (self.options.selectedRow != null)
                            $(self.options.gridId).jqGrid('editGridRow', self.options.selectedRow, self.options.editOptions);
                    }
                });
            }
        }
    });
})(jQuery);

