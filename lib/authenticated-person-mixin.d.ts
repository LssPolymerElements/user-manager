import { ElementMixin } from '@polymer/polymer/lib/mixins/element-mixin';
declare type Constructable = new (...args: any[]) => ElementMixin;
export interface AuthenticatedPersonBehaviorConstructor {
    new (...args: any[]): AuthenticatedPersonBehavior;
}
export interface AuthenticatedPersonBehavior {
    _getPersonAsync(): Promise<any>;
}
export declare const authenticatedPersonMixin: <T extends Constructable>(superClass: T) => T & AuthenticatedPersonBehaviorConstructor;
export {};
