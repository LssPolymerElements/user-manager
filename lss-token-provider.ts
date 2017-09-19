
@customElement('lss-token-provider')
class LssTokenProvider extends TitaniumRequesterMixin(Polymer.Element) implements ITokenProvider {
    @property({ notify: true })
    userManager: LssUserManager;

    async getTokenAsync(): Promise<string | null> {
        this.userManager = await this.requestInstance('UserManager');
        let user = await this.userManager.authenticateAndGetUserAsync();
        if (user === null) {
            throw new Error('Redirect failed. Not authenticated.');
        }
        return user.accessToken;
    }
}