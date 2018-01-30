interface UserManager {

    constructor(loginUrl?: string, localStorageKey?: string, publicApiKey?: string): void;

    user(): User;

    logoutAsync(): Promise<void>;

    authenticateAndGetUserAsync(): Promise<User>;

    authenticateAsync(): Promise<void>;
}