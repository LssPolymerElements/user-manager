declare var jwt_decode: any;

class HashParameter {
    constructor(public key: string, public value: string) { }
}

class UserManagerIssuer {
    constructor(public issuer: string, public tokenUri: string) { }
}

class User {

    constructor(
        public firstName: string,
        public lastName: string,
        public expirationDate: Date,
        public personId: Number,
        public roles: Array<string>,
        public refreshToken: string | null,
        public accessToken: string | null,
        public username: string,
        public fullName: string,
        public refreshTokenId: string) {
    }

    clearToken() {
        this.expirationDate = new Date(Date.now());
        this.refreshToken = null;
        this.accessToken = null;
    }

    saveToLocalStorage(localStorageKey: string) {
        const data = JSON.stringify(this);
        window.localStorage.setItem(localStorageKey, data);
    }

    static fromLocalStorage(localStorageKey: string): User | null {
        const data = JSON.parse(window.localStorage.getItem(localStorageKey) || '{}');
        if (data == null || data.refreshToken == null) {
            return null;
        }

        return new User(data.firstName, data.lastName, data.expirationDate, data.personId, data.roles, data.refreshToken, data.accessToken, data.username, data.fullName, data.refreshTokenId);
    }
}

@customElement('lss-user-manager')
class LssUserManager extends Polymer.Element {
    @property()
    localStorageKey: string = 'LgUser';

    @property({ notify: true })
    redirectUrl: string = 'https://signin.leavitt.com/';

    @property({ notify: true })
    redirectDevUrl: string = 'https://devsignin.leavitt.com/';

    @property({ notify: true })
    roles: Array<string>;

    @property({ notify: true })
    fullname: string;

    @property({ notify: true })
    firstName: string;

    @property()
    userManagerIssuers: Array<UserManagerIssuer> = [new UserManagerIssuer('https://oauth2.leavitt.com/', 'https://oauth2.leavitt.com/token'),
    new UserManagerIssuer('https://loginapi.unitedvalley.com/', 'https://loginapi.unitedvalley.com/Token')];

    @property({ notify: true, reflectToAttribute: true })
    disableAutoload: boolean = false;

    @property({ notify: true })
    personId: Number = 0;

    async connectedCallback() {
        super.connectedCallback();

        if (!this.disableAutoload) {
            await this.authenticateAndGetUserAsync();
        }
    }

    private redirectToLogin(continueUrl: string) {
        let redirectUrl = `${this.isDevelopment() ? this.redirectDevUrl : this.redirectUrl}?continue=${encodeURIComponent(continueUrl)}`;
        document.location.href = redirectUrl;
    }

    private redirectToSignOut(continueUrl: string) {
        let redirectUrl = `${this.isDevelopment() ? this.redirectDevUrl : this.redirectUrl}sign-out/?continue=${encodeURIComponent(continueUrl)}`;
        document.location.href = redirectUrl;
    }

    isDevelopment(): Boolean {
        if (document == null || document.location == null || document.location.host == null)
            return true;

        const host = document.location.host;
        if (host.indexOf('dev') !== -1)
            return true;

        if (host.indexOf('localhost') !== -1)
            return true;

        return false;
    }

    private getHashParametersFromUrl(): Array<HashParameter> {
        const hashParams = new Array<HashParameter>();
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

    private clearHashFromUrl() {
        if (document.location.hash && document.location.hash.indexOf('refreshToken') > -1)
            document.location.hash = '';
    }

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
        let decodedToken: any;

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

        if (!(expirationDate > currentDate && this.userManagerIssuers.some((o) => o.issuer === decodedToken.iss))) {
            //Access token expired or not from a valid issuer
            return null;
        }

        this.set('roles', decodedToken.role);
        this.set('fullname', decodedToken.unique_name);
        this.set('firstName', decodedToken.given_name);
        this.set('personId', parseInt(decodedToken.nameid) || 0);
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
    }

    private async getAccessTokenFromApiAsync(refreshToken: string, uri: string): Promise<string> {
        const body = {
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        };

        let response = await fetch(uri, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        let json;
        try {
            json = await response.json();
        } catch (error) {
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
    }

    private async getUserAsync(): Promise<User> {

        let accessToken: any = this.getTokenfromUrl('accessToken');
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
                        accessToken = await this.getAccessTokenFromApiAsync(refreshToken, issuer.tokenUri);
                        hasToken = true;
                    } catch (error) {
                    }
                }

                let user = this.createUserFromToken(refreshToken || '', accessToken);
                if (user != null) {
                    user.saveToLocalStorage(this.localStorageKey);
                    this.clearHashFromUrl();
                    return Promise.resolve(user);

                }
                return Promise.reject('Not authenticated');

            } catch (error) {
                return Promise.reject(error);
            }
        }
        return Promise.reject('Not authenticated');
    }

    logoutAsync(): Promise<void> {
        localStorage.removeItem(this.localStorageKey);
        this.redirectToSignOut(document.location.href);
        return Promise.resolve();
    }

    getUserAsyncPromise: Promise<User> | null = null;

    async authenticateAndGetUserAsync(): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.getUserAsync().then((user) => {
                resolve(user);
            }).catch((error) => {
                if (error === 'Not authenticated') {
                    this.redirectToLogin(document.location.href);
                    return;  //Wait for the redirect to happen with a unreturned promise
                }
                reject(error);
            });
        });
    }

    async authenticateAsync(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.getUserAsync().then((user) => {
                resolve('Authenticated');
            }).catch((error) => {
                this.redirectToLogin(document.location.href);
                return;  //Wait for the redirect to happen with a unreturned promise
            });
        });
    }
}