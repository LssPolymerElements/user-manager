
import '@polymer/paper-button/paper-button';

import {GetUserManagerInstance} from '@leavittsoftware/user-manager/lib/user-manager';
import {UserManagerUpdatedEvent} from '@leavittsoftware/user-manager/lib/user-manager-events';
import {customElement, property} from '@polymer/decorators';
import {html, PolymerElement} from '@polymer/polymer/polymer-element';

@customElement('authenticated-person-data-demo')
export default class AuthenticatedPersonDataDemo extends PolymerElement {
  connectedCallback() {
    super.connectedCallback();
    GetUserManagerInstance().addEventListener(UserManagerUpdatedEvent.eventName, () => this.updateProps());
    this.updateProps();
  }

  private updateProps() {
    this.personId = GetUserManagerInstance().personId;
    this.fullname = GetUserManagerInstance().fullname;
    this.lastName = GetUserManagerInstance().lastName;
    this.firstName = GetUserManagerInstance().firstName;
    this.email = GetUserManagerInstance().email;
    this.personId = GetUserManagerInstance().personId;
    this.roles = GetUserManagerInstance().roles;
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
        <h1>Authenticated Person Data Demo Element</h1>
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