/// <reference path="lss-environment.d.ts" />
/// <reference path="TokenProvider.d.ts" />
declare const observe: typeof Polymer.decorators.observe, listen: (eventName: string, target: string | EventTarget) => (proto: any, methodName: string) => void;
declare const LssApiService_base: (new (...args: any[]) => {
    dispatchEvent: any;
    requestProvider(key: string): Promise<any>;
    requestInstance(key: string): Promise<any>;
    value(key: string): () => Promise<any>;
}) & typeof Polymer.Element;
declare class LssApiService extends LssApiService_base {
    tokenProvider: TokenProvider;
    lssEnvironment: LssEnvironment;
    isDev: boolean;
    baseUrl: string;
    isLoading: boolean;
    baseProductionUri: string;
    baseDevUri: string;
    appNameKey: string;
    appName: string;
    connectedCallback(): Promise<void>;
    ready(): void;
    _environmentHandler(isDev: boolean): void;
    private _createUri(urlPath);
    postAsync<T>(urlPath: string, body: any & ODataDto, appName?: string | null): Promise<T | null>;
    patchAsync(urlPath: string, body: any & ODataDto, appName?: string | null): Promise<void>;
    patchReturnDtoAsync<T>(urlPath: string, body: any & ODataDto, appName?: string | null): Promise<T>;
    deleteAsync(urlPath: string, appName?: string | null): Promise<void>;
    getAsync<T extends ODataDto>(urlPath: string, appName?: string | null): Promise<GetResult<T>>;
}
declare class GetResult<T extends ODataDto> {
    private data;
    odataCount: number;
    constructor(json: any);
    count(): number;
    firstOrDefault(): T | null;
    toList(): Array<T>;
    private convertODataInfo(item);
}
interface ODataDto {
    _odataInfo: ODataModelInfo;
}
declare class ODataDto implements ODataDto {
    constructor(modelInfo?: ODataModelInfo);
    _odataInfo: ODataModelInfo;
}
interface ODataModelInfo {
    type: string | null;
    shortType: string | null;
}
declare class ODataModelInfo implements ODataModelInfo {
    type: string | null;
    shortType: string | null;
}
