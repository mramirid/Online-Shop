"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const path_2 = __importDefault(require("./path"));
exports.deleteImage = (imageName) => {
    return new Promise((resolve, reject) => {
        const imagePath = path_1.default.join(path_2.default, 'data', 'images', imageName);
        fs_1.default.unlink(imagePath, error => {
            if (error)
                reject(`File deletion failed: ${error.message}`);
            resolve('File deletion succeeded');
        });
    });
};
//# sourceMappingURL=file.js.map