declare class LssApiService extends Polymer.Element {
    isDev: boolean;
    baseUrl: string;
    isLoading: boolean;
    baseProductionUri: string;
    baseDevUri: string;
    appNameKey: string;
    appName: string;
    lssUserManager: LssUserManager;
    _environmentHandler(isDev: boolean): void;
    private _createUri;
    private _getTokenAsync;
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
    static convertODataInfo<T>(item: any): T;
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
