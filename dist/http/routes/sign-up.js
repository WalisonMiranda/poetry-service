"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUp = void 0;
const zod_1 = require("zod");
const jsonwebtoken_1 = require("jsonwebtoken");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../../lib/prisma");
async function signUp(app) {
    app.post("/user/signup", async (req, reply) => {
        const createUserBody = zod_1.z.object({
            name: zod_1.z.string(),
            email: zod_1.z.string(),
            password: zod_1.z.string(),
        });
        const { name, email, password } = createUserBody.parse(req.body);
        const hasUser = await prisma_1.prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (hasUser) {
            return reply.status(400).send({ message: "email already registered" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await prisma_1.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        const token = (0, jsonwebtoken_1.sign)({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        // reply.setCookie("token", token, {
        //   httpOnly: true,
        //   secure: process.env.NODE_ENV === "production",
        //   maxAge: 3600,
        // });
        reply.send({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token,
            message: "User registered successfully",
        });
    });
}
exports.signUp = signUp;
//# sourceMappingURL=sign-up.js.map