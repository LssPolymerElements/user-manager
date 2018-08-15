import { LssJwtToken } from './LssJwtToken';
export interface UserManager {
    logout(): void;
    authenticateAsync(): Promise<LssJwtToken>;
    isDevelopment(): boolean;
}
