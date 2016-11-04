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
/// <reference path="./user.ts" />
var UserManager = (function (_super) {
    __extends(UserManager, _super);
    function UserManager() {
        _super.apply(this, arguments);
        this.loginUrl = "https://login.leavitt.com/oauth/";
        this.localStorageKey = "LgUser";
    }
    Object.defineProperty(UserManager.prototype, "user", {
        get: function () { return this._user; },
        enumerable: true,
        configurable: true
    });
    UserManager.prototype.attached = function () {
        if (this.shouldValidateOnLoad) {
            this.authenticateAndGetUserAsync().then();
        }
    };
    UserManager.prototype.redirectToLogin = function (continueUrl) {
        document.location.href = this.updateQueryString("continue", continueUrl, this.loginUrl);
    };
    ;
    UserManager.prototype.getHashParametersFromUrl = function () {
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
    UserManager.prototype.clearHashFromUrl = function () {
        document.location.hash = "";
    };
    ;
    UserManager.prototype.getLocalTokens = function () {
        //First type and get tokens from URL
        var hashParameters = this.getHashParametersFromUrl();
        if (hashParameters.length > 0) {
            var accessTokenArray = hashParameters.filter(function (value) { return value.key === "accessToken"; });
            if (accessTokenArray.length === 0) {
                this.accessToken = "";
            }
            else {
                this.accessToken = accessTokenArray[0].value || "";
            }
            this.refreshToken = hashParameters.filter(function (value) { return value.key === "refreshToken"; })[0].value;
            this.clearHashFromUrl();
        }
        else {
            //Fallback get tokens from localstorage if user has been here before
            var localStorageUser = User.fromLocalStorage(this.localStorageKey);
            if (localStorageUser != null) {
                this.set("roles", localStorageUser.roles);
                this.set("fullname", localStorageUser.fullName);
                this.set("firstName", localStorageUser.firstName);
                this.set("personId", localStorageUser.personId);
                this.accessToken = localStorageUser.accessToken;
                this.refreshToken = localStorageUser.refreshToken;
            }
        }
    };
    ;
    UserManager.prototype.decodeAccessToken = function (accessToken) {
        if (accessToken === null || typeof accessToken === "undefined")
            return null;
        return jwt_decode(accessToken);
    };
    UserManager.prototype.isTokenValid = function (accessToken) {
        if (accessToken === null || accessToken === "" || typeof accessToken === "undefined")
            return false;
        var decodedToken = this.decodeAccessToken(accessToken);
        var expirationDate = new Date(0);
        expirationDate.setUTCSeconds(decodedToken.exp);
        var currentDate = new Date();
        currentDate.setSeconds(currentDate.getSeconds() + 30);
        return (expirationDate > currentDate && decodedToken.iss === "https://oauth2.leavitt.com/");
    };
    ;
    UserManager.prototype.createUserFromToken = function (refreshToken, accessToken) {
        var decodedToken = this.decodeAccessToken(accessToken);
        var expirationDate = new Date(0);
        expirationDate.setUTCSeconds(decodedToken.exp);
        this.set("roles", decodedToken.role);
        this.set("fullname", decodedToken.unique_name);
        this.set("firstName", decodedToken.given_name);
        this.set("personId", parseInt(decodedToken.nameid) || 0);
        //this.set("roles", ["Hire Employee", "Terminate Employee", "Transfer Employee"]);
        return new User(decodedToken.given_name, decodedToken.family_name, expirationDate, this.personId, decodedToken.role, refreshToken, accessToken, decodedToken.unique_name, decodedToken.unique_name, decodedToken.RefreshTokenId);
    };
    ;
    UserManager.prototype.getAccessTokenFromApiAsync = function (refreshToken) {
        var body = {
            grant_type: "refresh_token",
            refresh_token: refreshToken
        };
        return fetch("https://oauth2.leavitt.com/token", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        }).then(function (response) {
            if (response.status === 200)
                return response.json();
            return response.json()
                .catch(function (error) {
                return Promise.reject("The server sent back invalid JSON.");
            }).then(function (json) {
                if (json.error) {
                    return Promise.reject(json.error);
                }
                return Promise.reject("Not authenticated");
            });
        }).then(function (json) { return Promise.resolve(json.access_token); });
    };
    UserManager.prototype.fetchAccessTokenAsync = function () {
        var _this = this;
        this.getLocalTokens();
        ////valid local tokens
        if (this.accessToken != null && this.isTokenValid(this.accessToken)) {
            this._user = this.createUserFromToken(this.refreshToken, this.accessToken);
            this.user.saveToLocalStorage(this.localStorageKey);
            return Promise.resolve(this.accessToken);
        }
        if (this.refreshToken != null) {
            return this.getAccessTokenFromApiAsync(this.refreshToken).then(function (token) {
                _this.accessToken = token;
                if (_this.isTokenValid(_this.accessToken)) {
                    _this._user = _this.createUserFromToken(_this.refreshToken, _this.accessToken);
                    _this.user.saveToLocalStorage(_this.localStorageKey);
                    return Promise.resolve(_this.accessToken);
                }
                return Promise.reject("Not authenticated");
            }).catch(function (o) {
                return Promise.reject("Not authenticated");
            });
        }
        return Promise.reject("Not authenticated");
    };
    ;
    UserManager.prototype.updateQueryString = function (key, value, url) {
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
    UserManager.prototype.logoutAsync = function () {
        this.accessToken = null;
        this.refreshToken = null;
        localStorage.removeItem(this.localStorageKey);
        //TODO:  POST TO API TO EXPIRE REFRESH TOKEN
        return Promise.resolve(null);
    };
    ;
    UserManager.prototype.authenticateAndGetUserAsync = function () {
        var _this = this;
        return this.fetchAccessTokenAsync()
            .catch(function (error) {
            if (error === "Not authenticated")
                _this.redirectToLogin(document.location.href);
        })
            .then(function (token) {
            return Promise.resolve(_this._user);
        });
    };
    ;
    UserManager.prototype.authenticateAsync = function () {
        var _this = this;
        return this.fetchAccessTokenAsync()
            .catch(function (error) { return _this.redirectToLogin(document.location.href); })
            .then(function (token) { return Promise.resolve(null); });
    };
    ;
    __decorate([
        property({
            type: Array,
            notify: true
        })
    ], UserManager.prototype, "roles", void 0);
    __decorate([
        property({
            type: String,
            notify: true
        })
    ], UserManager.prototype, "fullname", void 0);
    __decorate([
        property({
            type: String,
            notify: true
        })
    ], UserManager.prototype, "firstName", void 0);
    __decorate([
        property({
            type: Boolean,
            notify: true,
            value: true,
            reflectToAttribute: true
        })
    ], UserManager.prototype, "shouldValidateOnLoad", void 0);
    __decorate([
        property({
            value: 0,
            type: Number,
            notify: true
        })
    ], UserManager.prototype, "personId", void 0);
    UserManager = __decorate([
        component("user-manager")
    ], UserManager);
    return UserManager;
}(polymer.Base));
UserManager.register();
