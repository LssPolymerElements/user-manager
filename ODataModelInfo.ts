interface IODataModelInfo {
    type: string | null;
    shortType: string | null;
}

class ODataModelInfo implements IODataModelInfo {
    constructor() {
        this.type = null;
        this.shortType = null;
    }
    type: string | null;
    shortType: string | null;
}