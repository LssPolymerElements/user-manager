
import '@polymer/paper-button/paper-button';

import {GetUserManagerInstace} from '@leavittsoftware/user-manager/lib/user-manager';
import {customElement} from '@polymer/decorators';
import {html, PolymerElement} from '@polymer/polymer/polymer-element';

@customElement('access-token-demo')
export default class AccessTokenDemo extends PolymerElement {
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
         <h1>Access Token Demo Element</h1>
         <paper-button raised on-tap="onTap">call _getAccessTokenAsync()</paper-button>
         <um-prop><b>token:</b><um-token>[[token]]</um-token></um-prop>`;
  }
  onTap() {
    GetUserManagerInstace().getAccessTokenAsync().then((token) => {this.token = token}).catch(function(error) {
      console.warn(error);
    });
  }

  static get properties() {
    return {token: {type: String, value: ''}};
  }
}