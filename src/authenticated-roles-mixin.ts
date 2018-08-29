

import {ElementMixin} from '@polymer/polymer/lib/mixins/element-mixin';

type Constructable = new (...args: any[]) => ElementMixin;

export interface AuthenticatedRolesMixinConstructor {
  new(...args: any[]): AuthenticatedRolesMixin;
}
export interface AuthenticatedRolesMixin {
  _getRolesAsync(): Promise<Array<string>>;
  roles: Array<string>;
}
export const authenticatedRolesMixin = <T extends Constructable>(superClass: T): T&AuthenticatedRolesMixinConstructor => class extends superClass {
  roles: Array<string>;

  async ready() {
    super.ready();
    window.addEventListener('um-role-added', (e: any) => {
      this.push('roles', e.detail.role);
    });

    window.addEventListener('um-role-removed', (e: any) => {
      const index = this.roles.indexOf(e.detail.role);
      if (index !== -1) {
        this.splice('roles', index, 1);
      }
    });

    try {
      this.roles = await this._getRolesAsync();
    } catch (e) {
    }
  }

  _getRolesAsync(): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
      const handleUpdate = function listener(e) {
        window.removeEventListener('um-roles', handleUpdate);
        if (e.detail.rejected) {
          reject(e.detail.message);
        }
        resolve(e.detail.roles);
      };
      window.addEventListener('um-roles', handleUpdate);
      window.dispatchEvent(new CustomEvent('um-request-roles'));
    });
  }

  static get properties() {
    return {roles: {type: Array, notify: true, value: []}};
  }
};
