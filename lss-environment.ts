@customElement("lss-environment")
class LssEnvironment extends Polymer.Element {

    @property({ notify: true })
    isDev = () => {
        if (document == null || document.location == null || document.location.host == null)
            return true;

        const host = document.location.host;
        if (host.indexOf("dev") !== -1)
            return true;

        if (host.indexOf("localhost") !== -1)
            return true;

        return false;
    };

    reevaluate() {
        this.set("isDev", this.isDevelopmentHandler());
    }

    isDevelopmentHandler(): Boolean {
        if (document == null || document.location == null || document.location.host == null)
            return true;

        const host = document.location.host;
        if (host.indexOf("dev") !== -1)
            return true;

        if (host.indexOf("localhost") !== -1)
            return true;

        return false;
    }
}