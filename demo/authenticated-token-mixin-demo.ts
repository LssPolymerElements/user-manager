
import '@polymer/paper-button/paper-button';

import {authenticatedTokenMixin as AuthToken} from '@leavittsoftware/user-manager/lib/authenticated-token-mixin';
import {customElement} from '@polymer/decorators';
import {html, PolymerElement} from '@polymer/polymer/polymer-element';

@customElement('authenticated-token-mixin-demo') export default class AuthenticatedTokenMixinDemo extends AuthToken
(PolymerElement) {
  token: string;

  static get template() {
    return html`
         <style>
             h1 {
                 @apply --paper-font-title;
             }

             paper-button {
               display:block;
               margin-bottom:4px;
             }

             um-token {
              word-break: break-all;
             }
         </style>
         <h1>Authenticated Token Mixin Demo Element</h1>
         <paper-button raised on-tap="onTap">call _getAccessTokenAsync()</paper-button>
         <um-prop><b>token:</b><um-token>[[token]]</um-token></um-prop>`;
  }
  onTap() {
    this._getAccessTokenAsync()
        .then((token) => {
          this.token = token;
        })
        .catch(function(error) {
          console.warn(error);
        });
  }

  static get properties() {
    return {token: {type: String, value: ''}};
  }
}