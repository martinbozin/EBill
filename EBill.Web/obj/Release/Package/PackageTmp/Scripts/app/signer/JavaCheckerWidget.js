$.widget("NS.JavaCheckerWidget",
{
    options: {
        templateId: 'signer/java-check-dialog',
    },
    _init: function () {
        this.options.parentElement = this.element;
        var element = NS.Utils.String.format("<div data-bind='template:{ name:{0}}'></div>", NS.Utils.String.format('"{0}"', this.options.templateId));
        $(this.element).append(element);
        this.options.contentElement = $("div", this.element);
        
        var viewModel = new function () { };
        ko.applyBindings(viewModel, this.options.contentElement[0]);

        $(this.options.contentElement).dialog({
            dialogClass: 'no-close',
            title: 'JAVA JRE не е пронајдена',
            position: ["center", "center"],
            modal: true,
            closeOnEscape: false,
            draggable: false,
            resizable: false,
            width: 500,
            height: 250,
            create: function (event, ui) {
                $(this).parents(".ui-dialog").css("padding", 0);
                $(this).parents(".ui-dialog").css({ "border": 'solid 1px #fff' });
                $(this).parents(".ui-dialog:first").find(".ui-dialog-content").css("padding", 0);
            },
            close: function (event, ui) {
                $(this).remove();
            }
        });

        this._initAplicationUIActions();
    }
    , _initAplicationUIActions: function () {
        var self = this;
        var viewModel = this.options.viewModel;
        var contentElement = self.options.contentElement[0];

        $("#imgInstallLatest", contentElement).click(function () { //check for the first selection
            //window.setTimeout(
            //    function () {
            //        $(contentElement).dialog('close');
            //    }, 5000);
            deployJava.installLatestJRE();
        });

        $("#cancelJava", contentElement).click(function () {
            $(contentElement).dialog('close');
            return false;
        });
    },
    destroy: function () {
        this.options.viewModel = null;
        $(this.element).empty();
        $.Widget.prototype.destroy.call(this);
    }
});
