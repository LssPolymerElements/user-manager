/// <reference path="./user.ts" />
declare var fetch: any;
declare var jwt_decode: any;

@component("lss-user-manager")
class LssUserManager extends polymer.Base { 

    private loginUrl = "https://login.leavitt.com/oauth/";
    private localStorageKey = "LgUser";
    private accessToken: string;
    private refreshToken: string;
    private _user: User;
    get user(): User { return this._user; }

    @property({
        type: Array,
        notify: true
    })
    roles: Array<string>;

    @property({
        type: String,
        notify: true
    })
    fullname: string;

    @property({
        type: String,
        notify: true
    })
    firstName: string;

    @property({
        type: Boolean,
        notify: true,
        value: true,
        reflectToAttribute: true
    })
    shouldValidateOnLoad: boolean;

    @property({
        value: 0,
        type: Number,
        notify: true
    })
    personId: Number;

    attached() {
        if (this.shouldValidateOnLoad) {
            this.authenticateAndGetUserAsync().then();
        }
    }

    private redirectToLogin(continueUrl: string) {
        document.location.href = this.updateQueryString("continue", continueUrl, this.loginUrl);
    };

    private getHashParametersFromUrl(): Array<HashParameter> {
        const hashParams = new Array<HashParameter>();
        if (window.location.hash) {
            let hash = window.location.hash.substring(1);
            hash = decodeURIComponent(hash);
            const hashArray = hash.split("&");

            for (let i in hashArray) {
                if (hashArray.hasOwnProperty(i)) {
                    const keyValPair = hashArray[i].split("=");
                    if (keyValPair.length > 1) {
                        hashParams.push(new HashParameter(keyValPair[0], decodeURIComponent(keyValPair[1])));
                    }
                }
            }
        }
        return hashParams;
    };

    private clearHashFromUrl() {
        document.location.hash = "";
    };

    private getLocalTokens() {
        //First type and get tokens from URL
        const hashParameters = this.getHashParametersFromUrl();

        if (hashParameters.length > 0) {
            const accessTokenArray = hashParameters.filter(value => value.key === "accessToken");
            if (accessTokenArray.length === 0) {
                this.accessToken = "";
            } else {
                this.accessToken = accessTokenArray[0].value || "";
            }
            this.refreshToken = hashParameters.filter(value => value.key === "refreshToken")[0].value;
            this.clearHashFromUrl();

        } else {
            //Fallback get tokens from localstorage if user has been here before
            const localStorageUser = User.fromLocalStorage(this.localStorageKey);
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

    private decodeAccessToken(accessToken: string): ITokenDto {
        if (accessToken === null || typeof accessToken === "undefined")
            return null;

        return jwt_decode(accessToken) as ITokenDto;
    }

    private isTokenValid(accessToken: string): boolean {
        if (accessToken === null || accessToken === "" || typeof accessToken === "undefined")
            return false;

        const decodedToken = this.decodeAccessToken(accessToken);
        const expirationDate = new Date(0);
        expirationDate.setUTCSeconds(decodedToken.exp);
        let currentDate = new Date();
        currentDate.setSeconds(currentDate.getSeconds() + 30);
        return (expirationDate > currentDate && decodedToken.iss === "https://oauth2.leavitt.com/");
    };

    private createUserFromToken(refreshToken: string, accessToken: string): User {
        const decodedToken = this.decodeAccessToken(accessToken);

        const expirationDate = new Date(0);
        expirationDate.setUTCSeconds(decodedToken.exp);

       
        this.set("roles", decodedToken.role);
        this.set("fullname", decodedToken.unique_name);
        this.set("firstName", decodedToken.given_name);
        this.set("personId", parseInt(decodedToken.nameid) || 0);
        //this.set("roles", ["Hire Employee", "Terminate Employee", "Transfer Employee"]);

        return new User(decodedToken.given_name,
            decodedToken.family_name,
            expirationDate,
            this.personId,
            decodedToken.role,
            refreshToken,
            accessToken,
            decodedToken.unique_name,
            decodedToken.unique_name,
            decodedToken.RefreshTokenId);
    };

    private getAccessTokenFromApiAsync(refreshToken: string): Promise<string> {
        const body = {
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
        }).then(response => {
            if (response.status === 200)
                return response.json();

            return response.json()
                .catch(error => {
                    return Promise.reject("The server sent back invalid JSON.");
                }).then(json => {
                    if (json.error) {
                        return Promise.reject(json.error);
                    }
                    return Promise.reject("Not authenticated");
                });

        }).then(json => { return Promise.resolve(json.access_token) });

    }

    private fetchAccessTokenAsync(): Promise<string> {

        this.getLocalTokens();

        ////valid local tokens
        if (this.accessToken != null && this.isTokenValid(this.accessToken)) {

            this._user = this.createUserFromToken(this.refreshToken, this.accessToken);
            this.user.saveToLocalStorage(this.localStorageKey);
            return Promise.resolve(this.accessToken);
        }

        if (this.refreshToken != null) {

            return this.getAccessTokenFromApiAsync(this.refreshToken).then(token => {
                this.accessToken = token;
                if (this.isTokenValid(this.accessToken)) {
                    this._user = this.createUserFromToken(this.refreshToken, this.accessToken);
                    this.user.saveToLocalStorage(this.localStorageKey);
                    return Promise.resolve(this.accessToken);
                }

                return Promise.reject("Not authenticated");
            }).catch(o => {
                return Promise.reject("Not authenticated");
            });
        }

        return Promise.reject("Not authenticated");
    };

    private updateQueryString(key: string, value: string, url: string): string {
        if (!url) url = window.location.href;
        const re = new RegExp(`([?&])${key}=.*?(&|#|$)(.*)`, "gi");
        let hash: string[];
        if (re.test(url)) {
            if (typeof value !== "undefined" && value !== null)
                return url.replace(re, "$1" + key + "=" + value + "$2$3");
            else {
                hash = url.split("#");
                url = hash[0].replace(re, "$1$3").replace(/(&|\?)$/, "");
                if (typeof hash[1] !== "undefined" && hash[1] !== null)
                    url += `#${hash[1]}`;
                return url;
            }
        }
        else {
            if (typeof value !== "undefined" && value !== null) {
                const separator = url.indexOf("?") !== -1 ? "&" : "?";
                hash = url.split("#");
                url = hash[0] + separator + key + "=" + value;
                if (typeof hash[1] !== "undefined" && hash[1] !== null)
                    url += `#${hash[1]}`;
                return url;
            }
            else
                return url;
        }
    }

    logoutAsync(): Promise<void> {
        this.accessToken = null;
        this.refreshToken = null;
        localStorage.removeItem(this.localStorageKey);

        //TODO:  POST TO API TO EXPIRE REFRESH TOKEN
        return Promise.resolve(null);
    };

     authenticateAndGetUserAsync(): Promise<User> {
        return this.fetchAccessTokenAsync()
            .then(token => {
                return Promise.resolve(this._user);
            },error => {
                if (error === "Not authenticated") {
                    this.redirectToLogin(document.location.href);
                    return new Promise((resolve, reject) => {
                        setTimeout(() =>{
                            resolve();
                        }, 10000000); });
                }
            });
    };

    authenticateAsync(): Promise<void> {
        return this.fetchAccessTokenAsync()
            .then(token => { return Promise.resolve(null); }, error => {
                    this.redirectToLogin(document.location.href);
                    return new Promise((resolve, reject) => {
                        setTimeout(() =>{
                            resolve();
                        }, 10000000); });
            });
    };
}

LssUserManager.register();