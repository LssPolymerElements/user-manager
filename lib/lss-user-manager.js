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
        this.userManagerIssuers = [new UserManagerIssuer('https://oauth2.leavitt.com/', 'https://oauth2.leavitt.com/token'), new UserManagerIssuer('https://loginapi.unitedvalley.com/', 'https://loginapi.unitedvalley.com/Token')];
        this.disableAutoload = false;
        this.personId = 0;
        this.user = {};
        this.lastIssuer = null;
        this._disableOuterListener = false;
        this._disablePropertyObservers = false;
    }
    connectedCallback() {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            _super("connectedCallback").call(this);
            window.addEventListener('lss-user-manager-user-changed', this._handleUserChanged.bind(this));
            if (!this.disableAutoload) {
                yield this.authenticateAsync();
            }
        });
    }
    _redirectToLogin(continueUrl) {
        let redirectUrl = `${this.isDevelopment() ? this.redirectDevUrl : this.redirectUrl}?continue=${encodeURIComponent(continueUrl)}`;
        document.location.href = redirectUrl;
    }
    _redirectToSignOut(continueUrl) {
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
    _getHashParametersFromUrl() {
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
    _clearHashFromUrl() {
        if (document.location.hash && document.location.hash.indexOf('refreshToken') > -1)
            document.location.hash = '';
    }
    _getTokenfromUrl(tokenName) {
        const hashParameters = this._getHashParametersFromUrl();
        const accessTokenArray = hashParameters.filter(value => value.key === tokenName);
        if (accessTokenArray.length === 0) {
            return null;
        }
        else {
            return accessTokenArray[0].value;
        }
    }
    _decodeAccessToken(accessToken) {
        return jwt_decode(accessToken);
    }
    _createUserFromToken(refreshToken, accessToken) {
        let decodedToken;
        try {
            decodedToken = this._decodeAccessToken(accessToken);
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
            // Access token expired or not from a valid issuer
            return null;
        }
        return new User(decodedToken.given_name, decodedToken.family_name, expirationDate, Number(decodedToken.nameid) || 0, decodedToken.role, refreshToken, accessToken, decodedToken.unique_name, decodedToken.unique_name, decodedToken.RefreshTokenId);
    }
    _getAccessTokenFromApiAsync(refreshToken, uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = { grant_type: 'refresh_token', refresh_token: refreshToken };
            let response = yield fetch(uri, { method: 'POST', body: JSON.stringify(body), headers: [['Content-Type', 'application/json'], ['Accept', 'application/json']] });
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
    _rolesChanged(personId) {
        if (!this.roles || !this.personId || this._disablePropertyObservers)
            return;
        console.log('properties changed!', this.getAttribute('id'));
        this.user.roles = this.roles;
        this.user.personId = personId;
        this.notifyUserChanged(this.user);
    }
    _updateElementPropertiesFromUser(user) {
        this._disablePropertyObservers = true; // We dont want to internally observe this change.
        this.user = JSON.parse(JSON.stringify(user));
        this.roles = this.user.roles;
        this.fullname = this.user.fullName;
        this.firstName = this.user.firstName;
        this.personId = this.user.personId;
        this._disablePropertyObservers = false;
    }
    _getUserAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            let accessToken = this._getTokenfromUrl('accessToken');
            let refreshToken = this._getTokenfromUrl('refreshToken');
            if (!accessToken && !refreshToken) {
                // Fallback get tokens from localstorage if the tokens are not in the URL
                const localStorageUser = User.fromLocalStorage(this.localStorageKey);
                if (localStorageUser != null) {
                    accessToken = localStorageUser.accessToken;
                    refreshToken = localStorageUser.refreshToken;
                }
            }
            ////validate local tokens
            if (accessToken != null) {
                let user = this._createUserFromToken(refreshToken || '', accessToken);
                if (user != null) {
                    user.saveToLocalStorage(this.localStorageKey);
                    this._clearHashFromUrl();
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
                            accessToken = yield this._getAccessTokenFromApiAsync(refreshToken, issuer.tokenUri);
                            hasToken = true;
                        }
                        catch (error) {
                        }
                    }
                    let user = this._createUserFromToken(refreshToken || '', accessToken);
                    if (user != null) {
                        user.saveToLocalStorage(this.localStorageKey);
                        this._clearHashFromUrl();
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
        this._redirectToSignOut(document.location.href);
        return Promise.resolve();
    }
    _handleUserChanged(e) {
        if (this._disableOuterListener)
            return;
        console.log('receiving change event! ', this.getAttribute('id'));
        this._updateElementPropertiesFromUser(e.detail.user);
    }
    authenticateAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const _window = window;
                if (_window.__lss_user_manager_resolving) {
                    console.log('waiting for event', this.getAttribute('id'));
                    const self = this;
                    this._disableOuterListener = true; // This listener is active so disable the outer to prevent notifications
                    _window.addEventListener('lss-user-manager-user-changed', function listener(e) {
                        _window.removeEventListener('lss-user-manager-user-changed', listener);
                        self._disableOuterListener = false;
                        console.log('resolving promise from event!', self.getAttribute('id'));
                        const user = e.detail.user;
                        self.user = user;
                        self._updateElementPropertiesFromUser(user);
                        resolve(user);
                    });
                }
                else {
                    console.log('_getUserAsync ', this.getAttribute('id'));
                    _window.__lss_user_manager_resolving = true;
                    this._getUserAsync()
                        .then((user) => {
                        console.log('got user, notifing others...', this.getAttribute('id'));
                        _window.__lss_user_manager_resolving = false;
                        this.notifyUserChanged(user);
                        this._updateElementPropertiesFromUser(user);
                        resolve(user);
                    })
                        .catch((error) => {
                        if (error === 'Not authenticated') {
                            this._redirectToLogin(document.location.href);
                            return; // Wait for the redirect to happen with a unreturned promise
                        }
                        reject(error);
                    });
                }
            });
        });
    }
    notifyUserChanged(user) {
        this._disableOuterListener = true;
        console.log('sending change event! ', this.getAttribute('id'));
        window.dispatchEvent(new CustomEvent('lss-user-manager-user-changed', { detail: { user: user } }));
        this._disableOuterListener = false;
    }
    authenticateAndGetUserAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authenticateAsync();
        });
    }
};
__decorate([
    Polymer.decorators.property({ type: String })
], LssUserManager.prototype, "localStorageKey", void 0);
__decorate([
    Polymer.decorators.property({ notify: true, type: String })
], LssUserManager.prototype, "redirectUrl", void 0);
__decorate([
    Polymer.decorators.property({ notify: true, type: String })
], LssUserManager.prototype, "redirectDevUrl", void 0);
__decorate([
    Polymer.decorators.property({ notify: true, type: Array })
], LssUserManager.prototype, "roles", void 0);
__decorate([
    Polymer.decorators.property({ notify: true, type: String })
], LssUserManager.prototype, "fullname", void 0);
__decorate([
    Polymer.decorators.property({ notify: true, type: String })
], LssUserManager.prototype, "firstName", void 0);
__decorate([
    Polymer.decorators.property({ type: Array })
], LssUserManager.prototype, "userManagerIssuers", void 0);
__decorate([
    Polymer.decorators.property({ type: Boolean, notify: true })
], LssUserManager.prototype, "disableAutoload", void 0);
__decorate([
    Polymer.decorators.property({ type: Number, notify: true })
], LssUserManager.prototype, "personId", void 0);
__decorate([
    Polymer.decorators.property({ type: Object })
], LssUserManager.prototype, "user", void 0);
__decorate([
    Polymer
        .decorators.observe('personId', 'roles.length')
], LssUserManager.prototype, "_rolesChanged", null);
LssUserManager = __decorate([
    Polymer.decorators.customElement('lss-user-manager')
], LssUserManager);
//# sourceMappingURL=lss-user-manager.js.map