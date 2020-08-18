"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
const authController = __importStar(require("../controllers/auth"));
const router = express_1.default.Router();
router.get('/signup', authController.getSignup);
router.post('/signup', [
    express_validator_1.check('email')
        .trim()
        .isEmail()
        .withMessage('Enter a valid email')
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield User_1.default.findOne({ email: value });
        if (user)
            throw new Error('The email is already used');
    })),
    express_validator_1.body('password', 'Enter password with only number or text & at least 5 characters')
        .isLength({ min: 5, max: 30 })
        .isAlphanumeric(),
    express_validator_1.body('confirmPassword')
        .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password have to match!');
        }
        return true;
    })
], authController.postSignup);
router.get('/login', authController.getLogin);
router.post('/login', [
    express_validator_1.body('email')
        .trim()
        .isEmail()
        .withMessage('Enter a valid email'),
    express_validator_1.body('password', 'Enter your password with only number or text & at least 5 characters')
        .isLength({ min: 5, max: 30 })
        .isAlphanumeric()
], authController.postLogin);
router.post('/logout', authController.postLogout);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/new-password/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);
exports.default = router;
//# sourceMappingURL=auth.js.map