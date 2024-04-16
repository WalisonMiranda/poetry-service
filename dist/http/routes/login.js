"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const zod_1 = require("zod");
const jsonwebtoken_1 = require("jsonwebtoken");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../../lib/prisma");
async function login(app) {
    app.post("/user/login", async (req, reply) => {
        const createUserBody = zod_1.z.object({
            email: zod_1.z.string(),
            password: zod_1.z.string(),
        });
        try {
            const { email, password } = createUserBody.parse(req.body);
            const user = await prisma_1.prisma.user.findUnique({
                where: {
                    email: email,
                },
            });
            if (!user) {
                return reply.status(404).send({ message: "Usuário não encontrado." });
            }
            const mathPassword = await bcrypt_1.default.compare(password, user.password);
            if (mathPassword) {
                const token = (0, jsonwebtoken_1.sign)({ userId: user.id }, process.env.JWT_SECRET, {
                    expiresIn: "7d",
                });
                reply.send({
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                    },
                    token,
                });
            }
            else {
                return reply.status(404).send({ message: "Email ou senha incorretos" });
            }
            // reply.setCookie("token", token, {
            //   httpOnly: true,
            //   secure: process.env.NODE_ENV === "production",
            //   maxAge: 3600,
            // });
        }
        catch (error) {
            console.log(error);
            reply.status(500).send({ message: "Erro desconhecido" });
        }
    });
}
exports.login = login;
//# sourceMappingURL=login.js.map