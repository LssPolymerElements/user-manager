"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let LssApiService = class LssApiService extends Polymer.Element {
    constructor() {
        super(...arguments);
        this.baseProductionUri = 'https://api2.leavitt.com/';
        this.baseDevUri = 'https://devapi2.leavitt.com/';
        this.appNameKey = 'X-LGAppName';
        this.appName = 'General';
    }
    _environmentHandler(isDev) {
        this.baseUrl = isDev ? this.baseDevUri : this.baseProductionUri;
    }
    _createUri(urlPath) {
        return this.baseUrl + urlPath;
    }
    _getTokenAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return (yield this.lssUserManager.authenticateAsync()).accessToken;
            }
            catch (error) {
                console.warn(error);
            }
            return '';
        });
    }
    postAsync(urlPath, body, appName = null) {
        return __awaiter(this, void 0, void 0, function* () {
            // Add in the odata model info if it not already on the object
            if (body._odataInfo && !body['@odata.type']) {
                if (body._odataInfo.type) {
                    body['@odata.type'] = body._odataInfo.type;
                }
                delete body._odataInfo;
            }
            let headers = { 'Content-Type': 'application/json' };
            headers['Authorization'] = `Bearer ${yield this._getTokenAsync()}`;
            if (this.appNameKey !== '')
                headers[this.appNameKey] = appName || this.appName;
            let response;
            try {
                response = yield fetch(this._createUri(urlPath), { method: 'POST', body: JSON.stringify(body), headers: headers });
            }
            catch (error) {
                if (error.message != null && error.message.indexOf('Failed to fetch') !== -1)
                    return Promise.reject('Network error. Check your connection and try again.');
                return Promise.reject(error);
            }
            if (response.status === 204) {
                return Promise.resolve(null);
            }
            let json;
            try {
                json = yield response.json();
            }
            catch (error) {
                return Promise.reject(`The server sent back invalid JSON. ${error}`);
            }
            if (json.error != null) {
                return Promise.reject(json.error.message);
            }
            if (response.status === 201 || response.status === 200) {
                return Promise.resolve(json);
            }
            else {
                return Promise.reject('Request error, please try again later.');
            }
        });
    }
    patchAsync(urlPath, body, appName = null) {
        return __awaiter(this, void 0, void 0, function* () {
            // Add in the odata model info if it not already on the object
            if (body._odataInfo && !body['@odata.type']) {
                if (body._odataInfo.type) {
                    body['@odata.type'] = body._odataInfo.type;
                }
                delete body._odataInfo;
            }
            let headers = { 'Content-Type': 'application/json' };
            headers['Authorization'] = `Bearer ${yield this._getTokenAsync()}`;
            if (this.appNameKey !== '')
                headers[this.appNameKey] = appName || this.appName;
            let response;
            try {
                response = yield fetch(this._createUri(urlPath), { method: 'PATCH', body: JSON.stringify(body), headers: headers });
            }
            catch (error) {
                if (error.message != null && error.message.indexOf('Failed to fetch') !== -1)
                    return Promise.reject('Network error. Check your connection and try again.');
                return Promise.reject(error);
            }
            if (response.status === 204) {
                return Promise.resolve();
            }
            let json;
            try {
                json = yield response.json();
                if (json.error != null) {
                    return Promise.reject(json.error.message);
                }
                return Promise.reject('Request error, please try again later.');
            }
            catch (error) {
                return Promise.reject(`The server sent back invalid JSON. ${error}`);
            }
        });
    }
    patchReturnDtoAsync(urlPath, body, appName = null) {
        return __awaiter(this, void 0, void 0, function* () {
            // Add in the odata model info if it not already on the object
            if (body._odataInfo && !body['@odata.type']) {
                if (body._odataInfo.type) {
                    body['@odata.type'] = body._odataInfo.type;
                }
                delete body._odataInfo;
            }
            let headers = { 'Content-Type': 'application/json' };
            headers['Authorization'] = `Bearer ${yield this._getTokenAsync()}`;
            if (this.appNameKey !== '')
                headers[this.appNameKey] = appName || this.appName;
            headers['Prefer'] = 'return=representation';
            let response;
            try {
                response = yield fetch(this._createUri(urlPath), { method: 'PATCH', body: JSON.stringify(body), headers: headers });
            }
            catch (error) {
                if (error.message != null && error.message.indexOf('Failed to fetch') !== -1)
                    return Promise.reject('Network error. Check your connection and try again.');
                return Promise.reject(error);
            }
            let json;
            try {
                json = yield response.json();
                if (json.error != null) {
                    return Promise.reject(json.error.message);
                }
                if (response.status === 200) {
                    return Promise.resolve(json);
                }
                else {
                    return Promise.reject('Request error, please try again later.');
                }
            }
            catch (error) {
                return Promise.reject(`The server sent back invalid JSON. ${error}`);
            }
        });
    }
    deleteAsync(urlPath, appName = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let headers = { 'Content-Type': 'application/json' };
            headers['Authorization'] = `Bearer ${yield this._getTokenAsync()}`;
            if (this.appNameKey !== '')
                headers[this.appNameKey] = appName || this.appName;
            let response;
            try {
                response = yield fetch(this._createUri(urlPath), { method: 'DELETE', headers: headers });
            }
            catch (error) {
                if (error.message != null && error.message.indexOf('Failed to fetch') !== -1)
                    return Promise.reject('Network error. Check your connection and try again.');
                return Promise.reject(error);
            }
            if (response.status === 204) {
                return Promise.resolve();
            }
            if (response.status === 404) {
                return Promise.reject('Not Found');
            }
            let json;
            try {
                json = yield response.json();
            }
            catch (error) {
                return Promise.reject(`The server sent back invalid JSON. ${error}`);
            }
            if (json.error != null) {
                return Promise.reject(json.error.message);
            }
            if (response.status === 201) {
                return Promise.resolve(json);
            }
            else {
                return Promise.reject('Request error, please try again later.');
            }
        });
    }
    getAsync(urlPath, appName = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let headers = { 'Content-Type': 'application/json' };
            headers['Authorization'] = `Bearer ${yield this._getTokenAsync()}`;
            headers['Accept'] = 'application/json';
            if (this.appNameKey !== '')
                headers[this.appNameKey] = appName || this.appName;
            let response;
            try {
                response = yield fetch(this._createUri(urlPath), {
                    method: 'GET',
                    headers: headers
                });
            }
            catch (error) {
                if (error.message != null && error.message.indexOf('Failed to fetch') !== -1)
                    return Promise.reject('Network error. Check your connection and try again.');
                return Promise.reject(error);
            }
            let json;
            try {
                json = yield response.json();
            }
            catch (error) {
                return Promise.reject(`The server sent back invalid JSON. ${error}`);
            }
            if (json.error) {
                return Promise.reject(json.error.message);
            }
            return Promise.resolve(new GetResult(json));
        });
    }
};
__decorate([
    Polymer.decorators.property({ notify: true, type: Boolean })
], LssApiService.prototype, "isDev", void 0);
__decorate([
    Polymer.decorators.property({ notify: true, type: String })
], LssApiService.prototype, "baseUrl", void 0);
__decorate([
    Polymer.decorators.property({ type: Boolean })
], LssApiService.prototype, "isLoading", void 0);
__decorate([
    Polymer.decorators.property({ notify: true, type: String })
], LssApiService.prototype, "baseProductionUri", void 0);
__decorate([
    Polymer.decorators.property({ notify: true, type: String })
], LssApiService.prototype, "baseDevUri", void 0);
__decorate([
    Polymer.decorators.property({ notify: true, type: String })
], LssApiService.prototype, "appNameKey", void 0);
__decorate([
    Polymer.decorators.property({ notify: true, type: String })
], LssApiService.prototype, "appName", void 0);
__decorate([
    Polymer.decorators.query('lss-user-manager')
], LssApiService.prototype, "lssUserManager", void 0);
__decorate([
    Polymer.decorators.observe('isDev')
], LssApiService.prototype, "_environmentHandler", null);
LssApiService = __decorate([
    Polymer.decorators.customElement('lss-api-service')
], LssApiService);
class GetResult {
    constructor(json) {
        if (json['@odata.count'])
            this.odataCount = json['@odata.count'];
        if (Array.isArray(json.value)) {
            this.data = json.value.map((o) => {
                return GetResult.convertODataInfo(o);
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
            return GetResult.convertODataInfo(this.data[0]);
        }
        return null;
    }
    toList() {
        return this.data;
    }
    static convertODataInfo(item) {
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
class ODataDto {
    constructor(modelInfo = new ODataModelInfo()) {
        this._odataInfo = modelInfo;
    }
}
class ODataModelInfo {
    constructor() {
        this.type = null;
        this.shortType = null;
    }
}
//# sourceMappingURL=lss-api-service.js.map