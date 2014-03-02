NS.ViewModels.RequestDocumentsViewModel = function () {
    var self = this;
    self.SubmittedDocuments = ko.observableArray([]);
    self.AdditionalDocuments = ko.observableArray([]);
    self.ProcessDocuments = ko.observableArray([]);
    self.UtilitiesDocuments = ko.observableArray([]);

    self.UserDocuments = ko.observableArray([]);
    self.RequestId = ko.observable([]);

    self.mapFromJson = function (requestId, data) {

        self.RequestId(requestId);
        var i;
        var item;

        for (i = 0; i < data.SubmittedDocuments.length; i++) {
            item = new NS.ViewModels.RequestDocumentViewModel(self.RequestId());
            item.mapFromJson(data.SubmittedDocuments[i]);
            self.SubmittedDocuments.push(item);
            self.UserDocuments.push(item);
        }

        for (i = 0; i < data.AdditionalDocuments.length; i++) {
            item = new NS.ViewModels.RequestDocumentViewModel(self.RequestId());
            item.mapFromJson(data.AdditionalDocuments[i]);
            self.AdditionalDocuments.push(item);
            self.UserDocuments.push(item);
        }

        for (i = 0; i < data.ProcessDocuments.length; i++) {
            item = new NS.ViewModels.RequestDocumentViewModel(self.RequestId());
            item.mapFromJson(data.ProcessDocuments[i]);
            self.ProcessDocuments.push(item);
        }
        for (i = 0; i < data.UtilitiesDocuments.length; i++) {
            item = new NS.ViewModels.RequestDocumentViewModel(self.RequestId());
            item.mapFromJson(data.UtilitiesDocuments[i]);
            self.UtilitiesDocuments.push(item);
        }
    };
};

