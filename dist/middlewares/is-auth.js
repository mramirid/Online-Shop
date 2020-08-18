"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isAuth = (req, res, next) => {
    var _a;
    if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.isAuthenticated)) {
        return res.redirect('/login');
    }
    next();
};
exports.default = isAuth;
//# sourceMappingURL=is-auth.js.map