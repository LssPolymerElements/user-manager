@customElement('lss-environment')
class LssEnvironment extends Polymer.Element {
  constructor() {
    super();
    this.isDev = this.isDevelopment();
  }

  @Polymer.decorators.property({notify: true, type: Boolean})
  isDev: boolean = false;

  isDevelopment(): boolean {
    if (document == null || document.location == null || document.location.host == null)
      return true;

    const host = document.location.host;
    if (host.indexOf('dev') !== -1)
      return true;

    if (host.indexOf('localhost') !== -1)
      return true;

    return false;
  }
}