class GetResult<T extends IODataDto> {
    private data: Array<T>;
    public odataCount: number;
    constructor(json: any) {

        if (json['@odata.count'])
            this.odataCount = json['@odata.count'];


        if (Array.isArray(json.value)) {
            this.data = json.value.map((o: any) => {
                return this.convertODataInfo(o);
            });
        }
        else {
            this.data = [];
            this.data.push(json.value ? json.value : json);
        }
    }

    count(): number {
        return this.data.length;
    }

    firstOrDefault(): T | null {
        if (this.count() > 0) {
            return this.convertODataInfo(this.data[0]);
        }
        return null;
    }

    toList(): Array<T> {
        return this.data;
    }

    private convertODataInfo(item: any): T {
        if (item['@odata.type']) {
            if (!item._odataInfo) { item._odataInfo = new ODataModelInfo(); }
            item._odataInfo.type = item['@odata.type'];
            delete item['@odata.type'];

            let parts = item._odataInfo.type.split('.');
            item._odataInfo.shortType = parts[parts.length - 1];
        }
        return item;
    }

}