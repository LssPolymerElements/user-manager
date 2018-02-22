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
    personId: number;
    roles: Array<string>;
    refreshToken: string | null;
    accessToken: string | null;
    username: string;
    fullName: string;
    refreshTokenId: string;
    constructor(firstName: string, lastName: string, expirationDate: Date, personId: number, roles: Array<string>, refreshToken: string | null, accessToken: string | null, username: string, fullName: string, refreshTokenId: string);
    clearToken(): void;
    saveToLocalStorage(localStorageKey: string): void;
    static fromLocalStorage(localStorageKey: string): User | null;
}
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
    user: User;
    connectedCallback(): Promise<void>;
    private _redirectToLogin(continueUrl);
    private _redirectToSignOut(continueUrl);
    isDevelopment(): boolean;
    private _getHashParametersFromUrl();
    private _clearHashFromUrl();
    private _getTokenfromUrl(tokenName);
    private _decodeAccessToken(accessToken);
    private lastIssuer;
    private _disableInternalListener;
    private _disablePropertyObservers;
    private _createUserFromToken(refreshToken, accessToken);
    private _getAccessTokenFromApiAsync(refreshToken, uri);
    protected _rolesChanged(personId: number): void;
    private _updateElementPropertiesFromUser(user);
    private _getUserAsync();
    logoutAsync(): Promise<void>;
    private _handleUserChanged(e);
    authenticateAsync(): Promise<User>;
    notifyUserChanged(user: User): void;
    authenticateAndGetUserAsync(): Promise<User>;
}
