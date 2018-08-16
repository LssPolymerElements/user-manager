import {ElementMixin} from '@polymer/polymer/lib/mixins/element-mixin';

type Constructable = new (...args: any[]) => ElementMixin;

export interface AuthenticatedTokenMixinConstructor { new(...args: any[]): AuthenticatedTokenMixin; }
export interface AuthenticatedTokenMixin { _getAccessTokenAsync(): Promise<string>; }
export const authenticatedTokenMixin = <T extends Constructable>(superClass: T): T&AuthenticatedTokenMixinConstructor => class extends superClass {
  _getAccessTokenAsync() {
    return new Promise<string>((resolve, reject) => {
      let handleUpdate = function listener(e) {
        window.removeEventListener('um-token', handleUpdate);
        if (e.detail.rejected) {
          reject(e.detail.message);
        }
        resolve(e.detail.accessToken);
      };
      window.addEventListener('um-token', handleUpdate);
      window.dispatchEvent(new CustomEvent('um-request-token'));
    });
  }
};