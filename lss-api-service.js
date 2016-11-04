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
var LssApiService = (function (_super) {
    __extends(LssApiService, _super);
    function LssApiService() {
        _super.apply(this, arguments);
        this.baseProductionUri = "https://api2.leavitt.com/";
        this.baseDevUri = "https://devapi2.leavitt.com/";
    }
    LssApiService.prototype.attached = function () {
        this.userManager = this.requestInstance("UserManager");
        this.lgEnvironment = this.requestInstance("LgEnvironment");
    };
    LssApiService.prototype.createUri = function (urlPath) {
        return (this.lgEnvironment.isDev() ? this.baseDevUri : this.baseProductionUri) + urlPath;
    };
    LssApiService.prototype.postAsync = function (urlPath, body, appName) {
        var _this = this;
        if (appName === void 0) { appName = "General"; }
        return this.userManager.authenticateAndGetUserAsync()
            .then(function (o) {
            return fetch(_this.createUri(urlPath), {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + o.accessToken,
                    "X-LGAppName": appName
                }
            })
                .then(function (response) {
                if (response.status === 204) {
                    return Promise.resolve();
                }
                return response.json()
                    .then(function (json) {
                    if (json.error != null) {
                        return Promise.reject(json.error.message);
                    }
                    if (response.status === 201) {
                        return Promise.resolve(json);
                    }
                    else {
                        return Promise.reject("Request error, please try again later.");
                    }
                }, function (error) {
                    return Promise.reject("The server sent back invalid JSON. " + error);
                });
            }, function (error) {
                if (error.message != null && error.message.indexOf("Failed to fetch") !== -1)
                    return Promise.reject("Network error. Check your connection and try again.");
                return Promise.reject(error);
            });
        });
    };
    LssApiService.prototype.patchAsync = function (urlPath, body, appName) {
        var _this = this;
        if (appName === void 0) { appName = "General"; }
        return this.userManager.authenticateAndGetUserAsync()
            .then(function (o) {
            return fetch(_this.createUri(urlPath), {
                method: "PATCH",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + o.accessToken,
                    "X-LGAppName": appName
                }
            })
                .then(function (response) {
                if (response.status === 204) {
                    return Promise.resolve();
                }
                return response.json()
                    .then(function (json) {
                    if (json.error != null) {
                        return Promise.reject(json.error.message);
                    }
                    if (response.status === 201) {
                        return Promise.resolve(json);
                    }
                    else {
                        return Promise.reject("Request error, please try again later.");
                    }
                }, function (error) {
                    return Promise.reject("The server sent back invalid JSON. " + error);
                });
            }, function (error) {
                if (error.message != null && error.message.indexOf("Failed to fetch") !== -1)
                    return Promise.reject("Network error. Check your connection and try again.");
                return Promise.reject(error);
            });
        });
    };
    LssApiService.prototype.deleteAsync = function (urlPath, appName) {
        var _this = this;
        if (appName === void 0) { appName = "General"; }
        return this.userManager.authenticateAndGetUserAsync()
            .then(function (o) {
            return fetch(_this.createUri(urlPath), {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + o.accessToken,
                    "X-LGAppName": appName
                }
            })
                .then(function (response) {
                if (response.status === 204) {
                    return Promise.resolve();
                }
                return response.json()
                    .then(function (json) {
                    if (json.error != null) {
                        return Promise.reject(json.error.message);
                    }
                    if (response.status === 201) {
                        return Promise.resolve(json);
                    }
                    else {
                        return Promise.reject("Request error, please try again later.");
                    }
                }, function (error) {
                    return Promise.reject("The server sent back invalid JSON. " + error);
                });
            }, function (error) {
                if (error.message != null && error.message.indexOf("Failed to fetch") !== -1)
                    return Promise.reject("Network error. Check your connection and try again.");
                return Promise.reject(error);
            });
        });
    };
    LssApiService.prototype.getAsync = function (urlPath, appName) {
        var _this = this;
        if (appName === void 0) { appName = "General"; }
        return this.userManager.authenticateAndGetUserAsync().then(function (o) {
            return fetch(_this.createUri(urlPath), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Bearer " + o.accessToken,
                    "X-LGAppName": appName
                }
            })
                .then(function (response) {
                return response.json()
                    .then(function (json) {
                    if (json.error) {
                        return Promise.reject(json.error.message);
                    }
                    return Promise.resolve(new GetResult(json));
                }, function (error) {
                    return Promise.reject("The server sent back invalid JSON. " + error);
                });
            }, function (error) {
                if (error.message != null && error.message.indexOf("Failed to fetch") !== -1)
                    return Promise.reject("Network error. Check your connection and try again.");
                return Promise.reject(error);
            });
        });
    };
    __decorate([
        property({
            type: LssUserManager,
            notify: true
        })
    ], LssApiService.prototype, "userManager", void 0);
    __decorate([
        property({
            type: LssEnvironment,
            notify: true
        })
    ], LssApiService.prototype, "lgEnvironment", void 0);
    __decorate([
        property()
    ], LssApiService.prototype, "isLoading", void 0);
    LssApiService = __decorate([
        behavior(LssRequesterBehavior),
        component("lss-api-service")
    ], LssApiService);
    return LssApiService;
}(polymer.Base));
LssApiService.register();
