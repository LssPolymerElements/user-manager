/// <reference path="node_modules/@types/es6-promise/index.d.ts" />
/// <reference types="es6-promise" />
declare var fetch: any;
declare var jwt_decode: any;
declare class UserManager extends polymer.Base {
    private loginUrl;
    private localStorageKey;
    private accessToken;
    private refreshToken;
    private _user;
    readonly user: User;
    roles: Array<string>;
    fullname: string;
    firstName: string;
    shouldValidateOnLoad: boolean;
    personId: Number;
    attached(): void;
    private redirectToLogin(continueUrl);
    private getHashParametersFromUrl();
    private clearHashFromUrl();
    private getLocalTokens();
    private decodeAccessToken(accessToken);
    private isTokenValid(accessToken);
    private createUserFromToken(refreshToken, accessToken);
    private getAccessTokenFromApiAsync(refreshToken);
    private fetchAccessTokenAsync();
    private updateQueryString(key, value, url);
    logoutAsync(): Promise<void>;
    authenticateAndGetUserAsync(): Promise<User>;
    authenticateAsync(): Promise<void>;
}
