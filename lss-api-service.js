var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var LssApiService = (function (_super) {
    __extends(LssApiService, _super);
    function LssApiService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LssApiService.prototype.attached = function () {
        try {
            this.tokenProvider = this.requestInstance("TokenProvider");
        }
        catch (error) {
            console.log("Token Provider not found. Service will use default lss-token-provider.");
            this.tokenProvider = this.$.lssTokenProvider;
        }
        this.lssEnvironment = this.$.lssEnvironment;
    };
    LssApiService.prototype.environmentHandler = function () {
        this.baseUrl = this.$.lssEnvironment.isDev ? this.baseDevUri : this.baseProductionUri;
    };
    LssApiService.prototype.createUri = function (urlPath) {
        return this.baseUrl + urlPath;
    };
    LssApiService.prototype.postAsync = function (urlPath, body, appName) {
        if (appName === void 0) { appName = null; }
        return __awaiter(this, void 0, void 0, function () {
            var token, headers, response, error_1, json, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tokenProvider.getTokenAsync()];
                    case 1:
                        token = _a.sent();
                        if (token === null) {
                            throw new Error("Redirect failed. Not authenticated.");
                        }
                        //Add in the odata model info if it not already on the object
                        if (body._odataInfo && !body["@odata.type"]) {
                            if (body._odataInfo.type) {
                                body["@odata.type"] = body._odataInfo.type;
                            }
                            delete body._odataInfo;
                        }
                        headers = { "Content-Type": "application/json" };
                        headers["Authorization"] = "Bearer " + token;
                        if (this.appNameKey !== "")
                            headers[this.appNameKey] = appName || this.appName;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fetch(this.createUri(urlPath), {
                                method: "POST",
                                body: JSON.stringify(body),
                                headers: headers
                            })];
                    case 3:
                        response = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        if (error_1.message != null && error_1.message.indexOf("Failed to fetch") !== -1)
                            return [2 /*return*/, Promise.reject("Network error. Check your connection and try again.")];
                        return [2 /*return*/, Promise.reject(error_1)];
                    case 5:
                        if (response.status === 204) {
                            return [2 /*return*/, Promise.resolve(null)];
                        }
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, response.json()];
                    case 7:
                        json = _a.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        error_2 = _a.sent();
                        return [2 /*return*/, Promise.reject("The server sent back invalid JSON. " + error_2)];
                    case 9:
                        if (json.error != null) {
                            return [2 /*return*/, Promise.reject(json.error.message)];
                        }
                        if (response.status === 201) {
                            return [2 /*return*/, Promise.resolve(json)];
                        }
                        else {
                            return [2 /*return*/, Promise.reject("Request error, please try again later.")];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    LssApiService.prototype.patchAsync = function (urlPath, body, appName) {
        if (appName === void 0) { appName = null; }
        return __awaiter(this, void 0, void 0, function () {
            var token, headers, response, error_3, json, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tokenProvider.getTokenAsync()];
                    case 1:
                        token = _a.sent();
                        if (token === null) {
                            throw new Error("Redirect failed. Not authenticated.");
                        }
                        //Add in the odata model info if it not already on the object
                        if (body._odataInfo && !body["@odata.type"]) {
                            if (body._odataInfo.type) {
                                body["@odata.type"] = body._odataInfo.type;
                            }
                            delete body._odataInfo;
                        }
                        headers = { "Content-Type": "application/json" };
                        headers["Authorization"] = "Bearer " + token;
                        if (this.appNameKey !== "")
                            headers[this.appNameKey] = appName || this.appName;
                        ;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fetch(this.createUri(urlPath), {
                                method: "PATCH",
                                body: JSON.stringify(body),
                                headers: headers
                            })];
                    case 3:
                        response = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_3 = _a.sent();
                        if (error_3.message != null && error_3.message.indexOf("Failed to fetch") !== -1)
                            return [2 /*return*/, Promise.reject("Network error. Check your connection and try again.")];
                        return [2 /*return*/, Promise.reject(error_3)];
                    case 5:
                        if (response.status === 204) {
                            return [2 /*return*/, Promise.resolve()];
                        }
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, response.json()];
                    case 7:
                        json = _a.sent();
                        if (json.error != null) {
                            return [2 /*return*/, Promise.reject(json.error.message)];
                        }
                        return [2 /*return*/, Promise.reject("Request error, please try again later.")];
                    case 8:
                        error_4 = _a.sent();
                        return [2 /*return*/, Promise.reject("The server sent back invalid JSON. " + error_4)];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    LssApiService.prototype.patchReturnDtoAsync = function (urlPath, body, appName) {
        if (appName === void 0) { appName = null; }
        return __awaiter(this, void 0, void 0, function () {
            var token, headers, response, error_5, json, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tokenProvider.getTokenAsync()];
                    case 1:
                        token = _a.sent();
                        if (token === null) {
                            throw new Error("Redirect failed. Not authenticated.");
                        }
                        //Add in the odata model info if it not already on the object
                        if (body._odataInfo && !body["@odata.type"]) {
                            if (body._odataInfo.type) {
                                body["@odata.type"] = body._odataInfo.type;
                            }
                            delete body._odataInfo;
                        }
                        headers = { "Content-Type": "application/json" };
                        headers["Authorization"] = "Bearer " + token;
                        if (this.appNameKey !== "")
                            headers[this.appNameKey] = appName || this.appName;
                        ;
                        headers["Prefer"] = "return=representation";
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fetch(this.createUri(urlPath), {
                                method: "PATCH",
                                body: JSON.stringify(body),
                                headers: headers
                            })];
                    case 3:
                        response = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_5 = _a.sent();
                        if (error_5.message != null && error_5.message.indexOf("Failed to fetch") !== -1)
                            return [2 /*return*/, Promise.reject("Network error. Check your connection and try again.")];
                        return [2 /*return*/, Promise.reject(error_5)];
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, response.json()];
                    case 6:
                        json = _a.sent();
                        if (json.error != null) {
                            return [2 /*return*/, Promise.reject(json.error.message)];
                        }
                        if (response.status === 200) {
                            return [2 /*return*/, Promise.resolve(json)];
                        }
                        else {
                            return [2 /*return*/, Promise.reject("Request error, please try again later.")];
                        }
                        return [3 /*break*/, 8];
                    case 7:
                        error_6 = _a.sent();
                        return [2 /*return*/, Promise.reject("The server sent back invalid JSON. " + error_6)];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    LssApiService.prototype.deleteAsync = function (urlPath, appName) {
        if (appName === void 0) { appName = null; }
        return __awaiter(this, void 0, void 0, function () {
            var token, headers, response, error_7, json, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tokenProvider.getTokenAsync()];
                    case 1:
                        token = _a.sent();
                        if (token === null) {
                            throw new Error("Redirect failed. Not authenticated.");
                        }
                        headers = { "Content-Type": "application/json" };
                        headers["Authorization"] = "Bearer " + token;
                        if (this.appNameKey !== "")
                            headers[this.appNameKey] = appName || this.appName;
                        ;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fetch(this.createUri(urlPath), {
                                method: "DELETE",
                                headers: headers
                            })];
                    case 3:
                        response = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_7 = _a.sent();
                        if (error_7.message != null && error_7.message.indexOf("Failed to fetch") !== -1)
                            return [2 /*return*/, Promise.reject("Network error. Check your connection and try again.")];
                        return [2 /*return*/, Promise.reject(error_7)];
                    case 5:
                        if (response.status === 204) {
                            return [2 /*return*/, Promise.resolve()];
                        }
                        if (response.status === 404) {
                            return [2 /*return*/, Promise.reject("Not Found")];
                        }
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, response.json()];
                    case 7:
                        json = _a.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        error_8 = _a.sent();
                        return [2 /*return*/, Promise.reject("The server sent back invalid JSON. " + error_8)];
                    case 9:
                        if (json.error != null) {
                            return [2 /*return*/, Promise.reject(json.error.message)];
                        }
                        if (response.status === 201) {
                            return [2 /*return*/, Promise.resolve(json)];
                        }
                        else {
                            return [2 /*return*/, Promise.reject("Request error, please try again later.")];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    LssApiService.prototype.getAsync = function (urlPath, appName) {
        if (appName === void 0) { appName = null; }
        return __awaiter(this, void 0, void 0, function () {
            var token, headers, response, error_9, json, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tokenProvider.getTokenAsync()];
                    case 1:
                        token = _a.sent();
                        if (token === null) {
                            throw new Error("Redirect failed. Not authenticated.");
                        }
                        headers = { "Content-Type": "application/json" };
                        headers["Authorization"] = "Bearer " + token;
                        headers["Accept"] = "application/json";
                        if (this.appNameKey !== "")
                            headers[this.appNameKey] = appName || this.appName;
                        ;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fetch(this.createUri(urlPath), {
                                method: "GET",
                                headers: headers
                            })];
                    case 3:
                        response = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_9 = _a.sent();
                        if (error_9.message != null && error_9.message.indexOf("Failed to fetch") !== -1)
                            return [2 /*return*/, Promise.reject("Network error. Check your connection and try again.")];
                        return [2 /*return*/, Promise.reject(error_9)];
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, response.json()];
                    case 6:
                        json = _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        error_10 = _a.sent();
                        return [2 /*return*/, Promise.reject("The server sent back invalid JSON. " + error_10)];
                    case 8:
                        if (json.error) {
                            return [2 /*return*/, Promise.reject(json.error.message)];
                        }
                        return [2 /*return*/, Promise.resolve(new GetResult(json))];
                }
            });
        });
    };
    return LssApiService;
}(polymer.Base));
__decorate([
    property({
        type: Object,
        notify: true
    })
], LssApiService.prototype, "tokenProvider", void 0);
__decorate([
    property({
        type: LssEnvironment,
        notify: true
    })
], LssApiService.prototype, "lssEnvironment", void 0);
__decorate([
    property({
        type: Boolean,
        notify: true
    })
], LssApiService.prototype, "isDev", void 0);
__decorate([
    property({
        type: String,
        notify: true
    })
], LssApiService.prototype, "baseUrl", void 0);
__decorate([
    property()
], LssApiService.prototype, "isLoading", void 0);
__decorate([
    property({
        type: String,
        value: "https://api2.leavitt.com/",
        notify: true
    })
], LssApiService.prototype, "baseProductionUri", void 0);
__decorate([
    property({
        type: String,
        value: "https://devapi2.leavitt.com/",
        notify: true
    })
], LssApiService.prototype, "baseDevUri", void 0);
__decorate([
    property({
        type: String,
        value: "X-LGAppName",
        notify: true
    })
], LssApiService.prototype, "appNameKey", void 0);
__decorate([
    property({
        type: String,
        value: "General",
        notify: true
    })
], LssApiService.prototype, "appName", void 0);
__decorate([
    observe("isDev")
], LssApiService.prototype, "environmentHandler", null);
LssApiService = __decorate([
    behavior(LssRequesterBehavior),
    component("lss-api-service")
], LssApiService);
LssApiService.register();
//# sourceMappingURL=lss-api-service.js.map