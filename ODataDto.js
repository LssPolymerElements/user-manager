var ODataDto = (function () {
    function ODataDto(modelInfo) {
        if (modelInfo === void 0) { modelInfo = new ODataModelInfo(); }
        this._odataInfo = modelInfo;
    }
    return ODataDto;
}());
