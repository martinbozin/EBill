$.widget("NS.PaginateTableWidget",
{
    options: {
        currentPage: 1,
        pageSize: 10
    },
    _init: function () {
        this.options.$table = this.element;
        this._initAplicationUIActions();
    },
    _initAplicationUIActions: function () {
        var widgetSelf = this;
        var $table = widgetSelf.options.$table;

        $table.bind('repaginate', function () {
            var page = widgetSelf.options.viewModel.currentPage() - 1;
            var numPerPage = widgetSelf.options.viewModel.pageSize();

            $table.find('tbody tr')
                .hide()
                .slice(page * numPerPage, (page + 1) * numPerPage)
                .show();
        });

        var $pager = $(widgetSelf._getPagerTemplate());
        $pager.insertAfter($table);

        var PaginateTableViewModel = function () {
            var self = this;

            self.pageSize = ko.observable(widgetSelf.options.pageSize);
            self.currentPage = ko.observable(widgetSelf.options.currentPage);
            self.totalPages = ko.observable(0);
            self.totalRecords = ko.observable(0);
            self.pages = ko.observableArray([]);

            self.Init = function () {
                //GET TABLE DATA
                var totalRecords = $table.find('tbody tr').length;

                //INIT MODEL
                self.totalRecords(totalRecords);
                var totalPages = Math.ceil(self.totalRecords() / self.pageSize());
                self.totalPages(totalPages);

                //INIT PAGER
                self.pages.removeAll();
                for (var j = 0; j < self.totalPages() ; j++) {
                    self.pages.push(j + 1);
                }
            };

            self.LoadData = function (pageIndex) {
                self.currentPage(pageIndex);
                $table.trigger('repaginate');
            };

            self.loadPage = function () {
                var pageToLoad = this.toString();
                self.LoadData(pageToLoad);
            };

            self.prevPage = function () {
                var pageToLoad = (self.currentPage() - 1);
                if (pageToLoad >= 1) {
                    self.LoadData(pageToLoad);
                }
            };

            self.nextPage = function () {
                var pageToLoad = (self.currentPage() + 1);
                if (pageToLoad <= self.totalPages()) {
                    self.LoadData(pageToLoad);
                }
            };
        };
        var viewModel = new PaginateTableViewModel();
        viewModel.Init();
        widgetSelf.options.viewModel = viewModel;

        $table.trigger('repaginate');
        ko.applyBindings(viewModel, $($pager)[0]);


        //MONITOR TABLE CHANGES
        setInterval(function () {
            var $t = $($table),
                rowCount = $t.data("rowCount"),
                rowLength = $t.find("tbody").children().length;

            if (rowCount && rowCount !== rowLength) {
                
                viewModel.Init();
                
                //ova e situacija koga
                //se brise red na poslednata strana i treba da se vrati edna strana nazad (dokolku ima uste stranici)
                if (viewModel.totalRecords() < viewModel.currentPage() * viewModel.pageSize()) {
                    if (viewModel.currentPage() > 1) {
                        viewModel.currentPage(viewModel.currentPage() - 1);
                    }
                }
                
                $table.trigger('repaginate');
                $t.data("rowCount", rowLength);
            }
            else if (!rowCount) {
                $t.data("rowCount", rowLength);
            }
        }, 500);
    },
    _getPagerTemplate: function () {
        var pagerTemplate =
            '<div data-bind="visible: pages().length > 1" class="pagination pagination-centered">' +
                '<ul data-bind="foreach:pages">' +

                    '<!-- ko if: ($index() + 1) ==  1 -->' +
                        '<li data-bind="css: { disabled: 1 == $parent.currentPage() }">' +
                            '<a href="#" data-bind="click: $parent.prevPage"><<</a>' +
                        '</li>' +
                    '<!-- /ko -->' +

                    '<li data-bind="css: { active: ($index() + 1) == $parent.currentPage() }">' +
                        '<a href="#" data-bind="click: $parent.loadPage">' +
                            '<span data-bind="text: ($index() + 1)"></span>' +
                        '</a>' +
                    '</li>' +

                    '<!-- ko if: ($index() + 1) ==   $parent.pages().length  -->' +
                        '<li data-bind="css: { disabled: $parent.pages().length == $parent.currentPage() }">' +
                            '<a href="#" data-bind="click: $parent.nextPage">>></a>' +
                        '</li>' +
                    '<!-- /ko -->' +

             '</ul>' +
            '</div>';

        return pagerTemplate;
    },
    destroy: function () {
        this.options.viewModel = null;
        $(this.element).empty();
        $.Widget.prototype.destroy.call(this);
    }
});