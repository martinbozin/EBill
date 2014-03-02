NS.ViewModels.Certificate = function () {
    var self = this;
    this.IssuedTo = ko.observable();
    this.Issuer = ko.observable();
    this.SerialNo = ko.observable();
    this.Thumbprint = ko.observable();
    this.ValidFrom = ko.observable();
    this.ValidTo = ko.observable();

    this.mapFromJson = function (data) {
        self.IssuedTo(data.IssuedTo);
        self.Issuer(data.Issuer);
        self.SerialNo(data.SerialNo);
        self.Thumbprint(data.Thumbprint);
        self.ValidFrom(data.ValidFrom);
        self.ValidTo(data.ValidTo);
    };
};

if (!deployJava.versionCheck('1.7')) {
    $(function () {
        var holder = '<div id="' + new Date().getTime() + '"></div>';
        $(holder).JavaCheckerWidget({});
    });
} else {

    if ($.browser.msie) {
        var attributes = {
            id: 'signerApp',
            name: 'e-Dozvoli',
            codebase: baseUrl + 'Lib',
            code: 'web.Signer',
            archive: 'nssigner.jar',
            classloader_cache: false,
            mayscript: true,
            width: 1,
            height: 1
        };
        var parameters = {
            mayscript: true
        };
        deployJava.runApplet(attributes, parameters, '1.7');
    }
    else {
        document.write('<object id="signerApp" tabindex="0" type="application/x-java-applet" height="1" width="1">');
        document.write('<!--Generic parameters for all Java applets. -->');
        document.write('<param name="codebase" value="' + baseUrl + 'Lib' + '" >');
        document.write('<param name="archive"  value="nssigner.jar" >');
        document.write('<param name="code"     value="web.Signer" >');
        document.write('<!--Specific parameters. -->');
        document.write('Your browser needs Java to view projects.');
        document.write('</object>');
    }


    //CALLBACK ZA SIGN
    var callbackSignedRequest = function (doc, callback) {
        callback(doc);
    };

    //CALLBACK ZA GET CERTIFICATES
    var callbackCerts = function (argument, callback) {
        var certList = [];
        var data = JSON.parse(argument);
        if (!!data) {
            for (var i = 0; i < data.length; i++) {
                var cert = new NS.ViewModels.Certificate();
                cert.mapFromJson(data[i]);
                certList.push(cert);
            }
        }
        callback(certList);
    };
}