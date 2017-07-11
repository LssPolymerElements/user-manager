var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let LssApiService = class LssApiService extends LssRequesterBehavior(Polymer.Element) {
    constructor() {
        super(...arguments);
        this.baseProductionUri = 'https://api2.leavitt.com/';
        this.baseDevUri = 'https://devapi2.leavitt.com/';
        this.appNameKey = 'X-LGAppName';
        this.appName = 'General';
    }
    connectedCallback() {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            _super("connectedCallback").call(this);
            try {
                this.tokenProvider = this.requestInstance('TokenProvider');
            }
            catch (error) {
                console.log('Token Provider not found. Service will use default lss-token-provider.');
            }
        });
    }
    ready() {
        super.ready();
        this.lssEnvironment = this.$.lssEnvironment;
        this.tokenProvider = this.$.lssTokenProvider;
    }
    environmentHandler(isDev) {
        this.baseUrl = isDev ? this.baseDevUri : this.baseProductionUri;
    }
    createUri(urlPath) {
        return this.baseUrl + urlPath;
    }
    postAsync(urlPath, body, appName = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let token = yield this.tokenProvider.getTokenAsync();
            if (token === null) {
                throw new Error('Redirect failed. Not authenticated.');
            }
            //Add in the odata model info if it not already on the object
            if (body._odataInfo && !body['@odata.type']) {
                if (body._odataInfo.type) {
                    body['@odata.type'] = body._odataInfo.type;
                }
                delete body._odataInfo;
            }
            let headers = { 'Content-Type': 'application/json' };
            headers['Authorization'] = `Bearer ${token}`;
            if (this.appNameKey !== '')
                headers[this.appNameKey] = appName || this.appName;
            let response;
            try {
                response = yield fetch(this.createUri(urlPath), {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: headers
                });
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
            if (response.status === 201) {
                return Promise.resolve(json);
            }
            else {
                return Promise.reject('Request error, please try again later.');
            }
        });
    }
    patchAsync(urlPath, body, appName = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let token = yield this.tokenProvider.getTokenAsync();
            if (token === null) {
                throw new Error('Redirect failed. Not authenticated.');
            }
            //Add in the odata model info if it not already on the object
            if (body._odataInfo && !body['@odata.type']) {
                if (body._odataInfo.type) {
                    body['@odata.type'] = body._odataInfo.type;
                }
                delete body._odataInfo;
            }
            let headers = { 'Content-Type': 'application/json' };
            headers['Authorization'] = `Bearer ${token}`;
            if (this.appNameKey !== '')
                headers[this.appNameKey] = appName || this.appName;
            let response;
            try {
                response = yield fetch(this.createUri(urlPath), {
                    method: 'PATCH',
                    body: JSON.stringify(body),
                    headers: headers
                });
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
            let token = yield this.tokenProvider.getTokenAsync();
            if (token === null) {
                throw new Error('Redirect failed. Not authenticated.');
            }
            //Add in the odata model info if it not already on the object
            if (body._odataInfo && !body['@odata.type']) {
                if (body._odataInfo.type) {
                    body['@odata.type'] = body._odataInfo.type;
                }
                delete body._odataInfo;
            }
            let headers = { 'Content-Type': 'application/json' };
            headers['Authorization'] = `Bearer ${token}`;
            if (this.appNameKey !== '')
                headers[this.appNameKey] = appName || this.appName;
            headers['Prefer'] = 'return=representation';
            let response;
            try {
                response = yield fetch(this.createUri(urlPath), {
                    method: 'PATCH',
                    body: JSON.stringify(body),
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
            let token = yield this.tokenProvider.getTokenAsync();
            if (token === null) {
                throw new Error('Redirect failed. Not authenticated.');
            }
            let headers = { 'Content-Type': 'application/json' };
            headers['Authorization'] = `Bearer ${token}`;
            if (this.appNameKey !== '')
                headers[this.appNameKey] = appName || this.appName;
            let response;
            try {
                response = yield fetch(this.createUri(urlPath), {
                    method: 'DELETE',
                    headers: headers
                });
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
            let token = yield this.tokenProvider.getTokenAsync();
            if (token === null) {
                throw new Error('Redirect failed. Not authenticated.');
            }
            let headers = { 'Content-Type': 'application/json' };
            headers['Authorization'] = `Bearer ${token}`;
            headers['Accept'] = 'application/json';
            if (this.appNameKey !== '')
                headers[this.appNameKey] = appName || this.appName;
            let response;
            try {
                response = yield fetch(this.createUri(urlPath), {
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
    property({ notify: true }),
    __metadata("design:type", Object)
], LssApiService.prototype, "tokenProvider", void 0);
__decorate([
    property({ notify: true }),
    __metadata("design:type", LssEnvironment)
], LssApiService.prototype, "lssEnvironment", void 0);
__decorate([
    property({ notify: true }),
    __metadata("design:type", Boolean)
], LssApiService.prototype, "isDev", void 0);
__decorate([
    property({ notify: true }),
    __metadata("design:type", String)
], LssApiService.prototype, "baseUrl", void 0);
__decorate([
    property(),
    __metadata("design:type", Boolean)
], LssApiService.prototype, "isLoading", void 0);
__decorate([
    property({ notify: true }),
    __metadata("design:type", String)
], LssApiService.prototype, "baseProductionUri", void 0);
__decorate([
    property({ notify: true }),
    __metadata("design:type", String)
], LssApiService.prototype, "baseDevUri", void 0);
__decorate([
    property({ notify: true }),
    __metadata("design:type", String)
], LssApiService.prototype, "appNameKey", void 0);
__decorate([
    property({ notify: true }),
    __metadata("design:type", String)
], LssApiService.prototype, "appName", void 0);
__decorate([
    observe('isDev'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", void 0)
], LssApiService.prototype, "environmentHandler", null);
LssApiService = __decorate([
    customElement('lss-api-service')
], LssApiService);
