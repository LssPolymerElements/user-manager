declare var jwt_decode: any;

@Polymer.decorators.customElement('lss-user-manager')
class LssUserManager extends Polymer.Element {
  @Polymer.decorators.property({notify: true, type: Array})
  roles: Array<string>;

  @Polymer.decorators.property({notify: true, type: String})
  fullname: string;

  @Polymer.decorators.property({notify: true, type: String})
  firstName: string;

  @Polymer.decorators.property({notify: true, type: String})
  lastName: string;

  @Polymer.decorators.property({type: Number, notify: true})
  personId: number = 0;

  @Polymer.decorators.property({type: String})
  redirectUrl: string = 'https://signin.leavitt.com/';

  @Polymer.decorators.property({type: String})
  redirectDevUrl: string = 'https://devsignin.leavitt.com/';

  @Polymer.decorators.property({type: String})
  tokenUri: string = 'https://oauth2.leavitt.com/token';

  @Polymer.decorators.property({type: Boolean})
  disableAutoload: boolean = false;

  @Polymer.decorators.property({type: Boolean})
  isAuthenticating: boolean;

  constructor() {
    super();
    this.handleRequestTokenRequest = this.handleRequestTokenRequest.bind(this);
  }

  async connectedCallback() {
    super.connectedCallback();

    if (!this.disableAutoload) {
      await this.authenticateAsync();
    }

    window.addEventListener('um-request-token', this.handleRequestTokenRequest);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    window.removeEventListener('um-request-token', this.handleRequestTokenRequest);
  }

  private handleRequestTokenRequest() {
    if (this.isAuthenticating) {
      return;
    }

    try {
      this.authenticateAsync();
    } catch (error) {
    }
  }

  private _redirectToLogin(continueUrl: string) {
    let redirectUrl = `${this.isDevelopment() ? this.redirectDevUrl : this.redirectUrl}?continue=${encodeURIComponent(continueUrl)}`;
    document.location.href = redirectUrl;
  }

  private _redirectToSignOut(continueUrl: string) {
    let redirectUrl = `${this.isDevelopment() ? this.redirectDevUrl : this.redirectUrl}sign-out/?continue=${encodeURIComponent(continueUrl)}`;
    document.location.href = redirectUrl;
  }

  private _getHashParametersFromUrl(): Array<{key: string, value: string}> {
    const hashParams = [];
    if (window.location.hash) {
      let hash = window.location.hash.substring(1);
      hash = decodeURIComponent(hash);
      const hashArray = hash.split('&');

      for (let i in hashArray) {
        if (hashArray.hasOwnProperty(i)) {
          const keyValPair = hashArray[i].split('=');
          if (keyValPair.length > 1) {
            hashParams.push({key: keyValPair[0], value: decodeURIComponent(keyValPair[1])});
          }
        }
      }
    }
    return hashParams;
  }

  private _getClaimScopes(localStorageKey: string): Array<string> {
    try {
      return JSON.parse(window.localStorage.getItem(localStorageKey) || '[]');
    } catch (error) {
      console.log(`Failed to parse scopes in local storage. ${error}`);
      return [];
    }
  }

  private _clearHashFromUrl() {
    if (document.location.hash && document.location.hash.indexOf('refreshToken') > -1)
      document.location.hash = '';
  }

  private _getTokenfromUrl(tokenName: string): string|null {
    const hashParameters = this._getHashParametersFromUrl();
    const accessTokenArray = hashParameters.filter(value => value.key === tokenName);
    if (accessTokenArray.length === 0) {
      return null;
    } else {
      return accessTokenArray[0].value;
    }
  }

  private _decodeAccessToken(accessToken: string): LssJwtToken|null {
    if (!accessToken) {
      return null;
    }

    let token;
    try {
      token = jwt_decode(accessToken) as LssJwtToken;
    } catch (error) {
      // Invalid JWT token format
      return null;
    }

    if (token) {
      token.exp = new Date(0).setUTCSeconds(token.exp as number);
    }
    return token;
  }

  private _validateToken(accessToken: LssJwtToken): boolean {
    let currentDate = new Date();
    currentDate.setSeconds(currentDate.getSeconds() + 30);

    if (accessToken.iss !== 'https://oauth2.leavitt.com/') {
      return false;
    }

    if (accessToken.exp <= currentDate) {
      return false;
    }

    return true;
  }

