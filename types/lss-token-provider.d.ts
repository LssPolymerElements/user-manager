/// <reference path="TokenProvider.d.ts" />
declare const LssTokenProvider_base: (new (...args: any[]) => {
    dispatchEvent: any;
    requestProvider(key: string): Promise<any>;
    requestInstance(key: string): Promise<any>;
    value(key: string): () => Promise<any>;
}) & typeof Polymer.Element;
declare class LssTokenProvider extends LssTokenProvider_base implements TokenProvider {
    getTokenAsync(): Promise<string | null>;
}
