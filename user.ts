class User {

    constructor(
        public firstName: string, 
        public lastName:     string, 
        public expirationDate: Date, 
        public personId: Number, 
        public roles: Array<string>, 
        public refreshToken: string|null,
        public accessToken: string|null,
        public username: string, 
        public fullName: string, 
        public refreshTokenId: string) { 


        }

    clearToken() {
        this.expirationDate = new Date(Date.now());
        this.refreshToken = null;
        this.accessToken = null;
    };

    saveToLocalStorage(localStorageKey: string) {
        const data = JSON.stringify(this);
        localStorage.setItem(localStorageKey, data);
    };
                
    static fromLocalStorage(localStorageKey: string): User | null {
        const data = JSON.parse(localStorage.getItem(localStorageKey) || "{}");
        if (data == null || data.refreshToken == null) {
            return null;
        }

        return new User(data.firstName, data.lastName, data.expirationDate, data.personId, data.roles, data.refreshToken, data.accessToken, data.username, data.fullName, data.refreshTokenId);
    };
}