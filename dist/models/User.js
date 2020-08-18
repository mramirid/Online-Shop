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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExpiration: Date,
    cart: {
        items: [
            {
                productId: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ]
    }
});
userSchema.methods.addToCart = function (product) {
    const cartProductIndex = this.cart.items.findIndex(cartProduct => {
        return cartProduct.productId.toString() === product._id.toString();
    });
    if (cartProductIndex >= 0) {
        this.cart.items[cartProductIndex].quantity += 1;
    }
    else {
        this.cart.items.push({ productId: product._id, quantity: 1 });
    }
    return this.save();
};
userSchema.methods.removeFromCart = function (productId) {
    this.cart.items = this.cart.items.filter(cartProduct => {
        return cartProduct.productId.toString() !== productId;
    });
    return this.save();
};
userSchema.methods.clearCart = function () {
    this.cart = { items: [] };
    return this.save();
};
exports.default = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=User.js.map