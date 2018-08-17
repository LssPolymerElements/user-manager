var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const authenticatedPersonMixin = (superClass) => class extends superClass {
    ready() {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            _super("ready").call(this);
            window.addEventListener('um-person-updated', (e) => {
                this.setProperties({ personId: e.detail.personId, fullname: e.detail.fullname, firstName: e.detail.firstName, lastName: e.detail.lastName });
            });
            try {
                let person = yield this._getPersonAsync();
                this.setProperties({ personId: person.personId, fullname: person.fullname, firstName: person.firstName, lastName: person.lastName });
            }
            catch (e) {
            }
        });
    }
    _getPersonAsync() {
        return new Promise((resolve, reject) => {
            const handleUpdate = function listener(e) {
                window.removeEventListener('um-person', handleUpdate);
                if (e.detail.rejected) {
                    reject(e.detail.message);
                }
                resolve(e.detail);
            };
            window.addEventListener('um-person', handleUpdate);
            window.dispatchEvent(new CustomEvent('um-request-person'));
        });
    }
    static get properties() {
        return { personId: { type: Number, notify: true, value: 0 }, fullname: { type: String, notify: true }, firstName: { type: String, notify: true }, lastName: { type: String, notify: true } };
    }
};
//# sourceMappingURL=authenticated-person-mixin.js.map