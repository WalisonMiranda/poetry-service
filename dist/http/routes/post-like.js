"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postLike = void 0;
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../../lib/prisma");
async function postLike(app) {
    app.post("/poems/:poemId/likes", async (req, reply) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return reply.code(401).send({ error: "Missing token" });
        }
        const token = authHeader.split(" ")[1];
        const tokenSchema = zod_1.z.object({
            token: zod_1.z.string(),
        });
        const { token: validatedToken } = tokenSchema.parse({ token });
        const postLikeParams = zod_1.z.object({
            poemId: zod_1.z.string().uuid(),
        });
        const { poemId } = postLikeParams.parse(req.params);
        try {
            const decoded = jsonwebtoken_1.default.verify(validatedToken, process.env.JWT_SECRET);
            const userId = decoded.userId;
            const hasLike = await prisma_1.prisma.like.findFirst({
                where: {
                    poemId,
                    userId,
                },
            });
            if (hasLike) {
                return reply.status(400).send({ message: "erro" });
            }
            else {
                const like = await prisma_1.prisma.like.create({
                    data: {
                        poemId,
                        userId,
                    },
                });
                return reply.status(201).send({ like });
            }
        }
        catch (error) {
            console.log(error);
            return reply.status(500).send({ message: "Erro desconhecido." });
        }
    });
}
exports.postLike = postLike;
//# sourceMappingURL=post-like.js.map