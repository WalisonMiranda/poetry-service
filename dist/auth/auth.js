"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = exports.hash = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const hash = async (password) => {
    const saltRounds = 10;
    const hash = await bcrypt_1.default.hash(password, saltRounds);
    return hash;
};
exports.hash = hash;
const compare = async (password, hash) => {
    const match = await bcrypt_1.default.compare(password, hash);
    return match;
};
exports.compare = compare;
//# sourceMappingURL=auth.js.map