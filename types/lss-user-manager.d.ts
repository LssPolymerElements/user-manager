declare var jwt_decode: any;
declare class HashParameter {
    key: string;
    value: string;
    constructor(key: string, value: string);
}
declare class UserManagerIssuer {
    issuer: string;
    tokenUri: string;
    constructor(issuer: string, tokenUri: string);
}
declare class User {
    firstName: string;
    lastName: string;
    expirationDate: Date;
    personId: Number;
    roles: Array<string>;
    refreshToken: string | null;
    accessToken: string | null;
    username: string;
    fullName: string;
    refreshTokenId: string;
    constructor(firstName: string, lastName: string, expirationDate: Date, personId: Number, roles: Array<string>, refreshToken: string | null, accessToken: string | null, username: string, fullName: string, refreshTokenId: string);
    clearToken(): void;
    saveToLocalStorage(localStorageKey: string): void;
    static fromLocalStorage(localStorageKey: string): User | null;
}
declare const customElement: typeof Polymer.decorators.customElement, property: typeof Polymer.decorators.property, query: (selector: string) => (proto: any, propName: string) => any, queryAll: (selector: string) => (proto: any, propName: string) => any, observe: typeof Polymer.decorators.observe, computed: typeof Polymer.decorators.computed, listen: (eventName: string, target: string | EventTarget) => (proto: any, methodName: string) => void;
declare class LssUserManager extends Polymer.Element {
    localStorageKey: string;
    redirectUrl: string;
    redirectDevUrl: string;
    roles: Array<string>;
    fullname: string;
    firstName: string;
    userManagerIssuers: Array<UserManagerIssuer>;
    disableAutoload: boolean;
    personId: number;
    connectedCallback(): Promise<void>;
    private redirectToLogin(continueUrl);
    private redirectToSignOut(continueUrl);
    isDevelopment(): Boolean;
    private getHashParametersFromUrl();
    private clearHashFromUrl();
    private getTokenfromUrl(tokenName);
    private decodeAccessToken(accessToken);
    lastIssuer: null;
    private createUserFromToken(refreshToken, accessToken);
    private getAccessTokenFromApiAsync(refreshToken, uri);
    private getUserAsync();
    logoutAsync(): Promise<void>;
    getUserAsyncPromise: Promise<User> | null;
    authenticateAndGetUserAsync(): Promise<User>;
    authenticateAsync(): Promise<string>;
}
