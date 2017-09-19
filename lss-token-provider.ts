
@customElement('lss-token-provider')
class LssTokenProvider extends TitaniumRequesterMixin(Polymer.Element) implements ITokenProvider {
    async getTokenAsync(): Promise<string | null> {
        let userManager = await this.requestInstance('UserManager');
        let user = await userManager.authenticateAndGetUserAsync();
        if (user === null) {
            throw new Error('Redirect failed. Not authenticated.');
        }
        return user.accessToken;
    }
}