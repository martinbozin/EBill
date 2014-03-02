var baseUrl = baseUrl || '/';
var NS = {
    ViewModels: {},
    Repository: {},
    Controls: {},
    Utils: {},
    config: {
        debug: true,
    },
    initialize: function () {
        //External Template Engine
        infuser.defaults.templateUrl = baseUrl + "templates";
        infuser.defaults.templateSuffix = ".tmpl.html";
        infuser.defaults.templatePrefix = "";
        infuser.defaults.ajax.async = false;
        infuser.defaults.ajax.cache = !NS.config.debug;
    }
};

$(function () {
    NS.initialize();
});

