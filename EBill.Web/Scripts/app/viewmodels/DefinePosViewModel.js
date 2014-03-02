
//Дефинирање на POS
NS.ViewModels.DefinePosViewModel = function () {
    var self = this;
    var ctx = this;

    self.UserId = ko.observable();
    self.AvailablePos = ko.observableArray();
    self.SelectedPos = ko.observableArray();

    self.Init = function (userId) {
        self.UserId(userId);

        //Get All POS
        $.map(NS.Repository.Lookups.GetAllPos(), function (item) {
            if (item.AdditionalInfo == null)
                self.AvailablePos.push(item);
        });

        //Get Selected POS
        var selected = NS.Repository.Pos.GetSelectedPos(userId);
        $.map(selected, function (item) {
            self.SelectedPos.push(item.Value.toString());
        });
    };

    self.Save = function () {
        debugger;

        var result;
        
        if (self.SelectedPos().length > 0) {
            result = NS.Repository.Pos.SetSelectedPos(self.UserId(), self.SelectedPos(), ctx);
        } else {
            result = NS.Repository.Pos.SetSelectedPosToNull(self.UserId(), self.SelectedPos(), ctx);
        }


    };

    self.setContext = function (context) {
        ctx = context;
    };

    self.IgnoreMappings = {
        both: [
            "IgnoreMappings",
            "AvailablePos"
        ],
        dirty: [],
        json: []
    };
};