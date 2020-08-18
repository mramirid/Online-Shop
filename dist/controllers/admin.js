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
exports.deleteProduct = exports.postEditProduct = exports.getEditProduct = exports.postAddProduct = exports.getAddProduct = exports.getProducts = void 0;
const express_validator_1 = require("express-validator");
const Product_1 = __importDefault(require("../models/Product"));
const fileHelper = __importStar(require("../utils/file"));
const ITEMS_PER_PAGE = 3;
exports.getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = req.query.page ? +req.query.page : 1;
        const [totalProducts, products] = yield Promise.all([
            Product_1.default.find().countDocuments(),
            Product_1.default.find({ userId: req.user._id })
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
        ]);
        res.render('admin/product-list', {
            pageTitle: 'Admin Products',
            path: '/admin/products',
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
exports.getAddProduct = (_, res) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        isEdit: false,
        hasError: false,
        errorMessage: null,
        inputErrors: [],
    });
};
exports.postAddProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.body.title;
    const price = +req.body.price;
    const image = req.file;
    const description = req.body.description;
    const userId = req.user._id;
    if (!image) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            isEdit: false,
            hasError: true,
            errorMessage: 'Attached file is not an image',
            inputErrors: [],
            product: { title, price, description }
        });
    }
    const imageUrl = image.filename;
    const inputErrors = express_validator_1.validationResult(req);
    const [firstInputError] = inputErrors.array();
    if (!inputErrors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            isEdit: false,
            hasError: true,
            errorMessage: firstInputError.msg,
            inputErrors: inputErrors.array(),
            product: { title, price, imageUrl, description }
        });
    }
    try {
        const product = new Product_1.default({ title, price, imageUrl, description, userId });
        yield product.save();
        console.log('Product created successfully');
        res.redirect('/admin/products');
    }
    catch (error) {
        const operationError = new Error(error);
        operationError.httpStatusCode = 500;
        next(operationError);
    }
});
exports.getEditProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const editMode = req.query.edit;
    if (!editMode)
        return res.redirect('/');
    try {
        const product = yield Product_1.default.findById(req.params.productId);
        if (!product)
            return res.redirect('/');
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            isEdit: true,
            hasError: false,
            errorMessage: null,
            inputErrors: [],
            product
        });
    }
    catch (error) {
        const operationError = new Error(error);
        operationError.httpStatusCode = 500;
        next(operationError);
    }
});
exports.postEditProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const inputErrors = express_validator_1.validationResult(req);
    const [firstInputError] = inputErrors.array();
    if (!inputErrors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            isEdit: true,
            hasError: true,
            errorMessage: firstInputError.msg,
            inputErrors: inputErrors.array(),
            product: {
                _id: req.body.productId,
                title: req.body.title,
                price: +req.body.price,
                description: req.body.description
            }
        });
    }
    try {
        const image = req.file;
        const product = yield Product_1.default.findById(req.body.productId);
        if (!product)
            throw 'No product found';
        if (product.userId.toString() !== req.user._id.toString()) {
            return res.redirect('/');
        }
        product.title = req.body.title;
        product.price = req.body.price;
        product.description = req.body.description;
        if (image) {
            yield fileHelper.deleteImage(product.imageUrl);
            product.imageUrl = image.filename;
        }
        yield product.save();
        console.log('Product updated successfully');
        res.redirect('/admin/products');
    }
    catch (error) {
        const operationError = new Error(error);
        operationError.httpStatusCode = 500;
        next(operationError);
    }
});
exports.deleteProduct = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.productId;
        const product = yield Product_1.default.findById(productId);
        if (!product)
            throw new Error('No product found');
        yield Promise.all([
            fileHelper.deleteImage(product.imageUrl),
            Product_1.default.deleteOne({ _id: productId, userId: req.user._id })
        ]);
        console.log('Product deleted successfully');
        res.status(200).json({ message: 'Deleting product success' });
    }
    catch (error) {
        res.status(500).json({ message: 'Deleting product failed' });
    }
});
//# sourceMappingURL=admin.js.map