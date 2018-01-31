"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let LssEnvironment = class LssEnvironment extends Polymer.Element {
    constructor() {
        super();
        this.isDev = false;
        this.isDev = this.isDevelopment();
    }
    isDevelopment() {
        if (document == null || document.location == null || document.location.host == null)
            return true;
        const host = document.location.host;
        if (host.indexOf('dev') !== -1)
            return true;
        if (host.indexOf('localhost') !== -1)
            return true;
        return false;
    }
};
__decorate([
    Polymer.decorators.property({ notify: true, type: Boolean })
], LssEnvironment.prototype, "isDev", void 0);
LssEnvironment = __decorate([
    Polymer.decorators.customElement('lss-environment')
], LssEnvironment);
//# sourceMappingURL=lss-environment.js.map