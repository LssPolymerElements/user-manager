import { ElementMixin } from '@polymer/polymer/lib/mixins/element-mixin';
declare type Constructable = new (...args: any[]) => ElementMixin;
export interface AuthenticatedTokenMixinConstructor {
    new (...args: any[]): AuthenticatedTokenMixin;
}
export interface AuthenticatedTokenMixin {
    _getAccessTokenAsync(): Promise<string>;
}
export declare const authenticatedTokenMixin: <T extends Constructable>(superClass: T) => T & AuthenticatedTokenMixinConstructor;
export {};
