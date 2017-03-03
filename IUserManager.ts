/// <reference path="./user.ts" />

interface IUserManager {

    constructor(loginUrl?: string, localStorageKey?: string, publicApiKey?: string);

    user(): User;

    logoutAsync(): Promise<void>;

    authenticateAndGetUserAsync(): Promise<User>;

    authenticateAsync(): Promise<void>;
}