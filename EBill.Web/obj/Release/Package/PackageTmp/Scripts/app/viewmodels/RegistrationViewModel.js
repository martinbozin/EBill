//Регистрација на корисник
NS.ViewModels.RegistrationViewModel = function () {
    var self = this;
    var ctx = this;

    self.FirstName = ko.observable().extend({
        required: true,     
            message: 'Полето е задолжително'     
    });
    self.LastName = ko.observable().extend({
        required: true,    
            message: 'Полето е задолжително'   
    });
    self.UserName = ko.observable().extend({
        required: true,
        email: true,       
            message: 'Внесете валиден е-маил'        
    });
    //self.Password = ko.observable().extend({
    //    required: true,     
    //        message: 'Полето е задолжително'
    //});
    self.Password = ko.observable().extend({
        validation: {
            validator: function () {
                var value = $("#Password").val();       
                if (value!=null && value != "") {
                    var pw = value;
                    // default options (allows any password)
                    var o = {
                        lower: 1,
                        upper: 1,
                        alpha: 1, /* lower + upper */
                        numeric: 1,
                        special: 1,
                        length: [6, Infinity],
                        custom: [ /* regexes and/or functions */],
                        badWords: [],
                        badSequenceLength: 0,
                        noQwertySequences: false,
                        noSequential: false
                    };

                    //for (var property in options)
                    //    o[property] = options[property];

                    var re = {
                        lower: /[a-z]/g,
                        upper: /[A-Z]/g,
                        alpha: /[A-Z]/gi,
                        numeric: /[0-9]/g,
                        special: /[\W_]/g
                    },
                        rule, i;

                    // enforce min/max length
                    if (pw.length < o.length[0] || pw.length > o.length[1])
                        return false;

                    // enforce lower/upper/alpha/numeric/special rules
                    for (rule in re) {
                        if ((pw.match(re[rule]) || []).length < o[rule])
                            return false;
                    }

                    // enforce word ban (case insensitive)
                    for (i = 0; i < o.badWords.length; i++) {
                        if (pw.toLowerCase().indexOf(o.badWords[i].toLowerCase()) > -1)
                            return false;
                    }

                    // enforce the no sequential, identical characters rule
                    if (o.noSequential && /([\S\s])\1/.test(pw))
                        return false;

                    // enforce alphanumeric/qwerty sequence ban rules
                    if (o.badSequenceLength) {
                        var lower = "abcdefghijklmnopqrstuvwxyz",
                            upper = lower.toUpperCase(),
                            numbers = "0123456789",
                            qwerty = "qwertyuiopasdfghjklzxcvbnm",
                            start = o.badSequenceLength - 1,
                            seq = "_" + pw.slice(0, start);
                        for (i = start; i < pw.length; i++) {
                            seq = seq.slice(1) + pw.charAt(i);
                            if (
                                lower.indexOf(seq) > -1 ||
                                upper.indexOf(seq) > -1 ||
                                numbers.indexOf(seq) > -1 ||
                                (o.noQwertySequences && qwerty.indexOf(seq) > -1)
                            ) {
                                return false;
                            }
                        }
                    }

                    // enforce custom regex/function rules
                    for (i = 0; i < o.custom.length; i++) {
                        rule = o.custom[i];
                        if (rule instanceof RegExp) {
                            if (!rule.test(pw))
                                return false;
                        } else if (rule instanceof Function) {
                            if (!rule(pw))
                                return false;
                        }
                    }

                    // great success!
                    return true;
                }
                return false;
            },
            message: 'Лозинката мора да содржи мали, големи букви, бројки и специјални знаци'
        }
    });


    self.PasswordConfirm = ko.observable().extend({
        required: true,
        message: 'Полето е задолжително',
        validation: {
            validator: mustEqual,
            message: 'Лозинките треба да се исти.',
            params: self.Password
        }
    });
    self.Address = ko.observable().extend({
        required: true,        
            message: 'Полето е задолжително' 
    });
    self.CaptchaValue = ko.observable().extend({
        required: true,
            message: 'Полето е задолжително'
    });
   
    self.Init = function () {

    };

    self.setContext = function (context) {
        ctx = context;
    };


    self.IgnoreMappings = {
        both: [
            "IgnoreMappings"

        ],
        dirty: [],
        json: []
    };
 
};
////Custom validation za proverka na vnesen password dali se sovpaga
ko.validation.configure({
    registerExtenders: true,
    messagesOnModified: true,
    insertMessages: true,
    parseInputAttributes: true,
    messageTemplate: null
});

var mustEqual = function (val, other) {
    return val == other();
};