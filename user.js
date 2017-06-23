class User {
    constructor(firstName, lastName, expirationDate, personId, roles, refreshToken, accessToken, username, fullName, refreshTokenId) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.expirationDate = expirationDate;
        this.personId = personId;
        this.roles = roles;
        this.refreshToken = refreshToken;
        this.accessToken = accessToken;
        this.username = username;
        this.fullName = fullName;
        this.refreshTokenId = refreshTokenId;
    }
    clearToken() {
        this.expirationDate = new Date(Date.now());
        this.refreshToken = null;
        this.accessToken = null;
    }
    ;
    saveToLocalStorage(localStorageKey) {
        const data = JSON.stringify(this);
        window.localStorage.setItem(localStorageKey, data);
    }
    ;
    static fromLocalStorage(localStorageKey) {
        const data = JSON.parse(window.localStorage.getItem(localStorageKey) || "{}");
        if (data == null || data.refreshToken == null) {
            return null;
        }
        return new User(data.firstName, data.lastName, data.expirationDate, data.personId, data.roles, data.refreshToken, data.accessToken, data.username, data.fullName, data.refreshTokenId);
    }
    ;
}
