"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postNewPassword = exports.getNewPassword = exports.postReset = exports.getReset = exports.postLogout = exports.postLogin = exports.getLogin = exports.postSignup = exports.getSignup = void 0;
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const nodemailer_mailgun_transport_1 = __importDefault(require("nodemailer-mailgun-transport"));
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
const nodemailerMailgun = nodemailer_1.default.createTransport(nodemailer_mailgun_transport_1.default({
    auth: {
        api_key: process.env.MAILGUN_KEY,
        domain: process.env.MAILGUN_DOMAIN
    }
}));
exports.getSignup = (req, res) => {
    let [message] = req.flash('error');
    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/signup',
        errorMessage: message,
        inputErrors: [],
        oldInput: { email: '', password: '', confirmPassword: '' }
    });
};
exports.postSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const inputErrors = express_validator_1.validationResult(req);
    const [firstInputError] = inputErrors.array();
    if (!inputErrors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            pageTitle: 'Signup',
            path: '/signup',
            errorMessage: firstInputError.msg,
            inputErrors: inputErrors.array(),
            oldInput: { email, password, confirmPassword }
        });
    }
    try {
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        const newUser = new User_1.default({
            email,
            password: hashedPassword,
            cart: { items: [] }
        });
        yield newUser.save();
        res.redirect('/login');
        nodemailerMailgun.sendMail({
            from: process.env.MAILGUN_SENDER,
            to: newUser.email,
            subject: 'Signup Success',
            html: '<h1>You successfully signed up</h1>'
        }).then(infoSended => {
            console.log('Reg email sended:', infoSended);
        }, infoRejected => {
            console.log('Reg email: rejected:', infoRejected);
        }).catch(error => {
            console.log('Cannot send reg email', error);
        });
    }
    catch (error) {
        const operationError = new Error(error);
        operationError.httpStatusCode = 500;
        next(operationError);
    }
});
exports.getLogin = (req, res) => {
    let [message] = req.flash('error');
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: message,
        inputErrors: [],
        oldInput: { email: '', password: '' }
    });
};
exports.postLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    const inputErrors = express_validator_1.validationResult(req);
    const [firstInputError] = inputErrors.array();
    if (!inputErrors.isEmpty()) {
        return res.status(422).render('auth/login', {
            pageTitle: 'Login',
            path: '/login',
            errorMessage: firstInputError.msg,
            inputErrors: inputErrors.array(),
            oldInput: { email, password }
        });
    }
    try {
        let inputErrors = [];
        const user = yield User_1.default.findOne({ email });
        if (!user)
            inputErrors.push({ param: 'email' });
        const doMatch = yield bcryptjs_1.default.compare(password, (user === null || user === void 0 ? void 0 : user.password) || '');
        if (!doMatch)
            inputErrors.push({ param: 'password' });
        if (!user || !doMatch) {
            return res.status(422).render('auth/login', {
                pageTitle: 'Login',
                path: '/login',
                errorMessage: 'Invalid email or password',
                inputErrors,
                oldInput: { email, password }
            });
        }
        req.session.user = user;
        req.session.isAuthenticated = true;
        req.session.save(error => {
            if (error)
                throw 'Failed to create session in the database';
            res.redirect('/');
        });
    }
    catch (error) {
        const operationError = new Error(error);
        operationError.httpStatusCode = 500;
        next(operationError);
    }
});
exports.postLogout = (req, res) => {
    req.session.destroy(error => {
        if (error)
            console.log(error);
        res.redirect('/');
    });
};
exports.getReset = (req, res) => {
    let [message] = req.flash('error');
    res.render('auth/reset', {
        pageTitle: 'Reset Password',
        path: '/reset',
        errorMessage: message
    });
};
exports.postReset = (req, res, next) => {
    crypto_1.default.randomBytes(32, (error, buffer) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            console.log(error);
            return res.redirect('/reset');
        }
        try {
            const token = buffer.toString('hex');
            const user = yield User_1.default.findOne({ email: req.body.email });
            if (!user) {
                req.flash('error', 'No account with that email found');
                return res.redirect('/reset');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            yield user.save();
            res.redirect('/');
            nodemailerMailgun.sendMail({
                from: process.env.MAILGUN_SENDER,
                to: user.email,
                subject: 'Password reset',
                html: `
          <p>You requested a password reset</p>
          <p>Click this <a href="http://localhost:3000/new-password/${token}">link</a> to set a new password</p>
        `
            }).then(infoSended => {
                console.log('Reset pass email sended:', infoSended);
            }, infoRejected => {
                console.log('Reset pass email rejected:', infoRejected);
            }).catch(error => {
                console.log('Cannot send reset pass email', error);
            });
        }
        catch (error) {
            const operationError = new Error(error);
            operationError.httpStatusCode = 500;
            next(operationError);
        }
    }));
};
exports.getNewPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.token;
        const user = yield User_1.default.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() }
        });
        let [message] = req.flash('error');
        res.render('auth/new-password', {
            pageTitle: 'New Password',
            path: '/new-password',
            errorMessage: message,
            userId: user === null || user === void 0 ? void 0 : user._id.toString(),
            passwordToken: token
        });
    }
    catch (error) {
        const operationError = new Error(error);
        operationError.httpStatusCode = 500;
        next(operationError);
    }
});
exports.postNewPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPassword = req.body.password;
        const userId = req.body.userId;
        const passwordToken = req.body.passwordToken;
        const user = yield User_1.default.findOne({
            _id: userId,
            resetToken: passwordToken,
            resetTokenExpiration: { $gt: Date.now() }
        });
        user.password = yield bcryptjs_1.default.hash(newPassword, 12);
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        yield user.save();
        res.redirect('/login');
    }
    catch (error) {
        const operationError = new Error(error);
        operationError.httpStatusCode = 500;
        next(operationError);
    }
});
//# sourceMappingURL=auth.js.map