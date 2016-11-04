declare class User {
    firstName: string;
    lastName: string;
    expirationDate: Date;
    personId: Number;
    roles: Array<string>;
    refreshToken: string;
    accessToken: string;
    username: string;
    fullName: string;
    refreshTokenId: string;
    constructor(firstName?: string, lastName?: string, expirationDate?: Date, personId?: Number, roles?: Array<string>, refreshToken?: string, accessToken?: string, username?: string, fullName?: string, refreshTokenId?: string);
    clearToken(): void;
    saveToLocalStorage(localStorageKey: string): void;
    static fromLocalStorage(localStorageKey: string): User;
}
