
import '@polymer/paper-button/paper-button';

import {authenticatedRolesMixin} from '@leavittsoftware/user-manager/lib/authenticated-roles-mixin';
import {customElement} from '@polymer/decorators';
import {html, PolymerElement} from '@polymer/polymer/polymer-element';

@customElement('authenticated-roles-mixin-demo')
export default class AuthenticatedRolesMixinDemo extends authenticatedRolesMixin
(PolymerElement) {
  static get template() {
    return html`
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
}