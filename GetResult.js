var GetResult = (function () {
    function GetResult(json) {
        this.data = json.value;
    }
    GetResult.prototype.count = function () {
        return this.data.length;
    };
    GetResult.prototype.firstOrDefault = function () {
        if (this.count() > 0)
            return this.data[0];
        return null;
    };
    GetResult.prototype.toList = function () {
        return this.data;
    };
    return GetResult;
}());
