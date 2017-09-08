class GetResult {
    constructor(json) {
        if (Array.isArray(json.value)) {
            this.data = json.value.map((o) => {
                return this.convertODataInfo(o);
            });
        }
        else {
            this.data = [];
            this.data.push(json.value ? json.value : json);
        }
    }
    count() {
        return this.data.length;
    }
    firstOrDefault() {
        if (this.count() > 0) {
            return this.convertODataInfo(this.data[0]);
        }
        return null;
    }
    toList() {
        return this.data;
    }
    convertODataInfo(item) {
        if (item['@odata.type']) {
            if (!item._odataInfo) {
                item._odataInfo = new ODataModelInfo();
            }
            item._odataInfo.type = item['@odata.type'];
            delete item['@odata.type'];
            let parts = item._odataInfo.type.split('.');
            item._odataInfo.shortType = parts[parts.length - 1];
        }
        return item;
    }
}
