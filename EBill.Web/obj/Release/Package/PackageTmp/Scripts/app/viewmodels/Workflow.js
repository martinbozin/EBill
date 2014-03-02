NS.ViewModels.TransitionViewModel = function (objectId) {
    var self = this;

    self.ObjectId = ko.observable(objectId);
    self.TransitionId = ko.observable();

    self.Title = ko.observable();
    self.Description = ko.observable();

    self.ImageUrl = ko.observable();
    self.DisabledImageUrl = ko.observable();
    self.SuccessFunction = ko.observable();
    self.PreExecuteFunction = ko.observable();
    self.ActionTitle = ko.observable();
    self.ActionQuestion = ko.observable();
    self.TAG = ko.observable();

    self.HideIfDisabled = ko.observable();
    self.Enabled = ko.observable();

    self.mapFromJson = function (data) {
        self.TransitionId(data.TransitionId);

        self.Title(data.Title);
        self.Description(data.Description);

        self.ImageUrl(data.ImageUrl);
        self.DisabledImageUrl(data.DisabledImageUrl);

        self.SuccessFunction(data.SuccessFunction);
        self.PreExecuteFunction(data.PreExecuteFunction);
        self.ActionTitle(data.ActionTitle);
        self.ActionQuestion(data.ActionQuestion);
        self.TAG(data.TAG);

        self.HideIfDisabled(data.HideIfDisabled);
        self.Enabled(data.Enabled);
    };

    self.onClick = function () {

        if (!self.Enabled())
            return false;

        if (self.PreExecuteFunction() != null) {
            var cancelEvent = eval(self.PreExecuteFunction());
            if (cancelEvent)
                return false;
        }

        if (self.ActionTitle() == undefined) {
            signRequest(self.ObjectId(), null, self, true, null);
        } else {
            NS.Controls.Dialog.confirmDialog(self.ActionTitle(), self.ActionQuestion(), function () {
                signRequest(self.ObjectId(), null, self, false, null);
            });
        }

        return true;
    };
};

NS.ViewModels.WorkflowViewModel = function () {
    var self = this;

    self.AvailableTransitions = ko.observableArray();
    self.AvailableDocumentTransitions = ko.observableArray();

    self.selectedDocumentForGenerate = ko.observable(null);
    self.CanGenerateDocument = ko.computed(function () {
        if (self.selectedDocumentForGenerate() != null) {
            return true;
        }
        return false;
    });

    //se povikuva pri generiranje na dokumenti
    self.GenerateDocument = function () {
      
        var documentTransition = self.selectedDocumentForGenerate();

        if (documentTransition.PreExecuteFunction() != null) {
            var cancelEvent = eval(documentTransition.PreExecuteFunction());
            if (cancelEvent)
                return false;
        }

        var action = function () {
            NS.Controls.Dialog.getBlockUI();
            setTimeout(function () {
                $.when($(document).trigger('on-transition-element-click', documentTransition))
                    .done(function () {
                        $.unblockUI();
                    });
            }, 150);
            
        };

        if (documentTransition.ActionTitle() == undefined) {
            action();
        } else {
            NS.Controls.Dialog.confirmDialog(documentTransition.ActionTitle(), documentTransition.ActionQuestion(), function () {
                action();
            });
        }


        self.selectedDocumentForGenerate(null);

        return true;
    };


    self.Init = function (objectId) {
        var data = NS.Repository.Workflow.GetAvailableTransitions(objectId);

        if (!!data) {
         
            for (var i = 0; i < data.length; i++) {
                var item = new NS.ViewModels.TransitionViewModel(objectId);
                item.mapFromJson(data[i]);
                if (item.TAG() == 'DocumentGenerator') {
                    self.AvailableDocumentTransitions.push(item);
                } else {
                    self.AvailableTransitions.push(item);
                }
            }
        }
    };
};