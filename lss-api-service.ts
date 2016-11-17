@behavior(LssRequesterBehavior)
@component("lss-api-service")
class LssApiService extends polymer.Base {
    requestInstance: (key: string) => any;

    @property({
        type: LssUserManager,
        notify: true
    })
    userManager: LssUserManager;

    @property({
        type: LssEnvironment,
        notify: true
    })
    lssEnvironment: LssEnvironment;

    @property({
        type: String,
        notify: true
    })
    baseUrl: string;

    @property()
    isLoading: boolean;

    baseProductionUri = "https://api2.leavitt.com/";
    baseDevUri = "https://devapi2.leavitt.com/";

    attached() {
        this.userManager = this.requestInstance("UserManager");
        this.lssEnvironment = this.$.lssEnvironment;
        this.baseUrl = this.lssEnvironment.isDev() ? this.baseDevUri : this.baseProductionUri;
    }

    private createUri(urlPath: string): string {
        return this.baseUrl + urlPath;
    }

    postAsync<T>(urlPath: string, body: Object & IODataDto, appName: string = "General"): Promise<T> {
        return this.userManager.authenticateAndGetUserAsync()
            .then(o => {

                //Add in the odata model info if it not already on the object
                if (body._odataInfo && !body["@odata.type"]) {
                    if (body._odataInfo.type) {
                        body["@odata.type"] = body._odataInfo.type;
                    }
                    delete body._odataInfo;
                }

                return fetch(this.createUri(urlPath),
                    {
                        method: "POST",
                        body: JSON.stringify(body),
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${o.accessToken}`,
                            "X-LGAppName": appName
                        }

                    })
                    .then(response => {
                        if (response.status === 204) {
                            return Promise.resolve();
                        }

                        return response.json()
                            .then(json => {
                                if (json.error != null) {
                                    return Promise.reject(json.error.message);
                                }

                                if (response.status === 201) {
                                    return Promise.resolve(json);
                                } else {
                                    return Promise.reject("Request error, please try again later.");
                                }

                            },
                            error => {
                                return Promise.reject(`The server sent back invalid JSON. ${error}`);
                            });
                    }, error => {
                        if (error.message != null && error.message.indexOf("Failed to fetch") !== -1)
                            return Promise.reject("Network error. Check your connection and try again.");

                        return Promise.reject(error);
                    });
            });
    }

    patchAsync(urlPath: string, body: Object & IODataDto, appName: string = "General"): Promise<void> {
        return this.userManager.authenticateAndGetUserAsync()
            .then(o => {

                //Add in the odata model info if it not already on the object
                if (body._odataInfo && !body["@odata.type"]) {
                    if (body._odataInfo.type) {
                        body["@odata.type"] = body._odataInfo.type;
                    }
                    delete body._odataInfo;
                }

                return fetch(this.createUri(urlPath),
                    {
                        method: "PATCH",
                        body: JSON.stringify(body),
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${o.accessToken}`,
                            "X-LGAppName": appName
                        }

                    })
                    .then(response => {
                        if (response.status === 204) {
                            return Promise.resolve();
                        }

                        return response.json()
                            .then(json => {
                                if (json.error != null) {
                                    return Promise.reject(json.error.message);
                                }

                                if (response.status === 201) {
                                    return Promise.resolve(json);
                                } else {
                                    return Promise.reject("Request error, please try again later.");
                                }

                            },
                            error => {
                                return Promise.reject(`The server sent back invalid JSON. ${error}`);
                            });
                    }, error => {
                        if (error.message != null && error.message.indexOf("Failed to fetch") !== -1)
                            return Promise.reject("Network error. Check your connection and try again.");

                        return Promise.reject(error);
                    });
            });
    }

    deleteAsync(urlPath: string, appName: string = "General"): Promise<void> {
        return this.userManager.authenticateAndGetUserAsync()
            .then(o => {
                return fetch(this.createUri(urlPath),
                    {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${o.accessToken}`,
                            "X-LGAppName": appName
                        }

                    })
                    .then(response => {
                        if (response.status === 204) {
                            return Promise.resolve();
                        }

                        return response.json()
                            .then(json => {
                                if (json.error != null) {
                                    return Promise.reject(json.error.message);
                                }

                                if (response.status === 201) {
                                    return Promise.resolve(json);
                                } else {
                                    return Promise.reject("Request error, please try again later.");
                                }

                            },
                            error => {
                                return Promise.reject(`The server sent back invalid JSON. ${error}`);
                            });
                    }, error => {
                        if (error.message != null && error.message.indexOf("Failed to fetch") !== -1)
                            return Promise.reject("Network error. Check your connection and try again.");

                        return Promise.reject(error);
                    });
            });
    }

    getAsync<T extends IODataDto>(urlPath: string, appName: string = "General"): Promise<GetResult<T>> {
        return this.userManager.authenticateAndGetUserAsync().then(o => {
            return fetch(this.createUri(urlPath),
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${o.accessToken}`,
                        "X-LGAppName": appName
                    }

                })
                .then(response => {
                    return response.json()
                        .then(json => {
                            if (json.error) {
                                return Promise.reject(json.error.message);
                            }

                            return Promise.resolve(new GetResult<T>(json));
                        },
                        error => {
                            return Promise.reject(`The server sent back invalid JSON. ${error}`);
                        });
                }, error => {
                    if (error.message != null && error.message.indexOf("Failed to fetch") !== -1)
                        return Promise.reject("Network error. Check your connection and try again.");

                    return Promise.reject(error);
                });
        });
    }
}
LssApiService.register();