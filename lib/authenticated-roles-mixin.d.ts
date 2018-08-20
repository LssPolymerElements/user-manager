import { ElementMixin } from '@polymer/polymer/lib/mixins/element-mixin';
declare type Constructable = new (...args: any[]) => ElementMixin;
export interface AuthenticatedRolesMixinConstructor {
    new (...args: any[]): AuthenticatedRolesMixin;
}
export interface AuthenticatedRolesMixin {
    _getRolesAsync(): Promise<Array<string>>;
    roles: Array<string>;
}
export declare const authenticatedRolesMixin: <T extends Constructable>(superClass: T) => T & AuthenticatedRolesMixinConstructor;
export {};
