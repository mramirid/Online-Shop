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
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const multer_1 = __importDefault(require("multer"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const csurf_1 = __importDefault(require("csurf"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const uuid_1 = require("uuid");
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const path_2 = __importDefault(require("./utils/path"));
const admin_1 = __importDefault(require("./routes/admin"));
const shop_1 = __importDefault(require("./routes/shop"));
const auth_1 = __importDefault(require("./routes/auth"));
const errorController = __importStar(require("./controllers/error"));
const User_1 = __importDefault(require("./models/User"));
const cluster = process.env.CLUSTER_NAME;
const dbname = process.env.DB_NAME;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const MONGODB_URL = `mongodb+srv://${username}:${password}@${cluster}.dxksd.mongodb.net/${dbname}?retryWrites=true&w=majority`;
const MongoDBStore = connect_mongodb_session_1.default(express_session_1.default);
const mongoDBStore = new MongoDBStore({
    uri: MONGODB_URL,
    collection: 'sessions'
});
const app = express_1.default();
app.set('view engine', 'ejs');
app.set('views', 'dist/views');
app.use(express_1.default.static(path_1.default.join(path_2.default, 'public')));
app.use(express_1.default.static(path_1.default.join(path_2.default, 'data', 'images')));
app.use(helmet_1.default());
app.use(compression_1.default());
app.use(morgan_1.default('combined', {
    stream: fs_1.default.createWriteStream(path_1.default.join(path_2.default, '..', 'access.log'), { flags: 'a' })
}));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(multer_1.default({
    storage: multer_1.default.diskStorage({
        destination: (_, __, callback) => {
            callback(null, 'dist/data/images');
        },
        filename: (_, file, callback) => {
            callback(null, `${uuid_1.v4()}-${file.originalname}`);
        }
    }),
    fileFilter: (_, file, callback) => {
        if (file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg') {
            callback(null, true);
        }
        else {
            callback(null, false);
        }
    }
}).single('image'));
app.use(express_session_1.default({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoDBStore
}));
app.use(csurf_1.default());
app.use(connect_flash_1.default());
app.use((req, res, next) => {
    var _a;
    res.locals.isAuthenticated = (_a = req.session) === null || _a === void 0 ? void 0 : _a.isAuthenticated;
    res.locals.csrfToken = req.csrfToken();
    next();
});
app.use((req, _, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.user))
        return next();
    try {
        const user = yield User_1.default.findById(req.session.user._id);
        if (!user)
            throw 'User not found in the database';
        req.user = user;
    }
    catch (error) {
        const operationError = new Error(error);
        operationError.httpStatusCode = 500;
        return next(operationError);
    }
    next();
}));
app.use('/admin', admin_1.default);
app.use(shop_1.default);
app.use(auth_1.default);
app.use(errorController.get404);
app.use(errorController.serverErrorHandler);
mongoose_1.default.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(_ => {
    app.listen(process.env.PORT || 3000);
}).catch(error => {
    console.log('MongoDB connection failed:', error);
});
//# sourceMappingURL=app.js.map