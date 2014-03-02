/////////////////////////////////////////////
///Ekstenzija so koja se ovozmozuva sledenje na 
///promeni na objektot
////////////////////////////////////////////
ko.dirtyFlag = function (root, isInitiallyDirty, ignoreMapping) {
    if (!ignoreMapping) {
        ignoreMapping = {
            both: [],
            dirty: [],
            json: []
        };
    }
    var result = function () {
    };

    //var recDelete = function (state) {
    //    for (var prop in state) {
    //        var currentProp = state[prop];
    //        if (currentProp != null && typeof currentProp == "object") {
    //            if ($.isArray(currentProp)) {
    //                for (var p in currentProp) {
    //                    var innerProp = currentProp[p];

    //                    if (innerProp != undefined && innerProp.IgnoreMappings != undefined) {
    //                        for (k = 1; k < innerProp.IgnoreMappings.both.length; k++) {
    //                            delete innerProp[innerProp.IgnoreMappings.both[k]];
    //                        }
    //                        delete innerProp[innerProp.IgnoreMappings.both[0]];
    //                    }
    //                    recDelete(innerProp);
    //                }
    //            }
    //        }
    //    }
    //};

    var getState = function () {
        var state = ko.toJS(root);
        var i;

        for (i = 0; i < ignoreMapping.both.length; i++) {
            delete state[ignoreMapping.both[i]];
        }
        for (i = 0; i < ignoreMapping.dirty.length; i++) {
            delete state[ignoreMapping.dirty[i]];
        }

        // recDelete(state);

        var newState = ko.utils.stringifyJson(state);
    //    console.log(newState);
        return newState;
    };

    var _initialState = ko.observable(getState());

    var _isInitiallyDirty = ko.observable(isInitiallyDirty);

    result.isDirty = ko.dependentObservable(function () {
        return _isInitiallyDirty() || _initialState() !== getState();
    });

    result.notDirty = ko.dependentObservable(function () {
        var drt = _isInitiallyDirty() || _initialState() !== getState();
        return !drt;
    });

    result.reset = function () {
        _initialState(getState());
        _isInitiallyDirty(false);
    };

    result.setDirty = function () {
        _initialState(getState());
        _isInitiallyDirty(true);

    };

    return result;
};

///////////////////////////////////////
//Go priprema objektot za prakanje prema server
//////////////////////////////////////
var ClearMappings = function (root) {

    var copy = root;
    var ignoreMapping;
    if (!copy.IgnoreMappings) {
        ignoreMapping = {
            both: [],
            dirty: [],
            json: []
        };
    } else {
        ignoreMapping = copy.IgnoreMappings;
    }

    var state = ko.toJS(copy);
    var i;
    for (i = 0; i < ignoreMapping.both.length; i++) {
        delete state[ignoreMapping.both[i]];
    }
    for (i = 0; i < ignoreMapping.json.length; i++) {
        delete state[ignoreMapping.json[i]];
    }

    return state;
};

ko.bindingHandlers.i18n = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var key = valueAccessor();
        var trans = window.languagePack[key];
        if (trans != undefined) {
            $(element).html(trans);
        }
    }
};

ko.bindingHandlers.element = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var elementId = allBindingsAccessor().attr.id;
        var value = valueAccessor();
        value(elementId);
    }
};

ko.bindingHandlers.templateWithOptions = {
    init: ko.bindingHandlers.template.init,
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, context) {
        var options = ko.utils.unwrapObservable(valueAccessor());
        //if options were passed attach them to $data
        if (options.templateOptions) {
            context.$data.$item = ko.utils.unwrapObservable(options.templateOptions);
        }
        //call actual template binding
        ko.bindingHandlers.template.update(element, valueAccessor, allBindingsAccessor, viewModel, context);
        //clean up
        delete context.$data.$item;
    }
}