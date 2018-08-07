/// <reference path="./LssJwtToken.ts" />
declare var jwt_decode: any;

@Polymer.decorators.customElement('lss-user-manager')
class LssUserManager extends Polymer.Element {
  @Polymer.decorators.property({notify: true, type: Array})
  roles: Array<string> = [];

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

  private _hasAuthenticated = false;

  async ready() {
    console.log('user manager ready');
    super.ready();

    window.addEventListener('um-request-token', async () => {
      try {
        const token = await this.authenticateAsync();
        window.dispatchEvent(new CustomEvent('um-token', {detail: {jwtToken: token, accessToken: this._getAccessTokenFromLocalStorage()}}));

      } catch (error) {
        window.dispatchEvent(new CustomEvent('um-token', {detail: {rejected: true, message: error}}));
      }
    });

    window.addEventListener('um-request-roles', async () => {
      if (!this._hasAuthenticated) {
        try {
          await this.authenticateAsync();
        } catch (error) {
          window.dispatchEvent(new CustomEvent('um-roles', {detail: {rejected: true, message: error}}));
        }
      }

      window.dispatchEvent(new CustomEvent('um-roles', {detail: {roles: this._clone(this.roles)}}));
    });

    window.addEventListener('um-request-person', async () => {
      if (!this._hasAuthenticated) {
        try {
          await this.authenticateAsync();
        } catch (error) {
          window.dispatchEvent(new CustomEvent('um-person', {detail: {rejected: true, message: error}}));
        }
      }
      window.dispatchEvent(new CustomEvent('um-person', {detail: {personId: this.personId, fullname: this.fullname, firstName: this.firstName, lastName: this.lastName}}));
    });

    if (!this.disableAutoload || this._getTokenfromUrl('refreshToken')) {
      await this.authenticateAsync();
    }
  }

  @Polymer
      .decorators.observe('personId', 'fullname', 'firstName', 'lastName') protected _handlePersonChange() {
    window.dispatchEvent(new CustomEvent('um-person-updated', {detail: {personId: this.personId, fullname: this.fullname, firstName: this.firstName, lastName: this.lastName}}));
  }

  private _clone(obj: any) {
    return JSON.parse(JSON.stringify(obj));
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
      console.warn(`Failed to parse scopes in local storage. ${error}`);
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

  private _saveRefreshTokenToLocalStorage(accessToken: string|null): void {
    window.localStorage.setItem('LG-AUTH-RT', accessToken || '');
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
    // Batch set local properties.
    this.setProperties({personId: Number(jwtToken.nameid), fullname: jwtToken.unique_name, firstName: jwtToken.given_name, lastName: jwtToken.family_name});

    // Sync roles to local array and notifiy behaviors.
    // Add new roles
    jwtToken.role.forEach(o => {
      if (this.roles.indexOf(o) === -1) {
        this.push('roles', o);
        window.dispatchEvent(new CustomEvent('um-role-added', {detail: {role: o}}));
      }
    });

    // Remove old roles
    this.roles.forEach((o, i) => {
      if (jwtToken.role.indexOf(o) === -1) {
        this.splice('roles', i, 1);
        window.dispatchEvent(new CustomEvent('um-role-removed', {detail: {role: o}}));
      }
    });
  }

  private async _getTokenAsync(): Promise<LssJwtToken> {
    let accessToken = this._getAccessTokenFromLocalStorage();
    let refreshToken = this._getTokenfromUrl('refreshToken') || this._getRefreshTokenFromLocalStorage() || null;
    this._clearHashFromUrl();

    // validate uri access token
    const jwtToken = this._decodeAccessToken(accessToken);
    if (jwtToken && this._validateToken(jwtToken)) {
      console.log('valid token!');
      this.dispatchEvent(new CustomEvent('token', {detail: accessToken}));
      this._saveAccessTokenToLocalStorage(accessToken);
      this._saveRefreshTokenToLocalStorage(refreshToken);
      this._setLocalProperties(jwtToken);
      this._hasAuthenticated = true;
      return Promise.resolve(jwtToken);
    }

    if (refreshToken != null) {
      try {
        accessToken = await this._getAccessTokenFromApiAsync(refreshToken, this.tokenUri);
      } catch (error) {
        this.dispatchEvent(new CustomEvent('token', {detail: {rejected: true, message: error}}));
        return Promise.reject(error);
      }

      const jwtToken = this._decodeAccessToken(accessToken);
      if (jwtToken && this._validateToken(jwtToken)) {
        this.dispatchEvent(new CustomEvent('token', {detail: accessToken}));
        this._saveAccessTokenToLocalStorage(accessToken);
        this._saveRefreshTokenToLocalStorage(refreshToken);
        this._setLocalProperties(jwtToken);
        this._hasAuthenticated = true;
        return Promise.resolve(jwtToken);
      }
    }

    return Promise.reject('Not authenticated');
  }

  async authenticateAsync(): Promise<LssJwtToken> {
    if (this.isAuthenticating) {
      console.log('waiting for first promise');
      return new Promise<LssJwtToken>((resolve, reject) => {
        const self = this;
        let listener = function listener(e: any) {
          self.removeEventListener('token', listener);
          if (e.detail.rejected) {
            console.log('rejected!');
            reject(e.detail.message);
          }
          resolve(e.detail.accessToken);
          console.log('resolved!');
        };
        this.addEventListener('token', listener);
      });
    }

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
        this.isAuthenticating = false;
        reject(error);
      }
      this.isAuthenticating = false;
      resolve(jwtToken);
    });
  }

  logout() {
    localStorage.removeItem('LG-AUTH-AT');
    localStorage.removeItem('LG-AUTH-RT');

    this.setProperties({personId: 0, fullname: '', firstName: '', lastName: ''});

    this.roles.forEach(o => {
      window.dispatchEvent(new CustomEvent('um-role-removed', {detail: {role: o}}));
    });
    this.roles = [];
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