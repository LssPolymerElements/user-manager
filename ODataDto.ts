interface IODataDto {
    _odataInfo: IODataModelInfo
}

class ODataDto implements IODataDto {
    constructor(modelInfo = new ODataModelInfo()) {
        this._odataInfo = modelInfo;
    }
    _odataInfo: IODataModelInfo;
}