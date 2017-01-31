var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
        step((generator = generator.apply(thisArg, _arguments)).next());
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
/// <reference path="./user.ts" />
var LssUserManager = (function (_super) {
    __extends(LssUserManager, _super);
    function LssUserManager() {
        var _this = _super.apply(this, arguments) || this;
        _this.localStorageKey = "LgUser";
        _this.lastIssuer = null;
        _this.getUserAsyncPromise = null;
        return _this;
    }
    LssUserManager.prototype.attached = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.shouldValidateOnLoad)
                            return [3 /*break*/, 2];
                        return [4 /*yield*/, this.authenticateAndGetUserAsync()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    LssUserManager.prototype.redirectToLogin = function (continueUrl) {
        //console.log("REDIRECT!");
        document.location.href = this.updateQueryString("continue", continueUrl, this.redirectUrl);
    };
    ;
    LssUserManager.prototype.getHashParametersFromUrl = function () {
        var hashParams = new Array();
        if (window.location.hash) {
            var hash = window.location.hash.substring(1);
            hash = decodeURIComponent(hash);
            var hashArray = hash.split("&");
            for (var i in hashArray) {
                if (hashArray.hasOwnProperty(i)) {
                    var keyValPair = hashArray[i].split("=");
                    if (keyValPair.length > 1) {
                        hashParams.push(new HashParameter(keyValPair[0], decodeURIComponent(keyValPair[1])));
                    }
                }
            }
        }
        return hashParams;
    };
    ;
    LssUserManager.prototype.clearHashFromUrl = function () {
        document.location.hash = "";
    };
    ;
    LssUserManager.prototype.getTokenfromUrl = function (tokenName) {
        var hashParameters = this.getHashParametersFromUrl();
        var accessTokenArray = hashParameters.filter(function (value) { return value.key === tokenName; });
        if (accessTokenArray.length === 0) {
            return null;
        }
        else {
            return accessTokenArray[0].value;
        }
    };
    LssUserManager.prototype.decodeAccessToken = function (accessToken) {
        return jwt_decode(accessToken);
    };
    LssUserManager.prototype.createUserFromToken = function (refreshToken, accessToken) {
        var decodedToken;
        try {
            decodedToken = this.decodeAccessToken(accessToken);
        }
        catch (error) {
            // Invalid JWT token format
            return null;
        }
        this.lastIssuer = decodedToken.iss;
        var expirationDate = new Date(0);
        expirationDate.setUTCSeconds(decodedToken.exp);
        var currentDate = new Date();
        currentDate.setSeconds(currentDate.getSeconds() + 30);
        if (!(expirationDate > currentDate && this.userManagerIssuers.some(function (o) { return o.Issurer === decodedToken.iss; }))) {
            //Access token expired or not from a valid issuer
            return null;
        }
        this.set("roles", decodedToken.role);
        this.set("fullname", decodedToken.unique_name);
        this.set("firstName", decodedToken.given_name);
        this.set("personId", parseInt(decodedToken.nameid) || 0);
        //this.set("roles", ["Hire Employee", "Terminate Employee", "Transfer Employee"]);
        return new User(decodedToken.given_name, decodedToken.family_name, expirationDate, this.personId, decodedToken.role, refreshToken, accessToken, decodedToken.unique_name, decodedToken.unique_name, decodedToken.RefreshTokenId);
    };
    ;
    LssUserManager.prototype.getAccessTokenFromApiAsync = function (refreshToken, uri) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var body, response, json, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    body = {
                                        grant_type: "refresh_token",
                                        refresh_token: refreshToken
                                    };
                                    return [4 /*yield*/, fetch(uri, {
                                            method: "POST",
                                            body: JSON.stringify(body),
                                            headers: {
                                                "Content-Type": "application/json",
                                                "Accept": "application/json"
                                            }
                                        })];
                                case 1:
                                    response = _a.sent();
                                    _a.label = 2;
                                case 2:
                                    _a.trys.push([2, 4, , 5]);
                                    return [4 /*yield*/, response.json()];
                                case 3:
                                    json = _a.sent();
                                    return [3 /*break*/, 5];
                                case 4:
                                    error_1 = _a.sent();
                                    reject("The server sent back invalid JSON.");
                                    return [2 /*return*/];
                                case 5:
                                    if (response.status === 200 && json.access_token) {
                                        resolve(json.access_token);
                                        return [2 /*return*/];
                                    }
                                    if (json.error) {
                                        if (json.error === "unauthorized_client") {
                                            reject("Not authenticated");
                                            return [2 /*return*/];
                                        }
                                        reject(json.error);
                                        return [2 /*return*/];
                                    }
                                    reject("Not authenticated");
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    LssUserManager.prototype.getUserAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        var accessToken, refreshToken, localStorageUser, user, hasToken, issuers, _i, issuers_1, issuer, error_2, user, error_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    accessToken = this.getTokenfromUrl("accessToken");
                                    refreshToken = this.getTokenfromUrl("refreshToken");
                                    if (accessToken || refreshToken) {
                                        this.clearHashFromUrl();
                                    }
                                    else {
                                        localStorageUser = User.fromLocalStorage(this.localStorageKey);
                                        if (localStorageUser != null) {
                                            this.set("roles", localStorageUser.roles);
                                            this.set("fullname", localStorageUser.fullName);
                                            this.set("firstName", localStorageUser.firstName);
                                            this.set("personId", localStorageUser.personId);
                                            accessToken = localStorageUser.accessToken;
                                            refreshToken = localStorageUser.refreshToken;
                                        }
                                    }
                                    ////valid local tokens
                                    if (accessToken != null) {
                                        user = this.createUserFromToken(refreshToken || "", accessToken);
                                        if (user != null) {
                                            user.saveToLocalStorage(this.localStorageKey);
                                            resolve(user);
                                            return [2 /*return*/];
                                        }
                                    }
                                    if (!(refreshToken != null))
                                        return [3 /*break*/, 9];
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 8, , 9]);
                                    hasToken = false;
                                    issuers = this.userManagerIssuers;
                                    if (this.lastIssuer != null) {
                                        issuers = issuers.filter(function (o) { return o.Issurer === _this.lastIssuer; });
                                    }
                                    _i = 0, issuers_1 = issuers;
                                    _a.label = 2;
                                case 2:
                                    if (!(_i < issuers_1.length))
                                        return [3 /*break*/, 7];
                                    issuer = issuers_1[_i];
                                    if (hasToken)
                                        return [2 /*return*/];
                                    _a.label = 3;
                                case 3:
                                    _a.trys.push([3, 5, , 6]);
                                    return [4 /*yield*/, this.getAccessTokenFromApiAsync(refreshToken, issuer.TokenUri)];
                                case 4:
                                    accessToken = _a.sent();
                                    hasToken = true;
                                    return [3 /*break*/, 6];
                                case 5:
                                    error_2 = _a.sent();
                                    return [3 /*break*/, 6];
                                case 6:
                                    _i++;
                                    return [3 /*break*/, 2];
                                case 7:
                                    user = this.createUserFromToken(refreshToken || "", accessToken);
                                    if (user != null) {
                                        user.saveToLocalStorage(this.localStorageKey);
                                        return [2 /*return*/, Promise.resolve(user)];
                                    }
                                    reject("Not authenticated");
                                    return [2 /*return*/];
                                case 8:
                                    error_3 = _a.sent();
                                    reject(error_3);
                                    return [2 /*return*/];
                                case 9:
                                    reject("Not authenticated");
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    ;
    LssUserManager.prototype.updateQueryString = function (key, value, url) {
        if (!url)
            url = window.location.href;
        var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi");
        var hash;
        if (re.test(url)) {
            if (typeof value !== "undefined" && value !== null)
                return url.replace(re, "$1" + key + "=" + value + "$2$3");
            else {
                hash = url.split("#");
                url = hash[0].replace(re, "$1$3").replace(/(&|\?)$/, "");
                if (typeof hash[1] !== "undefined" && hash[1] !== null)
                    url += "#" + hash[1];
                return url;
            }
        }
        else {
            if (typeof value !== "undefined" && value !== null) {
                var separator = url.indexOf("?") !== -1 ? "&" : "?";
                hash = url.split("#");
                url = hash[0] + separator + key + "=" + value;
                if (typeof hash[1] !== "undefined" && hash[1] !== null)
                    url += "#" + hash[1];
                return url;
            }
            else
                return url;
        }
    };
    LssUserManager.prototype.logoutAsync = function () {
        localStorage.removeItem(this.localStorageKey);
        //TODO:  POST TO API TO EXPIRE REFRESH TOKEN
        return Promise.resolve(null);
    };
    ;
    LssUserManager.prototype.authenticateAndGetUserAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var getUserAsyncPromise, user, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.getUserAsyncPromise != null) {
                            return [2 /*return*/, this.getUserAsyncPromise];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        getUserAsyncPromise = this.getUserAsync();
                        this.getUserAsyncPromise = getUserAsyncPromise;
                        return [4 /*yield*/, this.getUserAsyncPromise];
                    case 2:
                        user = _a.sent();
                        this.getUserAsyncPromise = null;
                        return [2 /*return*/, getUserAsyncPromise];
                    case 3:
                        error_4 = _a.sent();
                        if (error_4 === "Not authenticated") {
                            this.redirectToLogin(document.location.href);
                            //Wait for the redirect to happen
                            return [2 /*return*/, new Promise(function (resolve, reject) {
                                    setTimeout(function () {
                                        resolve();
                                    }, 10000000);
                                })];
                        }
                        return [2 /*return*/, Promise.resolve(null)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ;
    LssUserManager.prototype.authenticateAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getUserAsync()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(null)];
                    case 2:
                        error_5 = _a.sent();
                        this.redirectToLogin(document.location.href);
                        //Wait for the redirect to happen
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                setTimeout(function () {
                                    resolve();
                                }, 10000000);
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    return LssUserManager;
}(polymer.Base));
__decorate([
    property({
        type: String,
        notify: true,
        value: "https://login.leavitt.com/oauth/"
    })
], LssUserManager.prototype, "redirectUrl", void 0);
__decorate([
    property({
        type: Array,
        notify: true
    })
], LssUserManager.prototype, "roles", void 0);
__decorate([
    property({
        type: String,
        notify: true
    })
], LssUserManager.prototype, "fullname", void 0);
__decorate([
    property({
        type: String,
        notify: true
    })
], LssUserManager.prototype, "firstName", void 0);
__decorate([
    property({
        type: Array,
        value: [new userManagerIssuer("https://oauth2.leavitt.com/", "https://oauth2.leavitt.com/token"),
            new userManagerIssuer("https://loginapi.unitedvalley.com/", "https://loginapi.unitedvalley.com/Token")]
    })
], LssUserManager.prototype, "userManagerIssuers", void 0);
__decorate([
    property({
        type: Boolean,
        notify: true,
        value: true,
        reflectToAttribute: true
    })
], LssUserManager.prototype, "shouldValidateOnLoad", void 0);
__decorate([
    property({
        value: 0,
        type: Number,
        notify: true
    })
], LssUserManager.prototype, "personId", void 0);
LssUserManager = __decorate([
    component("lss-user-manager")
], LssUserManager);
LssUserManager.register();
//# sourceMappingURL=lss-user-manager.js.map