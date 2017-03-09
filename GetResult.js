var GetResult = (function () {
    function GetResult(json) {
        var _this = this;
        if (Array.isArray(json.value)) {
            this.data = json.value.map(function (o) {
                return _this.convertOdataInfo(o);
            });
        }
        else {
            this.data = [];
            this.data.push(json.value);
        }
    }
    GetResult.prototype.count = function () {
        return this.data.length;
    };
    GetResult.prototype.firstOrDefault = function () {
        if (this.count() > 0) {
            return this.convertOdataInfo(this.data[0]);
        }
        return null;
    };
    GetResult.prototype.toList = function () {
        return this.data;
    };
    GetResult.prototype.convertOdataInfo = function (item) {
        if (item["@odata.type"]) {
            if (!item._odataInfo) {
                item._odataInfo = new ODataModelInfo();
            }
            item._odataInfo.type = item["@odata.type"];
            delete item["@odata.type"];
            var parts = item._odataInfo.type.split(".");
            item._odataInfo.shortType = parts[parts.length - 1];
        }
        return item;
    };
    return GetResult;
}());
//# sourceMappingURL=GetResult.js.map