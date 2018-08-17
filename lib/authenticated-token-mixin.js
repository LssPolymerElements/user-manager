export const authenticatedTokenMixin = (superClass) => class extends superClass {
    _getAccessTokenAsync() {
        return new Promise((resolve, reject) => {
            let handleUpdate = function listener(e) {
                window.removeEventListener('um-token', handleUpdate);
                if (e.detail.rejected) {
                    reject(e.detail.message);
                }
                resolve(e.detail.accessToken);
            };
            window.addEventListener('um-token', handleUpdate);
            window.dispatchEvent(new CustomEvent('um-request-token'));
        });
    }
};
//# sourceMappingURL=authenticated-token-mixin.js.map