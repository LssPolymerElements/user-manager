interface ITokenProvider {
    getTokenAsync(): Promise<string | null>;
}