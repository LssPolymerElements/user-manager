// import '@polymer/paper-input/paper-input';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-styles/paper-styles';
import '@leavittsoftware/user-manager/lib/user-manager';
import './access-token-demo';
import './authenticated-person-data-demo';

import {GetUserManagerInstance} from '@leavittsoftware/user-manager/lib/user-manager';
import {customElement, property} from '@polymer/decorators';
import {html, PolymerElement} from '@polymer/polymer/polymer-element';

@customElement('user-manager-demo')
export default class UserManagerDemo extends PolymerElement {
  @property({type: Array, notify: true}) roles: Array<string>;

  @property({type: String}) claimScopes: string;

  static get template() {
    return html`
        <style>
            h1 {
                @apply --paper-font-title;
            }

            um-prop {
                display: block;
                @apply --paper-font-body1;
            }

            um-scope {
                @apply --layout-horizontal;
                @apply --layout-center;
            }

            paper-input {
                @apply --layout-flex-2;
            }

            li {
                @apply --paper-font-caption;
            }
        </style>
        <user-manager></user-manager>

        <h1>User Manager Actions</h1>
        <paper-button raised on-tap="logoutClicked">logout()</paper-button>
        <paper-button raised on-tap="authenticateAsync">authenticateAsync()</paper-button>
        <um-scope>
            <paper-input placeholder="Token Scopes (ex. General, Home)" value="{{claimScopes}}"> </paper-input>
            <paper-button raised on-tap="setScopes">Set Scopes</paper-button>
        </um-scope>
        <hr/>
        <access-token-demo></access-token-demo>
        <hr/>
        <authenticated-person-data-demo></authenticated-person-data-demo>
    </template>

</dom-module>`;
  }

  logoutClicked() {
    console.log('logout clicked');
    GetUserManagerInstance().logout();
    location.reload();
  }
  authenticateAsync() {
    GetUserManagerInstance()
        .authenticateAsync()
        .then(function(token) {
          console.log(token);
        })
        .catch(function(error) {
          console.warn(error);
        });
  }
  setScopes() {
    this.setClaimScopes(this.claimScopes || '');
  }
  setClaimScopes(claims = '') {
    if (claims.length > 0) {
      const data = JSON.stringify(claims.split(','));
      window.localStorage.setItem('LgClaimScopes', data);
    } else {
      window.localStorage.removeItem('LgClaimScopes');
    }
  }
}