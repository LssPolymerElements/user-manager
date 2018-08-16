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
let AuthenticatedPersonBehaviorDemo = class AuthenticatedPersonBehaviorDemo extends authenticatedPersonMixin(PolymerElement) {
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
        <h1>Authenticated Person Behavior Demo Element</h1>
        <um-prop><b>personId:</b> [[personId]]</um-prop>
        <um-prop><b>firstName:</b> [[firstName]]</um-prop>
        <um-prop><b>lastName:</b> [[lastName]]</um-prop>
        <um-prop><b>fullname:</b> [[fullname]]</um-prop>`;
    }
};
AuthenticatedPersonBehaviorDemo = __decorate([
    customElement('authenticated-person-behavior-demo')
], AuthenticatedPersonBehaviorDemo);
export default AuthenticatedPersonBehaviorDemo;
// declare function AuthenticatedPersonBehavior<T extends new (...args: any[]) => {}>(base: T): AuthenticatedPersonBehaviorConstructor&T;
// interface AuthenticatedPersonBehaviorConstructor {
//     new(...args: any[]): AuthenticatedPersonBehavior;
//   }
//   interface AuthenticatedPersonBehavior {
//     personId: number;
//     fullname: string;
//     firstName: string;
//     lastName: string;
//     _getPersonAsync(): Promise<{personId: number, fullname: string, firstName: string, lastName: string}>;
//   }
// authenticated-token-mixin.js
// <link rel="import" href="../../polymer/polymer.html">
// <link rel="import" href="../../paper-button/paper-button.html">
// <link rel="import" href="../../paper-styles/typography.html">
// <link rel="import" href="../authenticated-token-behavior.html">
// <dom-module id="authenticated-token-behavior-demo">
//     <template>
//         <style>
//             h1 {
//                 @apply --paper-font-title;
//             }
//         </style>
//         <h1>Authenticated Token Behavior Demo Element</h1>
//         <paper-button raised on-tap="onTap">call _getAccessTokenAsync()</paper-button>
//     </template>
//     <script>
//         class AuthenticatedTokenBehaviorDemo extends AuthenticatedTokenBehavior(Polymer.Element) {
//             static get is() {
//                 return 'authenticated-token-behavior-demo';
//             }
//             onTap(e) {
//                 this._getAccessTokenAsync().then(function (token) {
//                     console.log(token);
//                 }).catch(function (error) {
//                     console.warn(error);
//                 });
//             }
//         }
//         customElements.define(AuthenticatedTokenBehaviorDemo.is, AuthenticatedTokenBehaviorDemo);
//     </script>
// </dom-module>
//# sourceMappingURL=authenticated-person-behavior-demo.js.map