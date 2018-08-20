import { ElementMixin } from '@polymer/polymer/lib/mixins/element-mixin';
declare type Constructable = new (...args: any[]) => ElementMixin;
export interface AuthenticatedPersonMixinConstructor {
    new (...args: any[]): AuthenticatedPersonMixin;
}
export interface AuthenticatedPersonMixin {
    _getPersonAsync(): Promise<any>;
    personId: number;
    fullname: string;
    firstName: string;
    lastName: string;
}
export declare const authenticatedPersonMixin: <T extends Constructable>(superClass: T) => T & AuthenticatedPersonMixinConstructor;
export {};
