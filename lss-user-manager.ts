/// <reference path="./user.ts" />
declare var fetch: any;
declare var jwt_decode: any;

@component("lss-user-manager")
class LssUserManager extends polymer.Base {
    private localStorageKey = "LgUser";

    @property({
        type: String,
        notify: true,
        value: "https://login.leavitt.com/oauth/"
    })
    redirectUrl: string;

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
        type: Array,
        value: [new userManagerIssuer("https://oauth2.leavitt.com/", "https://oauth2.leavitt.com/token"),
        new userManagerIssuer("https://loginapi.unitedvalley.com/", "https://loginapi.unitedvalley.com/Token")]
    })
    userManagerIssuers: Array<userManagerIssuer>;

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
        //console.log("REDIRECT!");
        var redirectUrl = `${this.redirectUrl}?continue=${encodeURIComponent(continueUrl)}`;
        document.location.href = redirectUrl;
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

    lastIssuer = null;
    private createUserFromToken(refreshToken: string, accessToken: string): User | null {
        var decodedToken;

        try {
            decodedToken = this.decodeAccessToken(accessToken);
        } catch (error) {
            // Invalid JWT token format
            return null;
        }

        this.lastIssuer = decodedToken.iss;
        const expirationDate = new Date(0);
        expirationDate.setUTCSeconds(decodedToken.exp);
        let currentDate = new Date();
        currentDate.setSeconds(currentDate.getSeconds() + 30);

        if (!(expirationDate > currentDate && this.userManagerIssuers.some((o) => o.Issurer === decodedToken.iss))) {
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

    private async getAccessTokenFromApiAsync(refreshToken: string, uri: string): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            const body = {
                grant_type: "refresh_token",
                refresh_token: refreshToken
            };

            var response = await fetch(uri, {
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
                reject("The server sent back invalid JSON.");
                return;
            }

            if (response.status === 200 && json.access_token) {
                resolve(json.access_token);
                return;
            }

            if (json.error) {
                if (json.error === "unauthorized_client") {
                    reject("Not authenticated");
                    return;
                }

                reject(json.error);
                return;
            }
            reject("Not authenticated");
        });
    }

    private async getUserAsync(): Promise<User> {
        return new Promise<User>(async (resolve, reject) => {


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
                    resolve(user);
                    return;
                }
            }
            if (refreshToken != null) {

                try {
                    var hasToken = false;
                    var issuers = this.userManagerIssuers;
                    if (this.lastIssuer != null) {
                        issuers = issuers.filter(o => o.Issurer === this.lastIssuer)
                    }
                    for (let issuer of issuers) {
                        if (hasToken)
                            return;

                        try {
                            accessToken = await this.getAccessTokenFromApiAsync(refreshToken, issuer.TokenUri);
                            hasToken = true;
                        } catch (error) {
                        }
                    }


                    var user = this.createUserFromToken(refreshToken || "", accessToken);
                    if (user != null) {
                        user.saveToLocalStorage(this.localStorageKey);
                        resolve(user);
                        return;
                    }
                    reject("Not authenticated");
                    return;

                } catch (error) {
                    reject(error);
                    return;
                }
            }
            reject("Not authenticated");
        });
    };

    logoutAsync(): Promise<null> {
        localStorage.removeItem(this.localStorageKey);

        //TODO:  POST TO API TO EXPIRE REFRESH TOKEN
        return Promise.resolve(null);
    };

    getUserAsyncPromise: Promise<User> = null;

    async authenticateAndGetUserAsync(): Promise<User | null> {
        if (this.getUserAsyncPromise != null) {
            return this.getUserAsyncPromise;
        }

        try {
            var getUserAsyncPromise = this.getUserAsync();
            this.getUserAsyncPromise = getUserAsyncPromise;
            var user = await this.getUserAsyncPromise;
            this.getUserAsyncPromise = null;
            return getUserAsyncPromise;
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