  private _getAccessTokenFromLocalStorage(): string {
    return window.localStorage.getItem('LG-AUTH-AT') || '';
  }

  private _saveAccessTokenToLocalStorage(accessToken: string): void {
    window.localStorage.setItem('LG-AUTH-AT', accessToken);
  }

  private _getRefreshTokenFromLocalStorage(): string {
    return window.localStorage.getItem('LG-AUTH-RT') || '';
  }

  private _saveRefreshTokenToLocalStorage(accessToken: string): void {
    window.localStorage.setItem('LG-AUTH-RT', accessToken);
  }

  private async _getAccessTokenFromApiAsync(refreshToken: string, uri: string): Promise<string> {
    if (!window.navigator.onLine) {
      return Promise.reject('Computer not connected. Make sure your computer is connected to the internet.');
    }

    const claimScopes = this._getClaimScopes('LgClaimScopes');
    const body = {grant_type: 'refresh_token', refresh_token: refreshToken} as any;

    if (claimScopes.length > 0) {
      body.claim_scopes = claimScopes;
    }

    let response = await fetch(uri, {method: 'POST', body: JSON.stringify(body), headers: [['Content-Type', 'application/json'], ['Accept', 'application/json']]});

    let json;
    try {
      json = await response.json();
    } catch (error) {
      return Promise.reject('Get Auth Token: The server sent back invalid JSON.');
    }

    if (response.status === 200 && json.access_token) {
      return Promise.resolve(json.access_token);
    }

    if (json.error) {
      if (json.error === 'unauthorized_client') {
        return Promise.reject('Not authenticated');
      }

      return Promise.reject(json.error);
    }
    return Promise.reject('Not authenticated');
  }

  private _setLocalProperties(jwtToken: LssJwtToken) {
    this.personId = Number(jwtToken.nameid);
    this.fullname = jwtToken.unique_name;
    this.firstName = jwtToken.given_name;
    this.lastName = jwtToken.family_name;
    this.roles = jwtToken.role;
  }

  private async _getTokenAsync(): Promise<LssJwtToken> {
    let accessToken = this._getTokenfromUrl('accessToken') || this._getAccessTokenFromLocalStorage();
    let refreshToken = this._getTokenfromUrl('refreshToken') || this._getRefreshTokenFromLocalStorage();
    this._clearHashFromUrl();

    // validate uri access token
    const jwtToken = this._decodeAccessToken(accessToken);
    if (jwtToken && this._validateToken(jwtToken)) {
      this._saveAccessTokenToLocalStorage(accessToken);
      this._saveRefreshTokenToLocalStorage(refreshToken);
      this._setLocalProperties(jwtToken);
      return Promise.resolve(jwtToken);
    }

    if (refreshToken != null) {
      accessToken = await this._getAccessTokenFromApiAsync(refreshToken, this.tokenUri);
      const jwtToken = this._decodeAccessToken(accessToken);
      if (jwtToken && this._validateToken(jwtToken)) {
        this._saveAccessTokenToLocalStorage(accessToken);
        this._saveRefreshTokenToLocalStorage(refreshToken);
        this._setLocalProperties(jwtToken);
        return Promise.resolve(jwtToken);
      }
    }

    return Promise.reject('Not authenticated');
  }

  async authenticateAsync(): Promise<LssJwtToken> {
    return new Promise<LssJwtToken>(async (resolve, reject) => {
      let jwtToken;
      try {
        this.isAuthenticating = true;
        jwtToken = await this._getTokenAsync();
      } catch (error) {
        if (error === 'Not authenticated') {
          this._redirectToLogin(document.location.href);
          this.isAuthenticating = false;
          return;  // Wait for the redirect to happen with a unreturned promise
        }
        window.dispatchEvent(new CustomEvent('um-auth-complete', {detail: {rejected: true, message: error}}));
        this.isAuthenticating = false;
        reject(error);
      }
      window.dispatchEvent(new CustomEvent('um-auth-complete', {detail: {jwtToken: jwtToken, accessToken: this._getAccessTokenFromLocalStorage()}}));
      this.isAuthenticating = false;
      resolve(jwtToken);
    });
  }

  logout() {
    localStorage.removeItem('LG-AUTH-AT');
    localStorage.removeItem('LG-AUTH-RT');
    this._redirectToSignOut(document.location.href);
    return;
  }

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