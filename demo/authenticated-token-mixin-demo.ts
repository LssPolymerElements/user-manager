
import '@polymer/paper-button/paper-button';

import {customElement} from '@polymer/decorators';
import {html, PolymerElement} from '@polymer/polymer/polymer-element';
import {authenticatedTokenMixin as AuthToken} from 'lss-user-manager/lib/authenticated-token-mixin';

@customElement('authenticated-token-mixin-demo')
export default class AuthenticatedTokenMixinDemo extends AuthToken
(PolymerElement) {
  static get template() {
    return html`
         <style>
             h1 {
                 @apply --paper-font-title;
             }
         </style>
         <h1>Authenticated Token Mixin Demo Element</h1>
         <paper-button raised on-tap="onTap">call _getAccessTokenAsync()</paper-button>`;
  }
  onTap() {
    this._getAccessTokenAsync()
        .then(function(token) {
          console.log(token);
        })
        .catch(function(error) {
          console.warn(error);
        });
  }
}