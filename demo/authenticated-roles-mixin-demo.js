var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import '@polymer/paper-button/paper-button';
import { customElement } from '@polymer/decorators';
import { html, PolymerElement } from '@polymer/polymer/polymer-element';
import { authenticatedRolesMixin } from 'lss-user-manager/lib/authenticated-roles-mixin';
let AuthenticatedRolesMixinDemo = class AuthenticatedRolesMixinDemo extends authenticatedRolesMixin(PolymerElement) {
    static get template() {
        return html `
         <style>
            h1 {
                @apply --paper-font-title;
            }

            um-scope {
                @apply --layout-horizontal;
                @apply --layout-center;
            }

            li {
                @apply --paper-font-caption;
            }
        </style>
        <h1>Authenticated Roles Mixin Demo Element</h1>
        <um-prop><b>roles:</b> </um-prop>
        <ol>
            <template is="dom-repeat" items="[[roles]]">
                <li>[[item]]</li>
            </template>
        </ol>`;
    }
};
AuthenticatedRolesMixinDemo = __decorate([
    customElement('authenticated-roles-mixin-demo')
], AuthenticatedRolesMixinDemo);
export default AuthenticatedRolesMixinDemo;
//# sourceMappingURL=authenticated-roles-mixin-demo.js.map