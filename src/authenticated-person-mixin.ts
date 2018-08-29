

import {ElementMixin} from '@polymer/polymer/lib/mixins/element-mixin';

type Constructable = new (...args: any[]) => ElementMixin;

export interface AuthenticatedPersonMixinConstructor {
  new(...args: any[]): AuthenticatedPersonMixin;
}
export interface AuthenticatedPersonMixin {
  _getPersonAsync(): Promise<any>;
  personId: number;
  fullname: string;
  firstName: string;
  lastName: string;
}
export const authenticatedPersonMixin = <T extends Constructable>(superClass: T): T&AuthenticatedPersonMixinConstructor => class extends superClass {
  personId: number;
  fullname: string;
  firstName: string;
  lastName: string;

  async ready() {
    super.ready();
    window.addEventListener('um-person-updated', (e: any) => {
      this.setProperties({personId: e.detail.personId, fullname: e.detail.fullname, firstName: e.detail.firstName, lastName: e.detail.lastName});
    });
    try {
      let person: any = await this._getPersonAsync();
      this.setProperties({personId: person.personId, fullname: person.fullname, firstName: person.firstName, lastName: person.lastName});
    } catch (e) {
    }
  }

  _getPersonAsync() {
    return new Promise((resolve, reject) => {
      const handleUpdate = function listener(e) {
        window.removeEventListener('um-person', handleUpdate);
        if (e.detail.rejected) {
          reject(e.detail.message);
        }
        resolve(e.detail);
      };
      window.addEventListener('um-person', handleUpdate);
      window.dispatchEvent(new CustomEvent('um-request-person'));
    });
  }

  static get properties() {
    return {personId: {type: Number, notify: true, value: 0}, fullname: {type: String, notify: true}, firstName: {type: String, notify: true}, lastName: {type: String, notify: true}};
  }
};
