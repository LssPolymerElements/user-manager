
import '@polymer/paper-button/paper-button';

import {authenticatedPersonMixin} from '@leavittsoftware/user-manager/lib/authenticated-person-mixin';
import {customElement} from '@polymer/decorators';
import {html, PolymerElement} from '@polymer/polymer/polymer-element';

@customElement('authenticated-person-mixin-demo') export default class AuthenticatedPersonMixinDemo extends authenticatedPersonMixin
(PolymerElement) {
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
        </style>
        <h1>Authenticated Person Mixin Demo Element</h1>
        <um-prop><b>personId:</b> [[personId]]</um-prop>
        <um-prop><b>firstName:</b> [[firstName]]</um-prop>
        <um-prop><b>lastName:</b> [[lastName]]</um-prop>
        <um-prop><b>fullname:</b> [[fullname]]</um-prop>
        <um-prop><b>email:</b> [[email]]</um-prop>`;
  }
}