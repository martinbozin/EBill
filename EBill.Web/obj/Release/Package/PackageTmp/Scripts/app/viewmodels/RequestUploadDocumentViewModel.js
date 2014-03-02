NS.ViewModels.RequestUploadDocumentViewModel = function () {
    var self = this;
    var _ctx;

    self.RequestId = ko.observable();
    self.RequestDocumentId = ko.observable();
    self.FileName = ko.observable();

    self.FilePath = ko.observable().extend({
        requied: true
    });

    self.Comment = ko.observable().extend({
        requied: true
    });

    self.Init = function (requestId, requestDocumentId, fileName, comment, filePath) {
        self.RequestId(requestId);
        self.RequestDocumentId(requestDocumentId);
        self.FileName(fileName);
        self.FilePath(filePath);
        self.Comment(comment);
    };

    self.setContext = function (ctx) {
        _ctx = ctx;
    };

    self.enableUploadButton = ko.computed(function () {
        
        if (self.FilePath() != undefined && self.Comment() != undefined) {
            self.FilePath($('#fileUpload').val());
            if (self.FilePath() != '' && self.Comment() != '' ) {
                return true;
            }
        }
        return false;
    });

    self.IgnoreMappings = {
        both: [
            "_ctx",
            "IgnoreMappings",
            "Init",
            "enableUploadButton"
        ],
        dirty: [

        ],
        json: [

        ]
    };
}