NS.ViewModels.PublicRequestViewModel = function () {
    var self = this;

    //load on Init
    self.Request = ko.observable(new NS.ViewModels.RequestViewModel());
    self.RequestMunicipalities = ko.observableArray([]);
    self.hasRequest2UserNotifications = ko.observable(false);

    //load on Demand
    self.RequestTypeDetails = ko.observable(new NS.ViewModels.RequestTypeViewModel());
    self.RequestInvestors = ko.observableArray([]);
    self.RequestDocuments = ko.observable(new NS.ViewModels.RequestDocumentsViewModel());
    self.RequestAttributes = ko.observableArray([]);
    self.Request2UserNotifications = ko.observableArray([]);

    self.mapFromJson = function (data) {

        //Request Details
        var request = new NS.ViewModels.RequestViewModel();
        request.mapFromJson(data.RequestsDetails);
        self.Request(request);

        //Municipalities
        var item, i;
        self.RequestMunicipalities.removeAll();
        for (i = 0; i < data.RequestMunicipalities.length; i++) {
            item = new NS.ViewModels.RequestMunicipalityViewModel();
            item.mapFromJson(data.RequestMunicipalities[i]);
            self.RequestMunicipalities.push(item);
        }

        self.hasRequest2UserNotifications(data.HasRequest2UserNotifications);
    };

    self.LoadInvestors = function () {
        self.RequestInvestors.removeAll();
        var data = NS.Repository.Request.GetRequestInvesotrs(self.Request().RequestId());
        if (!!data) {
            for (var i = 0; i < data.length; i++) {
                var item = new NS.ViewModels.RequestInvestorViewModel();
                item.mapFromJson(data[i]);
                self.RequestInvestors.push(item);
            }
            investorsAreLoaded = true;
        }
    };

    var investorsAreLoaded = false;
    self.onInvestorsTabActivate = function () {
        if (!investorsAreLoaded) {
            self.LoadInvestors();
        }
    };

    self.LoadDocuments = function () {

        self.RequestDocuments(new NS.ViewModels.RequestDocumentsViewModel());
        self.RequestAttributes.removeAll();

        var requestId = self.Request().RequestId();
        var data;
        data = NS.Repository.Lookups.GetRequestTypeDetails(self.Request().RequestTypeId());
        if (!!data) {
            var requestTypeViewModel = new NS.ViewModels.RequestTypeViewModel();
            requestTypeViewModel.mapFromJson(data);
            self.RequestTypeDetails(requestTypeViewModel);
        }

        data = NS.Repository.PublicRequest.GetRequestDocumentsByRequestId(requestId);
        if (!!data) {
            var requestDocumentsViewModel = new NS.ViewModels.RequestDocumentsViewModel();
            requestDocumentsViewModel.mapFromJson(requestId, data);
            self.RequestDocuments(requestDocumentsViewModel);
        }

        data = NS.Repository.PublicRequest.GetDocumentsAtrributesForRequest(requestId);
        if (!!data) {
            for (var i = 0; i < data.length; i++) {
                var item = new NS.ViewModels.RequestDocumentAttributeViewModel(requestId);
                item.mapFromJson(data[i]);
                self.RequestAttributes.push(item);
            }
        }

    };





    self.removeDraftDocument = function ($data) {

        NS.Controls.Dialog.confirmDialog(languagePack['Scripts.app.widgets.confirmDialog.Confirm'], //"Потврда...",
            languagePack['Scripts.app.viewmodels.NewRequestViewModel.js.OstranuvanjeDokumenti'],//"Дали сте сигурни дека сакате да го отстраните документот?"
            function () {
                var requestId = self.Request().RequestId();
                var requestDocumentId = $data.RequestDocumentId();
                var data = NS.Repository.PublicRequest.RemoveDraftDocument(requestId, requestDocumentId);
                if (!!data) {
                    self.LoadDocuments();
                }
            });
    };


    self.LoadRequestDocuments = function () {


        self.RequestDocuments.removeAll();
        if (self.RequestId() != undefined) {
            var data = NS.Repository.PublicRequest.GetRequestDocumentsByRequestId(self.RequestId());
            if (!!data) {
                var item;
                var i;
                for (i = 0; i < data.SubmittedDocuments.length; i++) {
                    item = new NS.ViewModels.RequestDocumentViewModel(self.RequestId());
                    item.mapFromJson(data.SubmittedDocuments[i]);

                    self.RequestDocuments.push(item);
                }

                for (i = 0; i < data.AdditionalDocuments.length; i++) {
                    item = new NS.ViewModels.RequestDocumentViewModel(self.RequestId());
                    item.mapFromJson(data.AdditionalDocuments[i]);

                    self.RequestDocuments.push(item);
                }

                for (i = 0; i < data.ProcessDocuments.length; i++) {
                    item = new NS.ViewModels.RequestDocumentViewModel(self.RequestId());
                    item.mapFromJson(data.ProcessDocuments[i]);

                    self.RequestDocuments.push(item);
                }
            }
        }
    };






    var documentsAreLoaded = false;
    self.onDocumentsTabActivate = function () {
        if (!documentsAreLoaded) {
            self.LoadDocuments();
            documentsAreLoaded = true;
        }
    };

    self.LoadNotifications = function () {
        self.Request2UserNotifications.removeAll();
        var requestId = self.Request().RequestId();
        var data = NS.Repository.Request.GetRequest2UserNotification(requestId);
        if (!!data) {
            for (var i = 0; i < data.length; i++) {
                var item = new NS.ViewModels.Request2UserNotificationItemViewModel();
                item.mapFromJson(data[i]);
                self.Request2UserNotifications.push(item);
            }
        }
    };

    var notificationsAreLoaded = false;
    self.onNotificationsTabActivate = function () {
        if (!notificationsAreLoaded) {
            self.LoadNotifications();
            notificationsAreLoaded = true;
        }
    };

    self.GetSubmittedDocumentsForType = function (docTypeId) {
        var res = [];
        var submittedDocuments = self.RequestDocuments().SubmittedDocuments();
        for (var i = 0; i < submittedDocuments.length; i++) {
            var item = submittedDocuments[i];
            if (item.DocumentTypeId() == docTypeId) {
                res.push(item);
            }
        }
        return res;
    };

    self.GetAdditionalDocumentsForType = function (docTypeId) {
        var res = [];
        var additionalDocuments = self.RequestDocuments().AdditionalDocuments();
        for (var i = 0; i < additionalDocuments.length; i++) {
            var item = additionalDocuments[i];
            if (item.DocumentTypeId() == docTypeId) {
                res.push(item);
            }
        }
        return res;
    };

    self.GetProcessDocumentsForType = function (docTypeId) {

        var res = [];
        var processDocuments = self.RequestDocuments().ProcessDocuments();
        for (var i = 0; i < processDocuments.length; i++) {
            var item = processDocuments[i];
            if (item.DocumentTypeId() == docTypeId) {
                res.push(item);
            }
        }
        return res;
    };

    self.GetDocumentsForType = function (docTypeId, listType) {
        switch (listType) {
            case 'SubmittedDocuments':
                return self.GetSubmittedDocumentsForType(docTypeId);
            case 'AdditionalDocuments':
                return self.GetAdditionalDocumentsForType(docTypeId);
            case 'ProcessDocuments':
                return self.GetProcessDocumentsForType(docTypeId);
        }
        return [];
    };



    self.GetAttributesForType = function (docTypeId) {
        var attrs = [];
        for (var i = 0; i < self.RequestAttributes().length; i++) {
            var item = self.RequestAttributes()[i];
            if (item.DocumentTypeId() == docTypeId) {
                attrs.push(item);
            }
        }
        return attrs;
    };

    self.hasSubmittedDocuments = ko.computed(function () {
        return self.RequestDocuments().SubmittedDocuments().length > 0;
    });

    self.hasAdditionalDocuments = ko.computed(function () {
        return self.RequestDocuments().AdditionalDocuments().length > 0;
    });

    self.hasProcessDocuments = ko.computed(function () {
        return self.RequestDocuments().ProcessDocuments().length > 0;
    });
};

