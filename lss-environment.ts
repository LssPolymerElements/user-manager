@component("lss-environment")
class LssEnvironment extends polymer.Base {

    @property({
        value: () => {
            if (document == null || document.location == null || document.location.host == null)
                return true;

            const host = document.location.host;
            if (host.indexOf("dev") !== -1)
                return true;

            if (host.indexOf("localhost") !== -1)
                return true;

            return false;
        },
        type: Boolean,
        notify: true
    })
    isDev: Boolean

    reevaluate() {
        this.set("isDev", this.isDevelopmentHanlder());
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
LssEnvironment.register();
