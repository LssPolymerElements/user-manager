
import '@polymer/paper-button/paper-button';

import {GetUserManagerInstace} from '@leavittsoftware/user-manager/lib/user-manager';
import {customElement, property} from '@polymer/decorators';
import {html, PolymerElement} from '@polymer/polymer/polymer-element';

@customElement('authenticated-person-data-demo')
export default class AuthenticatedPersonMixinDemo extends PolymerElement {
  connectedCallback() {
    super.connectedCallback();
    GetUserManagerInstace().addEventListener('um-updated', () => this.updateProps());
    this.updateProps()
  }

  private updateProps() {
    this.personId = GetUserManagerInstace().personId;
    this.fullname = GetUserManagerInstace().fullname;
    this.lastName = GetUserManagerInstace().lastName;
    this.firstName = GetUserManagerInstace().firstName;
    this.email = GetUserManagerInstace().email;
    this.personId = GetUserManagerInstace().personId;
    this.roles = GetUserManagerInstace().roles;
  }

  @property({type: Array}) roles: Array<string> = [];

  @property({type: String}) fullname: string;

  @property({type: String}) firstName: string;

  @property({type: String}) lastName: string;

  @property({type: String}) email: string;

  @property({type: Number}) personId: number = 0;

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
        <um-prop><b>email:</b> [[email]]</um-prop>
        <um-prop><b>roles:</b> </um-prop>
        <ol>
            <template is="dom-repeat" items="[[roles]]">
                <li>[[item]]</li>
            </template>
        </ol>`;
  }
}