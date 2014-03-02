NS.Repository.ApplicationParameters = {};

//�� ������� ���� ������� ���������
NS.Repository.ApplicationParameters.LoadAllValidApplicationParameters = function () {
    var result = null;
    NS.Utils.AJAX.post(baseUrl + 'ApplicationParameters/LoadAllValidApplicationParameters',
        {},
        function (data) {
            result = data;
        },
        null,
        false
    );
    return result;
};

//���� ��������� �� ��
NS.Repository.ApplicationParameters.GetAppParameterById = function (appParamId) {
    var result = null;
    NS.Utils.AJAX.post(baseUrl + 'ApplicationParameters/GetAppParameterById',
        {
            appParamId: appParamId
        },
        function (data) {
            result = data;
        },
        null,
        false
    );
    return result;
};

//���� ����� �� ����� KEY
NS.Repository.ApplicationParameters.GetParametersForParameterName = function (parameterName) {
    var result = null;
    NS.Utils.AJAX.post(baseUrl + 'ApplicationParameters/GetParametersForParameterName',
        {
            parameterName: parameterName
        },
        function (data) {
            result = data;
        },
        null,
        false
    );
    return result;
};

//������ ��������� �� ���������
NS.Repository.ApplicationParameters.UpdateParameterValue = function (model, ctx) {
    var result = null;
    NS.Utils.AJAX.post(baseUrl + 'ApplicationParameters/UpdateParameterValue',
        model,
        function (data) {
            result = data;
        },
        function (data) {
            NS.Utils.AJAX.parseErors(data, ctx);
        },
        false
    );
    return result != null;
};
