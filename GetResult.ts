class GetResult<T> {
    private data: Array<T>;

    constructor(json: any) {
        this.data = json.value;
    }

    count(): number {
        return this.data.length;
    }

    firstOrDefault(): T {
        if (this.count() > 0)
            return this.data[0];

        return null;
    }

    toList(): Array<T> {
        return this.data;
    }
}