export interface AuthenticatedTokenBehaviorConstructor {
    new (...args: any[]): AuthenticatedTokenBehavior;
}
export interface AuthenticatedTokenBehavior {
    _getAccessTokenAsync(): Promise<string>;
}
declare type Constructable = new (...args: any[]) => object;
export declare const authenticatedTokenMixin: <T extends Constructable>(superClass: T) => T & AuthenticatedTokenBehaviorConstructor;
export {};
