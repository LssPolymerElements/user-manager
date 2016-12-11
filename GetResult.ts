class GetResult<T extends IODataDto> {
    private data: Array<T>;

    constructor(json: any) {
        this.data = json.value.map(o => {
            return this.convertOdataInfo(o);
        });
    }

    count(): number {
        return this.data.length;
    }

    firstOrDefault(): T | null {
        if (this.count() > 0) {
            return this.convertOdataInfo(this.data[0]);
        }
        return null;
    }

    toList(): Array<T> {
        return this.data;
    }

    private convertOdataInfo(item): T {
        if (item["@odata.type"]) {
            if (!item._odataInfo) { item._odataInfo = new ODataModelInfo(); }
            item._odataInfo.type = item["@odata.type"];
            delete item["@odata.type"];

            var parts = item._odataInfo.type.split(".");
            item._odataInfo.shortType = parts[parts.length - 1];
        }
        return item;
    }

}