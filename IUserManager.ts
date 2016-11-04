/// <reference path="../../node_modules/@types/es6-promise/index.d.ts" />
declare var fetch: any;

interface IUserManager {

    constructor(loginUrl?: string, localStorageKey?: string, publicApiKey?: string);

    user(): User;

    logoutAsync(): Promise<void>;

    authenticateAndGetUserAsync(): Promise<User>;

    authenticateAsync(): Promise<void>;
}