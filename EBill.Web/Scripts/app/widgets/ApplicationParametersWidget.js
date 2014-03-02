
$.widget("NS.ApplicationParametersWidget",
{
    options: {
        templateId: 'application-parameters'
    },
    _init: function () {
        this.options.parentElement = this.element;
        var element = NS.Utils.String.format("<div data-bind='template:{ name:{0}}'></div>", NS.Utils.String.format('"{0}"', this.options.templateId));
        $(this.element).append(element);
        this.options.contentElement = $("div", this.element);
    },
    load: function () {
        var self = this;

        var viewModel = new NS.ViewModels.ApplicationParametersViewModel();
        viewModel.Init();
        viewModel.setContext(this.options.contentElement);

        this.options.viewModel = viewModel;
        ko.applyBindings(viewModel, self.options.contentElement[0]);

        this._initAplicationUIActions();
    },
    _initAplicationUIActions: function () {
        var self = this;
        var viewModel = self.options.viewModel;
        var contentElement = self.options.contentElement;

        $(".edit-parameter", contentElement).die();
        $(".edit-parameter", contentElement).live("click", function (e) {
            var widgetHolder = $("<div></div>").appendTo(document);
            debugger;
            $(widgetHolder).ApplicationParametersEditWidget({
                onSave: function () {
                    viewModel.LoadData();
                }
            });
            debugger;
            var appParamId = ko.dataFor(this).Id();
            $(widgetHolder).ApplicationParametersEditWidget("load", appParamId);

            e.preventDefault();
            return false;
        });

        $(".history-parameter", contentElement).die();
        $(".history-parameter", contentElement).live("click", function (e) {
            var widgetHolder = $("<div></div>").appendTo(document);
            debugger;
            $(widgetHolder).ApplicationParametersHistoryWidget({
                onSave: function () {
                    viewModel.LoadData();
                }
            });

            var parameterName = ko.dataFor(this).ParameterName();
            $(widgetHolder).ApplicationParametersHistoryWidget("load", parameterName);

            e.preventDefault();
            return false;
        });

        $("#txt-filter", contentElement).bind("keyup", function () {
            var searchTerm = $(this).val();
            var cells = $('table tbody tr');
            if (searchTerm.length == 0) {
                $(cells).show();
            }
            for (var i = 0; i < cells.length; i++) {
                if ($(cells[i]).find('span.search-field').text().toLowerCase().indexOf(searchTerm.toLowerCase()) == -1) {
                    $(cells[i]).hide();
                } else {
                    $(cells[i]).show();
                }
            }
        });
    },
    destroy: function () {
        this.options.viewModel = null;
        $(this.element).empty();
        $.Widget.prototype.destroy.call(this);
    }
});

