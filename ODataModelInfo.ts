interface IODataModelInfo {
    type: string;
    shortType: string;
}

class ODataModelInfo implements IODataModelInfo {
    constructor() {
        this.type = null;
        this.shortType = null;
    }
    type: string;
    shortType: string;
}