/// <reference path="./user.ts" />
declare var fetch: any;

interface IUserManager {

    constructor(loginUrl?: string, localStorageKey?: string, publicApiKey?: string);

    user(): User;

    logoutAsync(): Promise<void>;

    authenticateAndGetUserAsync(): Promise<User>;

    authenticateAsync(): Promise<void>;
}