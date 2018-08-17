var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const authenticatedRolesMixin = (superClass) => class extends superClass {
    ready() {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            _super("ready").call(this);
            window.addEventListener('um-role-added', (e) => {
                this.push('roles', e.detail.role);
            });
            window.addEventListener('um-role-removed', (e) => {
                const index = this.roles.indexOf(e.detail.role);
                if (index !== -1) {
                    this.splice('roles', index, 1);
                }
            });
            try {
                this.roles = yield this._getRolesAsync();
            }
            catch (e) {
            }
        });
    }
    _getRolesAsync() {
        return new Promise((resolve, reject) => {
            const handleUpdate = function listener(e) {
                window.removeEventListener('um-roles', handleUpdate);
                if (e.detail.rejected) {
                    reject(e.detail.message);
                }
                resolve(e.detail.roles);
            };
            window.addEventListener('um-roles', handleUpdate);
            window.dispatchEvent(new CustomEvent('um-request-roles'));
        });
    }
    static get properties() {
        return { roles: { type: Array, notify: true, value: [] } };
    }
};
//# sourceMappingURL=authenticated-roles-mixin.js.map