interface UserManager {
    logout(): void;
    authenticateAsync(): Promise<LssJwtToken>;
    isDevelopment(): boolean;
}
