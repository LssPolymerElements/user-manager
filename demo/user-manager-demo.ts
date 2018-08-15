import '@polymer/paper-input/paper-input';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-styles/paper-styles';
import 'lss-user-manager/lib/lss-user-manager';
import './authenticated-token-behavior-demo';

import {customElement, property, query} from '@polymer/decorators';
import {html, PolymerElement} from '@polymer/polymer/polymer-element';

@customElement('user-manager-demo')
export default class UserManagerDemo extends PolymerElement {
  @property({type: Array, notify: true})
  roles: Array<string>;

  @property({type: String})
  claimScopes: string;

  @query('lss-user-manager') userManager: any;

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
        <lss-user-manager id="manager" person-id="{{personId}}" last-name="{{lastName}}" fullname="{{fullname}}" first-name="{{firstName}}"
            roles="{{roles}}"></lss-user-manager>

        <h1>User Manager Actions</h1>
        <paper-button raised on-tap="logoutClicked">logout()</paper-button>
        <paper-button raised on-tap="authenticateAsync">authenticateAsync()</paper-button>
        <um-scope>
            <paper-input placeholder="Token Scopes (ex. General, Home)" value="{{claimScopes}}"> </paper-input>
            <paper-button raised on-tap="setScopes">Set Scopes</paper-button>
        </um-scope>

        <h1>User Manager Properties</h1>
        <um-prop>
            <b>fullname:</b> [[fullname]]</um-prop>
        <um-prop>
            <b>first-name:</b> [[firstName]]</um-prop>
        <um-prop>
            <b>last-name:</b> [[lastName]]</um-prop>
        <um-prop>
            <b>person-id:</b> [[personId]]</um-prop>
        <um-prop>
            <b>roles:</b>
        </um-prop>
        <ol>
            <template is="dom-repeat" items="[[roles]]">
                <li>[[item]]</li>
            </template>
        </ol>
        <hr/>
        <authenticated-token-behavior-demo></authenticated-token-behavior-demo>
        <hr/>
        <authenticated-roles-behavior-demo></authenticated-roles-behavior-demo>
        <hr/>
        <authenticated-person-behavior-demo></authenticated-person-behavior-demo>
    </template>

</dom-module>`;
  }

  logoutClicked() {
    console.log('logout clicked');
    this.userManager.logout();
    location.reload();
  }
  authenticateAsync() {
    this.userManager.authenticateAsync()
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