
/// <reference path="./lss-environment.ts" />
/// <reference path="./TokenProvider.ts" />
const {observe, listen} = Polymer.decorators;

@customElement('lss-api-service')
class LssApiService extends TitaniumRequesterMixin
(Polymer.Element) {
  @property({notify: true, type: Object})
  tokenProvider: TokenProvider;

  @property({notify: true, type: Object})
  lssEnvironment: LssEnvironment;

  @property({notify: true, type: Boolean})
  isDev: boolean;

  @property({notify: true, type: String})
  baseUrl: string;

  @property({type: Boolean})
  isLoading: boolean;

  @property({notify: true, type: String})
  baseProductionUri: string = 'https://api2.leavitt.com/';

  @property({notify: true, type: String})
  baseDevUri: string = 'https://devapi2.leavitt.com/';

  @property({notify: true, type: String})
  appNameKey: string = 'X-LGAppName';

  @property({notify: true, type: String})
  appName: string = 'General';

  async connectedCallback() {
    super.connectedCallback();

    try {
      this.tokenProvider = await this.requestInstance('TokenProvider');
    } catch (error) {
      console.log('Token Provider not found. Service will use default lss-token-provider.');
    }
  }
  ready() {
    super.ready();

    this.lssEnvironment = this.$.lssEnvironment as LssEnvironment;
    this.tokenProvider = this.$.lssTokenProvider as LssTokenProvider;
  }

  @observe('isDev')
  _environmentHandler(isDev: boolean) {
    this.baseUrl = isDev ? this.baseDevUri : this.baseProductionUri;
  }

  private _createUri(urlPath: string): string {
    return this.baseUrl + urlPath;
  }

  async postAsync<T>(urlPath: string, body: any&ODataDto, appName: string|null = null): Promise<T|null> {
    let token = await this.tokenProvider.getTokenAsync();
    if (token === null) {
      throw new Error('Redirect failed. Not authenticated.');
    }

    // Add in the odata model info if it not already on the object
    if (body._odataInfo && !body['@odata.type']) {
      if (body._odataInfo.type) {
        body['@odata.type'] = body._odataInfo.type;
      }
      delete body._odataInfo;
    }
    let headers: any = {'Content-Type': 'application/json'};
    headers['Authorization'] = `Bearer ${token}`;
    if (this.appNameKey !== '')
      headers[this.appNameKey] = appName || this.appName;

    let response;
    try {
      response = await fetch(this._createUri(urlPath), {method: 'POST', body: JSON.stringify(body), headers: headers});
    } catch (error) {
      if (error.message != null && error.message.indexOf('Failed to fetch') !== -1)
        return Promise.reject('Network error. Check your connection and try again.');

      return Promise.reject(error);
    }

    if (response.status === 204) {
      return Promise.resolve(null);
    }

    let json;
    try {
      json = await response.json();
    } catch (error) {
      return Promise.reject(`The server sent back invalid JSON. ${error}`);
    }

    if (json.error != null) {
      return Promise.reject(json.error.message);
    }

    if (response.status === 201 || response.status === 200) {
      return Promise.resolve(json);
    } else {
      return Promise.reject('Request error, please try again later.');
    }
  }

  async patchAsync(urlPath: string, body: any&ODataDto, appName: string|null = null): Promise<void> {
    let token = await this.tokenProvider.getTokenAsync();
    if (token === null) {
      throw new Error('Redirect failed. Not authenticated.');
    }

    // Add in the odata model info if it not already on the object
    if (body._odataInfo && !body['@odata.type']) {
      if (body._odataInfo.type) {
        body['@odata.type'] = body._odataInfo.type;
      }
      delete body._odataInfo;
    }
    let headers: any = {'Content-Type': 'application/json'};
    headers['Authorization'] = `Bearer ${token}`;

    if (this.appNameKey !== '')
      headers[this.appNameKey] = appName || this.appName;

    let response;
    try {
      response = await fetch(this._createUri(urlPath), {method: 'PATCH', body: JSON.stringify(body), headers: headers});
    } catch (error) {
      if (error.message != null && error.message.indexOf('Failed to fetch') !== -1)
        return Promise.reject('Network error. Check your connection and try again.');

      return Promise.reject(error);
    }

    if (response.status === 204) {
      return Promise.resolve();
    }

    let json;
    try {
      json = await response.json();

      if (json.error != null) {
        return Promise.reject(json.error.message);
      }

      return Promise.reject('Request error, please try again later.');
    } catch (error) {
      return Promise.reject(`The server sent back invalid JSON. ${error}`);
    }
  }

  async patchReturnDtoAsync<T>(urlPath: string, body: any&ODataDto, appName: string|null = null): Promise<T> {
    let token = await this.tokenProvider.getTokenAsync();
    if (token === null) {
      throw new Error('Redirect failed. Not authenticated.');
    }

    // Add in the odata model info if it not already on the object
    if (body._odataInfo && !body['@odata.type']) {
      if (body._odataInfo.type) {
        body['@odata.type'] = body._odataInfo.type;
      }
      delete body._odataInfo;
    }
    let headers: any = {'Content-Type': 'application/json'};
    headers['Authorization'] = `Bearer ${token}`;

    if (this.appNameKey !== '')
      headers[this.appNameKey] = appName || this.appName;

    headers['Prefer'] = 'return=representation';

    let response;
    try {
      response = await fetch(this._createUri(urlPath), {method: 'PATCH', body: JSON.stringify(body), headers: headers});
    } catch (error) {
      if (error.message != null && error.message.indexOf('Failed to fetch') !== -1)
        return Promise.reject('Network error. Check your connection and try again.');

      return Promise.reject(error);
    }

    let json;
    try {
      json = await response.json();

      if (json.error != null) {
        return Promise.reject(json.error.message);
      }

      if (response.status === 200) {
        return Promise.resolve(json);
      } else {
        return Promise.reject('Request error, please try again later.');
      }
    } catch (error) {
      return Promise.reject(`The server sent back invalid JSON. ${error}`);
    }
  }

  async deleteAsync(urlPath: string, appName: string|null = null): Promise<void> {
    let token = await this.tokenProvider.getTokenAsync();
    if (token === null) {
      throw new Error('Redirect failed. Not authenticated.');
    }
    let headers: any = {'Content-Type': 'application/json'};
    headers['Authorization'] = `Bearer ${token}`;
    if (this.appNameKey !== '')
      headers[this.appNameKey] = appName || this.appName;

    let response;
    try {
      response = await fetch(this._createUri(urlPath), {method: 'DELETE', headers: headers});
    } catch (error) {
      if (error.message != null && error.message.indexOf('Failed to fetch') !== -1)
        return Promise.reject('Network error. Check your connection and try again.');

      return Promise.reject(error);
    }

    if (response.status === 204) {
      return Promise.resolve();
    }

    if (response.status === 404) {
      return Promise.reject('Not Found');
    }

    let json;
    try {
      json = await response.json();
    } catch (error) {
      return Promise.reject(`The server sent back invalid JSON. ${error}`);
    }

    if (json.error != null) {
      return Promise.reject(json.error.message);
    }

    if (response.status === 201) {
      return Promise.resolve(json);
    } else {
      return Promise.reject('Request error, please try again later.');
    }
  }

  async getAsync<T extends ODataDto>(urlPath: string, appName: string|null = null): Promise<GetResult<T>> {
    let token = await this.tokenProvider.getTokenAsync();
    if (token === null) {
      throw new Error('Redirect failed. Not authenticated.');
    }
    let headers: any = {'Content-Type': 'application/json'};
    headers['Authorization'] = `Bearer ${token}`;
    headers['Accept'] = 'application/json';

    if (this.appNameKey !== '')
      headers[this.appNameKey] = appName || this.appName;

    let response;
    try {
      response = await fetch(this._createUri(urlPath), {
        method: 'GET',
        headers: headers

      });

    } catch (error) {
      if (error.message != null && error.message.indexOf('Failed to fetch') !== -1)
        return Promise.reject('Network error. Check your connection and try again.');

      return Promise.reject(error);
    }

    let json;
    try {
      json = await response.json();
    } catch (error) {
      return Promise.reject(`The server sent back invalid JSON. ${error}`);
    }

    if (json.error) {
      return Promise.reject(json.error.message);
    }

    return Promise.resolve(new GetResult<T>(json));
  }
}

