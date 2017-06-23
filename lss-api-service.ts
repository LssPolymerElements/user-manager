@customElement("lss-api-service")
class LssApiService extends LssRequesterBehavior(Polymer.Element) {

    @property({ notify: true })
    tokenProvider: ITokenProvider;

    @property({ notify: true })
    lssEnvironment: LssEnvironment;

    @property({ notify: true })
    isDev: boolean;

    @property({ notify: true })
    baseUrl: string;

    @property()
    isLoading: boolean;

    @property({ notify: true })
    baseProductionUri: string = "https://api2.leavitt.com/";

    @property({ notify: true })
    baseDevUri: string = "https://devapi2.leavitt.com/";

    @property({ notify: true })
    appNameKey: string = "X-LGAppName";

    @property({ notify: true })
    appName: string = "General";

    async connectedCallback() {
        super.connectedCallback();

        try {
            this.tokenProvider = this.requestInstance("TokenProvider");
        } catch (error) {
            console.log("Token Provider not found. Service will use default lss-token-provider.");
        }
    }

    ready() {
        super.ready();

        this.lssEnvironment = this.$.lssEnvironment;
        this.tokenProvider = this.$.lssTokenProvider;
    }

    @observe("isDev")
    environmentHandler() {
        this.baseUrl = this.$.lssEnvironment.isDev ? this.baseDevUri : this.baseProductionUri;
    }

    private createUri(urlPath: string): string {
        return this.baseUrl + urlPath;
    }


    async postAsync<T>(urlPath: string, body: any & IODataDto, appName: string | null = null): Promise<T | null> {

        var token = await this.tokenProvider.getTokenAsync();
        if (token === null) {
            throw new Error("Redirect failed. Not authenticated.");
        }

        //Add in the odata model info if it not already on the object
        if (body._odataInfo && !body["@odata.type"]) {
            if (body._odataInfo.type) {
                body["@odata.type"] = body._odataInfo.type;
            }
            delete body._odataInfo;
        }
        var headers: any = { "Content-Type": "application/json" };
        headers["Authorization"] = `Bearer ${token}`;
        if (this.appNameKey !== "")
            headers[this.appNameKey] = appName || this.appName;

        var response;
        try {
            response = await fetch(this.createUri(urlPath),
                {
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: headers
                });
        } catch (error) {
            if (error.message != null && error.message.indexOf("Failed to fetch") !== -1)
                return Promise.reject("Network error. Check your connection and try again.");

            return Promise.reject(error);
        }

        if (response.status === 204) {
            return Promise.resolve(null);
        }

        var json;
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
            return Promise.reject("Request error, please try again later.");
        }
    }

    async patchAsync(urlPath: string, body: any & IODataDto, appName: string | null = null): Promise<void> {
        var token = await this.tokenProvider.getTokenAsync();
        if (token === null) {
            throw new Error("Redirect failed. Not authenticated.");
        }

        //Add in the odata model info if it not already on the object
        if (body._odataInfo && !body["@odata.type"]) {
            if (body._odataInfo.type) {
                body["@odata.type"] = body._odataInfo.type;
            }
            delete body._odataInfo;
        }
        var headers: any = { "Content-Type": "application/json" };
        headers["Authorization"] = `Bearer ${token}`;

        if (this.appNameKey !== "")
            headers[this.appNameKey] = appName || this.appName;;

        var response;
        try {
            response = await fetch(this.createUri(urlPath),
                {
                    method: "PATCH",
                    body: JSON.stringify(body),
                    headers: headers
                });
        } catch (error) {
            if (error.message != null && error.message.indexOf("Failed to fetch") !== -1)
                return Promise.reject("Network error. Check your connection and try again.");

            return Promise.reject(error);
        }

        if (response.status === 204) {
            return Promise.resolve();
        }

        var json;
        try {
            json = await response.json();

            if (json.error != null) {
                return Promise.reject(json.error.message);
            }

            return Promise.reject("Request error, please try again later.");
        } catch (error) {
            return Promise.reject(`The server sent back invalid JSON. ${error}`);
        }
    }

    async patchReturnDtoAsync<T>(urlPath: string, body: any & IODataDto, appName: string | null = null): Promise<T> {
        var token = await this.tokenProvider.getTokenAsync();
        if (token === null) {
            throw new Error("Redirect failed. Not authenticated.");
        }

        //Add in the odata model info if it not already on the object
        if (body._odataInfo && !body["@odata.type"]) {
            if (body._odataInfo.type) {
                body["@odata.type"] = body._odataInfo.type;
            }
            delete body._odataInfo;
        }
        var headers: any = { "Content-Type": "application/json" };
        headers["Authorization"] = `Bearer ${token}`;

        if (this.appNameKey !== "")
            headers[this.appNameKey] = appName || this.appName;;

        headers["Prefer"] = "return=representation";

        var response;
        try {
            response = await fetch(this.createUri(urlPath),
                {
                    method: "PATCH",
                    body: JSON.stringify(body),
                    headers: headers
                });
        } catch (error) {
            if (error.message != null && error.message.indexOf("Failed to fetch") !== -1)
                return Promise.reject("Network error. Check your connection and try again.");

            return Promise.reject(error);
        }

        var json;
        try {
            json = await response.json();

            if (json.error != null) {
                return Promise.reject(json.error.message);
            }

            if (response.status === 200) {
                return Promise.resolve(json);
            } else {
                return Promise.reject("Request error, please try again later.");
            }
        } catch (error) {
            return Promise.reject(`The server sent back invalid JSON. ${error}`);
        }
    }

    async deleteAsync(urlPath: string, appName: string | null = null): Promise<void> {

        var token = await this.tokenProvider.getTokenAsync();
        if (token === null) {
            throw new Error("Redirect failed. Not authenticated.");
        }
        var headers: any = { "Content-Type": "application/json" };
        headers["Authorization"] = `Bearer ${token}`;
        if (this.appNameKey !== "")
            headers[this.appNameKey] = appName || this.appName;;

        var response;
        try {
            response = await fetch(this.createUri(urlPath),
                {
                    method: "DELETE",
                    headers: headers
                });
        } catch (error) {
            if (error.message != null && error.message.indexOf("Failed to fetch") !== -1)
                return Promise.reject("Network error. Check your connection and try again.");

            return Promise.reject(error);
        }

        if (response.status === 204) {
            return Promise.resolve();
        }

        if (response.status === 404) {
            return Promise.reject("Not Found");
        }

        var json;
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
            return Promise.reject("Request error, please try again later.");
        }
    }

    async getAsync<T extends IODataDto>(urlPath: string, appName: string | null = null): Promise<GetResult<T>> {

        var token = await this.tokenProvider.getTokenAsync();
        if (token === null) {
            throw new Error("Redirect failed. Not authenticated.");
        }
        var headers: any = { "Content-Type": "application/json" };
        headers["Authorization"] = `Bearer ${token}`;
        headers["Accept"] = "application/json";

        if (this.appNameKey !== "")
            headers[this.appNameKey] = appName || this.appName;;

        var response;
        try {
            response = await fetch(this.createUri(urlPath),
                {
                    method: "GET",
                    headers: headers

                });

        } catch (error) {
            if (error.message != null && error.message.indexOf("Failed to fetch") !== -1)
                return Promise.reject("Network error. Check your connection and try again.");

            return Promise.reject(error);
        }

        var json;
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