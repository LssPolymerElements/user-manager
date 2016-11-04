@component("lg-environment")
class LssLgEnvironment extends polymer.Base {

    isDev(): boolean {

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
LssLgEnvironment.register();