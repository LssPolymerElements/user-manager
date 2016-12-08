/// <reference path="./user.ts" />
declare var fetch: any;
declare var jwt_decode: any;

@component("lss-user-manager")
class LssUserManager extends polymer.Base {
    private loginUrl = "https://login.leavitt.com/oauth/";
    private localStorageKey = "LgUser";

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

    async attached() {
        if (this.shouldValidateOnLoad) {
            await this.authenticateAndGetUserAsync();
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

    private getTokenfromUrl(tokenName: string): string | null {
        const hashParameters = this.getHashParametersFromUrl();
        const accessTokenArray = hashParameters.filter(value => value.key === tokenName);
        if (accessTokenArray.length === 0) {
            return null;
        } else {
            return accessTokenArray[0].value;
        }
    }

    private decodeAccessToken(accessToken: string): ITokenDto {
        return jwt_decode(accessToken) as ITokenDto;
    }

    private createUserFromToken(refreshToken: string, accessToken: string): User | null {
        var decodedToken;

        try {
            decodedToken = this.decodeAccessToken(accessToken);
        } catch (error) {
            // Invalid JWT token format
            return null;
        }

        const expirationDate = new Date(0);
        expirationDate.setUTCSeconds(decodedToken.exp);
        let currentDate = new Date();
        currentDate.setSeconds(currentDate.getSeconds() + 30);
        if (!(expirationDate > currentDate && decodedToken.iss === "https://oauth2.leavitt.com/")) {
            //Access token expired or not from a valid issuer
            return null;
        }

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

    private async getAccessTokenFromApiAsync(refreshToken: string): Promise<string> {
        const body = {
            grant_type: "refresh_token",
            refresh_token: refreshToken
        };

        var response = await fetch("https://oauth2.leavitt.com/token", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        var json;
        try {
            json = await response.json();
        } catch (error) {
            return Promise.reject("The server sent back invalid JSON.");
        }

        if (response.status === 200 && json.access_token) {
            return Promise.resolve(json.access_token);
        }

        if (json.error) {
            return Promise.reject(json.error);
        }
        return Promise.reject("Not authenticated");
    }

    private async getUserAsync(): Promise<User> {

        var accessToken = this.getTokenfromUrl("accessToken");
        var refreshToken = this.getTokenfromUrl("refreshToken");

        if (accessToken || refreshToken) {
            this.clearHashFromUrl();
        }
        else {
            //Fallback get tokens from localstorage if the tokens are not in the URL
            const localStorageUser = User.fromLocalStorage(this.localStorageKey);
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
            var user = this.createUserFromToken(refreshToken || "", accessToken);
            if (user != null) {
                user.saveToLocalStorage(this.localStorageKey);
                return Promise.resolve(user);
            }
        }

        if (refreshToken != null) {

            try {
                accessToken = await this.getAccessTokenFromApiAsync(refreshToken);
                var user = this.createUserFromToken(refreshToken || "", accessToken);
                if (user != null) {
                    user.saveToLocalStorage(this.localStorageKey);
                    return Promise.resolve(user);
                }
                return Promise.reject("Not authenticated");

            } catch (error) {
                return Promise.reject(error);
            }
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

    logoutAsync(): Promise<null> {
        localStorage.removeItem(this.localStorageKey);

        //TODO:  POST TO API TO EXPIRE REFRESH TOKEN
        return Promise.resolve(null);
    };

    async authenticateAndGetUserAsync(): Promise<User | null> {
        try {
            var user = await this.getUserAsync();
            return Promise.resolve(user);
        } catch (error) {
            if (error === "Not authenticated") {
                this.redirectToLogin(document.location.href);
                //Wait for the redirect to happen
                return new Promise<User>((resolve, reject) => {
                    setTimeout(() => {
                        resolve();
                    }, 10000000);
                });
            }
            return Promise.resolve(null);
        }
    };

    async authenticateAsync(): Promise<string | null> {
        try {
            await this.getUserAsync();
            return Promise.resolve(null);
        } catch (error) {
            this.redirectToLogin(document.location.href);
            //Wait for the redirect to happen
            return new Promise<string>((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, 10000000);
            });
        }
    };
}

LssUserManager.register();