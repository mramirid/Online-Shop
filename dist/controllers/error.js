"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverErrorHandler = exports.get404 = void 0;
exports.get404 = (_, res) => {
    res.status(404).render('404', {
        pageTitle: 'Page Not Found',
        path: '/404'
    });
};
exports.serverErrorHandler = (err, _, res, __) => {
    console.log(err.httpStatusCode, err.message);
    res.status(500).render('500', {
        pageTitle: 'Internal Server Error',
        path: '/500'
    });
};
//# sourceMappingURL=error.js.map