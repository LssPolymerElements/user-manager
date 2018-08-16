
import '@polymer/paper-button/paper-button';

import {authenticatedTokenMixin as AuthToken} from '@leavittsoftware/lss-user-manager/lib/authenticated-token-mixin';
import {customElement} from '@polymer/decorators';
import {html, PolymerElement} from '@polymer/polymer/polymer-element';

@customElement('authenticated-token-behavior-demo')
export default class AuthenticatedTokenBehaviorDemo extends AuthToken
(PolymerElement) {
  static get template() {
    return html`
         <style>
             h1 {
                 @apply --paper-font-title;
             }
         </style>
         <h1>Authenticated Token Behavior Demo Element</h1>
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