class GetResult<T extends ODataDto> {
  private data: Array<T>;
  public odataCount: number;
  constructor(json: any) {
    if (json['@odata.count'])
      this.odataCount = json['@odata.count'];

    if (Array.isArray(json.value)) {
      this.data = json.value.map((o: any) => {
        return this.convertODataInfo(o);
      });
    } else {
      this.data = [];
      this.data.push(json.value ? json.value : json);
    }
  }

  count(): number {
    return this.data.length;
  }

  firstOrDefault(): T|null {
    if (this.count() > 0) {
      return this.convertODataInfo(this.data[0]);
    }
    return null;
  }

  toList(): Array<T> {
    return this.data;
  }

  private convertODataInfo(item: any): T {
    if (item['@odata.type']) {
      if (!item._odataInfo) {
        item._odataInfo = new ODataModelInfo();
      }
      item._odataInfo.type = item['@odata.type'];
      delete item['@odata.type'];

      let parts = item._odataInfo.type.split('.');
      item._odataInfo.shortType = parts[parts.length - 1];
    }
    return item;
  }
}

interface ODataDto {
  _odataInfo: ODataModelInfo;
}

class ODataDto implements ODataDto {
  constructor(modelInfo = new ODataModelInfo()) {
    this._odataInfo = modelInfo;
  }
  _odataInfo: ODataModelInfo;
}

interface ODataModelInfo {
  type: string|null;
  shortType: string|null;
}

class ODataModelInfo implements ODataModelInfo {
  type: string|null = null;
  shortType: string|null = null;
}