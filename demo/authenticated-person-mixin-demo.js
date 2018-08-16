var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import '@polymer/paper-button/paper-button';
import { customElement } from '@polymer/decorators';
import { html, PolymerElement } from '@polymer/polymer/polymer-element';
import { authenticatedPersonMixin } from 'lss-user-manager/lib/authenticated-person-mixin';
let AuthenticatedPersonMixinDemo = class AuthenticatedPersonMixinDemo extends authenticatedPersonMixin(PolymerElement) {
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
        </style>
        <h1>Authenticated Person Mixin Demo Element</h1>
        <um-prop><b>personId:</b> [[personId]]</um-prop>
        <um-prop><b>firstName:</b> [[firstName]]</um-prop>
        <um-prop><b>lastName:</b> [[lastName]]</um-prop>
        <um-prop><b>fullname:</b> [[fullname]]</um-prop>`;
    }
};
AuthenticatedPersonMixinDemo = __decorate([
    customElement('authenticated-person-mixin-demo')
], AuthenticatedPersonMixinDemo);
export default AuthenticatedPersonMixinDemo;
//# sourceMappingURL=authenticated-person-mixin-demo.js.map