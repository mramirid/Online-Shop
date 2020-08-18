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
exports.getInvoice = exports.getOrders = exports.getCheckoutSuccess = exports.getCheckout = exports.postCartDeleteProduct = exports.postCart = exports.getCart = exports.getProduct = exports.getProducts = exports.getIndex = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const stripe_1 = __importDefault(require("stripe"));
const Product_1 = __importDefault(require("../models/Product"));
const Order_1 = __importDefault(require("../models/Order"));
const path_2 = __importDefault(require("../utils/path"));
const ITEMS_PER_PAGE = 3;
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-03-02' });
exports.getIndex = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = req.query.page ? +req.query.page : 1;
        const [totalProducts, products] = yield Promise.all([
            Product_1.default.find().countDocuments(),
            Product_1.default.find().skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE)
        ]);
        res.render('shop/index', {
            pageTitle: 'Shop',
            path: '/',
            products,
            hasNextPage: ITEMS_PER_PAGE * page < totalProducts,
            hasPrevPage: page > 1,
            nextPage: page + 1,
            prevPage: page - 1,
            curPage: page,
            lastPage: Math.ceil(totalProducts / ITEMS_PER_PAGE)
        });
    }
    catch (error) {
        const operationError = new Error(error);
        operationError.httpStatusCode = 500;
        next(operationError);
    }
});
exports.getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = req.query.page ? +req.query.page : 1;
        const [totalProducts, products] = yield Promise.all([
            Product_1.default.find().countDocuments(),
            Product_1.default.find().skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE)
        ]);
        res.render('shop/product-list', {
            pageTitle: 'Products',
            path: '/products',
            products,
            hasNextPage: ITEMS_PER_PAGE * page < totalProducts,
            hasPrevPage: page > 1,
            nextPage: page + 1,
            prevPage: page - 1,
            curPage: page,
            lastPage: Math.ceil(totalProducts / ITEMS_PER_PAGE)
        });
    }
    catch (error) {
        const operationError = new Error(error);
        operationError.httpStatusCode = 500;
        next(operationError);
    }
});
exports.getProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    try {
        const product = yield Product_1.default.findById(productId);
        res.render('shop/product-detail', {
            pageTitle: product.title,
            path: '/products',
            product
        });
    }
    catch (error) {
        const operationError = new Error(error);
        operationError.httpStatusCode = 500;
        next(operationError);
    }
});
exports.getCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userAndCart = yield req.user.populate('cart.items.productId').execPopulate();
        const cartProducts = userAndCart.cart.items;
        res.render('shop/cart', {
            pageTitle: 'Your Cart',
            path: '/cart',
            products: cartProducts
        });
    }
    catch (error) {
        const operationError = new Error(error);
        operationError.httpStatusCode = 500;
        next(operationError);
    }
});
exports.postCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.body.productId;
        const product = yield Product_1.default.findById(productId);
        yield req.user.addToCart(product);
        res.redirect('/cart');
    }
    catch (error) {
        const operationError = new Error(error);
        operationError.httpStatusCode = 500;
        next(operationError);
    }
});
exports.postCartDeleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.body.productId;
        yield req.user.removeFromCart(productId);
        res.redirect('/cart');
    }
    catch (error) {
        const operationError = new Error(error);
        operationError.httpStatusCode = 500;
        next(operationError);
    }
});
exports.getCheckout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userAndCart = yield req.user.populate('cart.items.productId').execPopulate();
        const cartProducts = userAndCart.cart.items;
        const totalPrice = cartProducts.reduce((total, cartProduct) => {
            return total + (cartProduct.quantity * cartProduct.productId.price);
        }, 0);
        const stripeSession = yield stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: cartProducts.map(cartProduct => {
                return {
                    name: cartProduct.productId.title,
                    description: cartProduct.productId.description,
                    amount: cartProduct.productId.price * 100,
                    currency: 'usd',
                    quantity: cartProduct.quantity
                };
            }),
            success_url: `${req.protocol}://${req.get('host')}/checkout/success`,
            cancel_url: `${req.protocol}://${req.get('host')}/checkout/cancel`
        });
        res.render('shop/checkout', {
            pageTitle: 'Checkout',
            path: '/checkout',
            products: cartProducts,
            totalPrice,
            stripeSessionId: stripeSession.id
        });
    }
    catch (error) {
        const operationError = new Error(error);
        operationError.httpStatusCode = 500;
        next(operationError);
    }
});
exports.getCheckoutSuccess = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userAndCart = yield req.user.populate('cart.items.productId').execPopulate();
        const cartProducts = userAndCart.cart.items.map(cartProduct => {
            return {
                quantity: cartProduct.quantity,
                product: cartProduct.productId.toObject()
            };
        });
        const order = new Order_1.default({
            user: {
                email: req.user.email,
                userId: req.user._id
            },
            products: cartProducts
        });
        yield Promise.all([order.save(), req.user.clearCart()]);
        res.redirect('/orders');
    }
    catch (error) {
        const operationError = new Error(error);
        operationError.httpStatusCode = 500;
        next(operationError);
    }
});
exports.getOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield Order_1.default.find({ 'user.userId': req.user._id });
        res.render('shop/orders', {
            pageTitle: 'Your Orders',
            path: '/orders',
            orders
        });
    }
    catch (error) {
        const operationError = new Error(error);
        operationError.httpStatusCode = 500;
        next(operationError);
    }
});
exports.getInvoice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.orderId;
    let order;
    try {
        order = yield Order_1.default.findById(orderId);
        if (!order)
            throw { statusCode: 404, message: 'No order found' };
        if (order.user.userId.toString() !== req.user._id.toString()) {
            throw { statusCode: 401, message: 'Unauthorized' };
        }
    }
    catch (error) {
        const operationError = new Error(error.message);
        operationError.httpStatusCode = error.statusCode;
        return next(operationError);
    }
    const invoiceName = `invoice-${orderId}.pdf`;
    const invoicePath = path_1.default.join(path_2.default, 'data', 'invoices', invoiceName);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=${invoiceName}`);
    const pdfDoc = new pdfkit_1.default();
    pdfDoc.pipe(fs_1.default.createWriteStream(invoicePath));
    pdfDoc.pipe(res);
    pdfDoc.fontSize(26).text('Invoice', { underline: true });
    pdfDoc.text('------------------------------------------------------');
    let totalPrice = 0;
    order.products.forEach(orderProduct => {
        pdfDoc.fontSize(16).text(`${orderProduct.product.title}, price: (${orderProduct.quantity} x $${orderProduct.product.price})`);
        totalPrice += (orderProduct.quantity * orderProduct.product.price);
    });
    pdfDoc.fontSize(26).text('------------------------------------------------------');
    pdfDoc.fontSize(18).text(`Total price: $${totalPrice}`);
    pdfDoc.end();
    const file = fs_1.default.createReadStream(invoicePath);
    file.pipe(res);
});
//# sourceMappingURL=shop.js.map