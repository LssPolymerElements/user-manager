declare type Constructable = new (...args: any[]) => any;
export interface AuthenticatedPersonBehaviorConstructor {
    new (...args: any[]): AuthenticatedPersonBehavior;
}
export interface AuthenticatedPersonBehavior {
    _getPersonAsync(): Promise<any>;
}
export declare const authenticatedPersonMixin: <T extends Constructable>(superClass: T) => T & AuthenticatedPersonBehaviorConstructor;
export {};
