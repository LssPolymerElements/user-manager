interface ITokenProvider {
    getTokenAsync(): Promise<string>
}