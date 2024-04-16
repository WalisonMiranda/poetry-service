"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPoem = void 0;
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../../lib/prisma");
async function createPoem(app) {
    app.post("/poems", async (req, reply) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return reply.code(401).send({ error: "Missing token" });
        }
        const token = authHeader.split(" ")[1];
        const tokenSchema = zod_1.z.object({
            token: zod_1.z.string(),
        });
        const { token: validatedToken } = tokenSchema.parse({ token });
        const createPoemBody = zod_1.z.object({
            title: zod_1.z.string().nullish(),
            text: zod_1.z.string(),
        });
        try {
            const decoded = jsonwebtoken_1.default.verify(validatedToken, process.env.JWT_SECRET);
            const userId = decoded.userId;
            const { title, text } = createPoemBody.parse(req.body);
            const poem = await prisma_1.prisma.poem.create({
                data: {
                    title,
                    text,
                    userId,
                },
            });
            return reply.status(201).send({ poem });
        }
        catch (error) {
            reply.code(401).send({ error: "Invalid token" });
        }
    });
}
exports.createPoem = createPoem;
//# sourceMappingURL=create-poem.js.map