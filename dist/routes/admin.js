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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const adminController = __importStar(require("../controllers/admin"));
const is_auth_1 = __importDefault(require("../middlewares/is-auth"));
const router = express_1.default.Router();
router.get('/products', is_auth_1.default, adminController.getProducts);
router.get('/add-product', is_auth_1.default, adminController.getAddProduct);
router.post('/add-product', [
    express_validator_1.body('title')
        .trim()
        .isString()
        .isLength({ min: 3, max: 50 }),
    express_validator_1.body('price')
        .trim()
        .isFloat(),
    express_validator_1.body('description')
        .trim()
        .isLength({ min: 5, max: 400 })
], is_auth_1.default, adminController.postAddProduct);
router.get('/edit-product/:productId', is_auth_1.default, adminController.getEditProduct);
router.post('/edit-product', [
    express_validator_1.body('title')
        .trim()
        .isString()
        .isLength({ min: 3, max: 50 }),
    express_validator_1.body('price')
        .trim()
        .isFloat(),
    express_validator_1.body('description')
        .trim()
        .isLength({ min: 5, max: 400 })
], is_auth_1.default, adminController.postEditProduct);
router.delete('/product/:productId', is_auth_1.default, adminController.deleteProduct);
exports.default = router;
//# sourceMappingURL=admin.js.map