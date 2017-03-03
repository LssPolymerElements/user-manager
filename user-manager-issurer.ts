/**
 * userManagerIssuer
 */
class userManagerIssuer {
    constructor(issuer: string, tokenUri: string) {
        this.Issurer = issuer;
        this.TokenUri = tokenUri;
    }
    Issurer: string;
    TokenUri: string;
}