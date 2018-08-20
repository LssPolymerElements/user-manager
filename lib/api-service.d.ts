import { PolymerElement } from '@polymer/polymer/polymer-element';
declare const ApiService_base: typeof PolymerElement & import("@leavittsoftware/user-manager/lib/authenticated-token-mixin").AuthenticatedTokenMixinConstructor;
export declare class ApiService extends ApiService_base {
    isDev: boolean;
    baseUrl: string;
    isLoading: boolean;
    baseProductionUri: string;
    baseDevUri: string;
    appNameKey: string;
    appName: string;
    _environmentHandler(isDev: boolean): void;
    constructor();
    private _createUri;
    private _getTokenAsync;
    postAsync<T>(urlPath: string, body: any & ODataDto, appName?: string | null): Promise<T | null>;
    patchAsync(urlPath: string, body: any & ODataDto, appName?: string | null): Promise<void>;
    patchReturnDtoAsync<T>(urlPath: string, body: any & ODataDto, appName?: string | null): Promise<T>;
    deleteAsync(urlPath: string, appName?: string | null): Promise<void>;
    getAsync<T extends ODataDto>(urlPath: string, appName?: string | null): Promise<GetResult<T>>;
}
export declare class GetResult<T extends ODataDto> {
    private data;
    odataCount: number;
    constructor(json: any);
    count(): number;
    firstOrDefault(): T | null;
    toList(): Array<T>;
    static convertODataInfo<T>(item: any): T;
}
export interface ODataDto {
    _odataInfo: ODataModelInfo;
}
export declare class ODataDto implements ODataDto {
    constructor(modelInfo?: ODataModelInfo);
    _odataInfo: ODataModelInfo;
}
export interface ODataModelInfo {
    type: string | null;
    shortType: string | null;
}
export declare class ODataModelInfo implements ODataModelInfo {
    type: string | null;
    shortType: string | null;
}
export {};
