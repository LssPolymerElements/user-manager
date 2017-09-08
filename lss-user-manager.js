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
class HashParameter {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
}
class UserManagerIssuer {
    constructor(issuer, tokenUri) {
        this.issuer = issuer;
        this.tokenUri = tokenUri;
    }
}
class User {
    constructor(firstName, lastName, expirationDate, personId, roles, refreshToken, accessToken, username, fullName, refreshTokenId) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.expirationDate = expirationDate;
        this.personId = personId;
        this.roles = roles;
        this.refreshToken = refreshToken;
        this.accessToken = accessToken;
        this.username = username;
        this.fullName = fullName;
        this.refreshTokenId = refreshTokenId;
    }
    clearToken() {
        this.expirationDate = new Date(Date.now());
        this.refreshToken = null;
        this.accessToken = null;
    }
    saveToLocalStorage(localStorageKey) {
        const data = JSON.stringify(this);
        window.localStorage.setItem(localStorageKey, data);
    }
    static fromLocalStorage(localStorageKey) {
        const data = JSON.parse(window.localStorage.getItem(localStorageKey) || '{}');
        if (data == null || data.refreshToken == null) {
            return null;
        }
        return new User(data.firstName, data.lastName, data.expirationDate, data.personId, data.roles, data.refreshToken, data.accessToken, data.username, data.fullName, data.refreshTokenId);
    }
}
let LssUserManager = class LssUserManager extends Polymer.Element {
    constructor() {
        super(...arguments);
        this.localStorageKey = 'LgUser';
        this.redirectUrl = 'https://signin.leavitt.com/';
        this.redirectDevUrl = 'https://devsignin.leavitt.com/';
        this.userManagerIssuers = [new UserManagerIssuer('https://oauth2.leavitt.com/', 'https://oauth2.leavitt.com/token'),
            new UserManagerIssuer('https://loginapi.unitedvalley.com/', 'https://loginapi.unitedvalley.com/Token')];
        this.shouldValidateOnLoad = true;
        this.personId = 0;
        this.lastIssuer = null;
        this.getUserAsyncPromise = null;
    }
    connectedCallback() {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            _super("connectedCallback").call(this);
            if (this.shouldValidateOnLoad) {
                yield this.authenticateAndGetUserAsync();
            }
        });
    }
    redirectToLogin(continueUrl) {
        let redirectUrl = `${this.isDevelopment() ? this.redirectDevUrl : this.redirectUrl}?continue=${encodeURIComponent(continueUrl)}`;
        document.location.href = redirectUrl;
    }
    redirectToSignOut(continueUrl) {
        let redirectUrl = `${this.isDevelopment() ? this.redirectDevUrl : this.redirectUrl}sign-out/?continue=${encodeURIComponent(continueUrl)}`;
        document.location.href = redirectUrl;
    }
    isDevelopment() {
        if (document == null || document.location == null || document.location.host == null)
            return true;
        const host = document.location.host;
        if (host.indexOf('dev') !== -1)
            return true;
        if (host.indexOf('localhost') !== -1)
            return true;
        return false;
    }
    getHashParametersFromUrl() {
        const hashParams = new Array();
        if (window.location.hash) {
            let hash = window.location.hash.substring(1);
            hash = decodeURIComponent(hash);
            const hashArray = hash.split('&');
            for (let i in hashArray) {
                if (hashArray.hasOwnProperty(i)) {
                    const keyValPair = hashArray[i].split('=');
                    if (keyValPair.length > 1) {
                        hashParams.push(new HashParameter(keyValPair[0], decodeURIComponent(keyValPair[1])));
                    }
                }
            }
        }
        return hashParams;
    }
    clearHashFromUrl() {
        if (document.location.hash && document.location.hash.indexOf('refreshToken') > -1)
            document.location.hash = '';
    }
    getTokenfromUrl(tokenName) {
        const hashParameters = this.getHashParametersFromUrl();
        const accessTokenArray = hashParameters.filter(value => value.key === tokenName);
        if (accessTokenArray.length === 0) {
            return null;
        }
        else {
            return accessTokenArray[0].value;
        }
    }
    decodeAccessToken(accessToken) {
        return jwt_decode(accessToken);
    }
    createUserFromToken(refreshToken, accessToken) {
        let decodedToken;
        try {
            decodedToken = this.decodeAccessToken(accessToken);
        }
        catch (error) {
            // Invalid JWT token format
            return null;
        }
        this.lastIssuer = decodedToken.iss;
        const expirationDate = new Date(0);
        expirationDate.setUTCSeconds(decodedToken.exp);
        let currentDate = new Date();
        currentDate.setSeconds(currentDate.getSeconds() + 30);
        if (!(expirationDate > currentDate && this.userManagerIssuers.some((o) => o.issuer === decodedToken.iss))) {
            //Access token expired or not from a valid issuer
            return null;
        }
        this.set('roles', decodedToken.role);
        this.set('fullname', decodedToken.unique_name);
        this.set('firstName', decodedToken.given_name);
        this.set('personId', parseInt(decodedToken.nameid) || 0);
        //this.set("roles", ["Hire Employee", "Terminate Employee", "Transfer Employee"]);
        return new User(decodedToken.given_name, decodedToken.family_name, expirationDate, this.personId, decodedToken.role, refreshToken, accessToken, decodedToken.unique_name, decodedToken.unique_name, decodedToken.RefreshTokenId);
    }
    getAccessTokenFromApiAsync(refreshToken, uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = {
                grant_type: 'refresh_token',
                refresh_token: refreshToken
            };
            let response = yield fetch(uri, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            let json;
            try {
                json = yield response.json();
            }
            catch (error) {
                return Promise.reject('The server sent back invalid JSON.');
            }
            if (response.status === 200 && json.access_token) {
                return Promise.resolve(json.access_token);
            }
            if (json.error) {
                if (json.error === 'unauthorized_client') {
                    return Promise.reject('Not authenticated');
                }
                return Promise.reject(json.error);
            }
            return Promise.reject('Not authenticated');
        });
    }
    getUserAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            let accessToken = this.getTokenfromUrl('accessToken');
            let refreshToken = this.getTokenfromUrl('refreshToken');
            if (!accessToken && !refreshToken) {
                //Fallback get tokens from localstorage if the tokens are not in the URL
                const localStorageUser = User.fromLocalStorage(this.localStorageKey);
                if (localStorageUser != null) {
                    this.set('roles', localStorageUser.roles);
                    this.set('fullname', localStorageUser.fullName);
                    this.set('firstName', localStorageUser.firstName);
                    this.set('personId', localStorageUser.personId);
                    accessToken = localStorageUser.accessToken;
                    refreshToken = localStorageUser.refreshToken;
                }
            }
            ////valid local tokens
            if (accessToken != null) {
                let user = this.createUserFromToken(refreshToken || '', accessToken);
                if (user != null) {
                    user.saveToLocalStorage(this.localStorageKey);
                    this.clearHashFromUrl();
                    return Promise.resolve(user);
                }
            }
            if (refreshToken != null) {
                try {
                    let hasToken = false;
                    let issuers = this.userManagerIssuers;
                    if (this.lastIssuer != null) {
                        issuers = issuers.filter(o => o.issuer === this.lastIssuer);
                    }
                    for (let issuer of issuers) {
                        if (hasToken)
                            break;
                        try {
                            accessToken = yield this.getAccessTokenFromApiAsync(refreshToken, issuer.tokenUri);
                            hasToken = true;
                        }
                        catch (error) {
                        }
                    }
                    let user = this.createUserFromToken(refreshToken || '', accessToken);
                    if (user != null) {
                        user.saveToLocalStorage(this.localStorageKey);
                        this.clearHashFromUrl();
                        return Promise.resolve(user);
                    }
                    return Promise.reject('Not authenticated');
                }
                catch (error) {
                    return Promise.reject(error);
                }
            }
            return Promise.reject('Not authenticated');
        });
    }
    logoutAsync() {
        localStorage.removeItem(this.localStorageKey);
        this.redirectToSignOut(document.location.href);
        return Promise.resolve();
    }
    authenticateAndGetUserAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.getUserAsync().then((user) => {
                    resolve(user);
                }).catch((error) => {
                    if (error === 'Not authenticated') {
                        this.redirectToLogin(document.location.href);
                        return; //Wait for the redirect to happen with a unreturned promise
                    }
                    reject(error);
                });
            });
        });
    }
    authenticateAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.getUserAsync().then((user) => {
                    resolve('Authenticated');
                }).catch((error) => {
                    this.redirectToLogin(document.location.href);
                    return; //Wait for the redirect to happen with a unreturned promise
                });
            });
        });
    }
};
__decorate([
    property(),
    __metadata("design:type", String)
], LssUserManager.prototype, "localStorageKey", void 0);
__decorate([
    property({ notify: true }),
    __metadata("design:type", String)
], LssUserManager.prototype, "redirectUrl", void 0);
__decorate([
    property({ notify: true }),
    __metadata("design:type", String)
], LssUserManager.prototype, "redirectDevUrl", void 0);
__decorate([
    property({ notify: true }),
    __metadata("design:type", Array)
], LssUserManager.prototype, "roles", void 0);
__decorate([
    property({ notify: true }),
    __metadata("design:type", String)
], LssUserManager.prototype, "fullname", void 0);
__decorate([
    property({ notify: true }),
    __metadata("design:type", String)
], LssUserManager.prototype, "firstName", void 0);
__decorate([
    property(),
    __metadata("design:type", Array)
], LssUserManager.prototype, "userManagerIssuers", void 0);
__decorate([
    property({ notify: true, reflectToAttribute: true }),
    __metadata("design:type", Boolean)
], LssUserManager.prototype, "shouldValidateOnLoad", void 0);
__decorate([
    property({ notify: true }),
    __metadata("design:type", Number)
], LssUserManager.prototype, "personId", void 0);
LssUserManager = __decorate([
    customElement('lss-user-manager')
], LssUserManager);
