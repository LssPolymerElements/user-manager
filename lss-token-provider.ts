@behavior(LssRequesterBehavior)
@component("lss-token-provider")
class LssTokenProvider extends polymer.Base implements ITokenProvider {
    requestInstance: (key: string) => any;
    @property({
        type: LssUserManager,
        notify: true
    })
    userManager: LssUserManager;

    async getTokenAsync(): Promise<string> {
        var user = await this.userManager.authenticateAndGetUserAsync();
        if (user === null) {
            throw new Error("Redirect failed. Not authenticated.");
        }
        return user.accessToken;
    }

    attached() {
        try {
            this.userManager = this.requestInstance("UserManager");
        } catch (error) {
            console.log(error);
        }
    }
}
LssTokenProvider.register();