var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// import '@polymer/paper-input/paper-input';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-styles/paper-styles';
import '@leavittsoftware/user-manager/lib/user-manager';
import './access-token-demo';
import './authenticated-person-data-demo';
import { GetUserManagerInstace } from '@leavittsoftware/user-manager/lib/user-manager';
import { customElement, property } from '@polymer/decorators';
import { html, PolymerElement } from '@polymer/polymer/polymer-element';
let UserManagerDemo = class UserManagerDemo extends PolymerElement {
    static get template() {
        return html `
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
        GetUserManagerInstace().logout();
        location.reload();
    }
    authenticateAsync() {
        GetUserManagerInstace()
            .authenticateAsync()
            .then(function (token) {
            console.log(token);
        })
            .catch(function (error) {
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
        }
        else {
            window.localStorage.removeItem('LgClaimScopes');
        }
    }
};
__decorate([
    property({ type: Array, notify: true })
], UserManagerDemo.prototype, "roles", void 0);
__decorate([
    property({ type: String })
], UserManagerDemo.prototype, "claimScopes", void 0);
UserManagerDemo = __decorate([
    customElement('user-manager-demo')
], UserManagerDemo);
export default UserManagerDemo;
//# sourceMappingURL=user-manager-demo.js.map