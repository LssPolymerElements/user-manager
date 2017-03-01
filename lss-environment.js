var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LssEnvironment = (function (_super) {
    __extends(LssEnvironment, _super);
    function LssEnvironment() {
        return _super.apply(this, arguments) || this;
    }
    LssEnvironment.prototype.reevaluate = function () {
        this.set("isDev", this.isDevelopmentHandler());
    };
    LssEnvironment.prototype.isDevelopmentHandler = function () {
        if (document == null || document.location == null || document.location.host == null)
            return true;
        var host = document.location.host;
        if (host.indexOf("dev") !== -1)
            return true;
        if (host.indexOf("localhost") !== -1)
            return true;
        return false;
    };
    return LssEnvironment;
}(polymer.Base));
__decorate([
    property({
        value: function () {
            if (document == null || document.location == null || document.location.host == null)
                return true;
            var host = document.location.host;
            if (host.indexOf("dev") !== -1)
                return true;
            if (host.indexOf("localhost") !== -1)
                return true;
            return false;
        },
        type: Boolean,
        notify: true
    })
], LssEnvironment.prototype, "isDev", void 0);
LssEnvironment = __decorate([
    component("lss-environment")
], LssEnvironment);
LssEnvironment.register();
//# sourceMappingURL=lss-environment.js.map