NS.ViewModels.PublicRequestsViewModel = function () {
    var self = this;
    var _ctx = null;
    var intitial = 0;
    self.existToolbar = ko.observable(false);

    self.fromDate = ko.observable();

    self.toDate = ko.observable();

    self.SearchDate = function () {
        intitial++;
        self.LoadData(1);
    };

    self.Requests = ko.observableArray();

    self.pageSize = ko.observable(5);
    self.currentPage = ko.observable(1);
    self.totalPages = ko.observable(0);
    self.totalRecords = ko.observable(0);
    self.allPages = ko.observableArray([]);

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

    self.LoadData = function (pageIndex) {
        var data = NS.Repository.PublicRequest.GetRequestsForUser(self.fromDate(), self.toDate(), pageIndex, self.pageSize());
        if (!!data) {

            self.Requests.removeAll();

            for (var i = 0; i < data.Requests.length; i++) {
                var item = new NS.ViewModels.PublicRequestViewModel();
                item.mapFromJson(data.Requests[i]);
                self.Requests.push(item);
                self.totalRecords(data.TotalRecords);
            }

            if (self.totalRecords() > 5 || intitial != 0) {

                self.existToolbar(true);


            } else {
                self.existToolbar(false);
            }

            var totalPages = Math.ceil(self.totalRecords() / self.pageSize());
            self.totalPages(totalPages);

            self.allPages.removeAll();
            for (var j = 0; j < self.totalPages() ; j++) {
                self.allPages.push(j + 1);
            }

            self.currentPage(pageIndex);
            $('html,body').animate({ scrollTop: 0 }, "fast");
        }
    };

    self.Init = function () {
        self.LoadData(1);
    };

    self.Reload = function () {
        self.LoadData(self.currentPage());
    };

    self.IgnoreMappings = {
        both: [
            "_ctx",
            "IgnoreMappings",
            "Requests",
            "pageSize",
            "currentPage",
            "totalPages",
            "totalRecords",
            "allPages",
            "existToolbar",
            "Request2UserNotifications"
        ],
        dirty: [

        ],
        json: [

        ]
    };

    self.setContext = function (ctx) {
        _ctx = ctx;
    };
};