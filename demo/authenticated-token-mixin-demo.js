var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import '@polymer/paper-button/paper-button';
import { customElement } from '@polymer/decorators';
import { html, PolymerElement } from '@polymer/polymer/polymer-element';
import { authenticatedTokenMixin as AuthToken } from 'lss-user-manager/lib/authenticated-token-mixin';
let AuthenticatedTokenMixinDemo = class AuthenticatedTokenMixinDemo extends AuthToken(PolymerElement) {
    static get template() {
        return html `
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
            .then(function (token) {
            console.log(token);
        })
            .catch(function (error) {
            console.warn(error);
        });
    }
};
AuthenticatedTokenMixinDemo = __decorate([
    customElement('authenticated-token-mixin-demo')
], AuthenticatedTokenMixinDemo);
export default AuthenticatedTokenMixinDemo;
//# sourceMappingURL=authenticated-token-mixin-demo.js.map