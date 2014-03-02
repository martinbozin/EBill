$.widget("NS.RequestDetailsWidget", {
    options: {
        templateId: 'request-details',
    },
    _init: function () {
        this.options.parentElement = this.element;
        var element = NS.Utils.String.format("<div data-bind='template:{ name:{0}}'></div>", NS.Utils.String.format('"{0}"', this.options.templateId));
        $(this.element).append(element);
        this.options.contentElement = $("div", this.element);
    },
    load: function (requestId) {
        var self = this;

        var viewModel = new NS.ViewModels.RequestDetailsViewModel();
        viewModel.Init(requestId);
        viewModel.setContext(this.options.contentElement);
        viewModel.DirtyFlag = new ko.dirtyFlag(viewModel, false, viewModel.IgnoreMappings);

        this.options.viewModel = viewModel;
        ko.applyBindings(viewModel, self.element[0]);

        this._initAplicationUIActions();
    },
    _initAplicationUIActions: function () {
        var self = this;
        var viewModel = self.options.viewModel;
        var contentElement = self.options.contentElement[0];

        $(document).on("click", ".request-full-history", function (e) {
            var widgetHolder = $("<div></div>").appendTo(document);

            var requestDetailsId = ko.dataFor(this).Id();

            $(widgetHolder).RequestFullHistoryWidget();
            $(widgetHolder).RequestFullHistoryWidget("load", requestDetailsId);

            e.preventDefault();
            return false;
        });

        if (window.currentUser.isRakovoditel()) {
            $(document).on("click", ".define-employe-request", function (e) {
                var widgetHolder = $("<div></div>").appendTo(document);

                var requestId = ko.dataFor(this).RequestId();

                $(widgetHolder).DefineEmployeeForRequestWidget({
                    onSave: function () {
                        viewModel.Reload();
                    }
                });

                $(widgetHolder).DefineEmployeeForRequestWidget("load", requestId);

                e.preventDefault();
                return false;
            });
        }

        $(document).on("click", ".request-upload-document", function (e) {

            var widgetHolder = $("<div></div>").appendTo(document);

            var request = ko.contextFor(this).$root;

            var requestId = request.RequestId();
            $(widgetHolder).RequestUploadDocumentWidget({
                //onSave: function () {
                //}
            });
            $(widgetHolder).RequestUploadDocumentWidget("load", requestId);
            //$(".documents-tab").addClass("active");
            e.preventDefault();
            return false;
        });

        $(document).on("click", ".request-edit-document", function (e) {
 
            var widgetHolder = $("<div></div>").appendTo(document);

            var request = ko.contextFor(this).$root;
            var requestId = request.RequestId();
            var requestDocument = ko.dataFor(this);
            var fileName = requestDocument.FileName();
         
            var comment = requestDocument.Comment();
            var requestDocumentId = requestDocument.RequestDocumentId();

            $(widgetHolder).RequestUploadDocumentWidget({
                //onSave: function () {
                //}
            });
            $(widgetHolder).RequestUploadDocumentWidget("load", requestId, requestDocumentId, fileName, comment);

            e.preventDefault();
            return false;
        });

        $(contentElement).on('click', '.show-cadastre-municipalities', function (e) {
            $(this).next("div").slideToggle(100);
        });
        
        $('table.paginated').PaginateTableWidget({});

        $('.autonumeric').autoNumeric({ aSep: '.', aDec: ',' });

        $(contentElement).on('click', '.print-request', function (e) {
            var requestId = ko.dataFor(this).Request().RequestId();
            document.location.href = baseUrl + 'SharedRequest/PrintRequest/?requestId=' + requestId;
        });
    },
    destroy: function () {
        this.options.viewModel = null;
        $(this.element).empty();
        $.Widget.prototype.destroy.call(this);
    }
});