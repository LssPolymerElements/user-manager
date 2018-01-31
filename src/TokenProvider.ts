interface TokenProvider {
  getTokenAsync(): Promise<string|null>;
}