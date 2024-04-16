"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLike = void 0;
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../../lib/prisma");
async function deleteLike(app) {
    app.delete("/poems/:poemId/likes/:likeId", async (req, reply) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return reply.code(401).send({ error: "Missing token" });
        }
        const token = authHeader.split(" ")[1];
        const tokenSchema = zod_1.z.object({
            token: zod_1.z.string(),
        });
        const { token: validatedToken } = tokenSchema.parse({ token });
        const deleteLikeParams = zod_1.z.object({
            poemId: zod_1.z.string().uuid(),
            likeId: zod_1.z.string().uuid(),
        });
        const { poemId, likeId } = deleteLikeParams.parse(req.params);
        try {
            const decoded = jsonwebtoken_1.default.verify(validatedToken, process.env.JWT_SECRET);
            const userId = decoded.userId;
            const like = await prisma_1.prisma.like.findFirst({
                where: {
                    id: likeId,
                    poemId,
                    userId,
                },
            });
            if (!like) {
                return reply.status(404).send({ message: "Erro na operação." });
            }
            await prisma_1.prisma.like.delete({
                where: {
                    id: like.id,
                },
            });
        }
        catch (error) {
            console.log(error);
            return reply.status(500).send({ message: "Erro desconhecido" });
        }
    });
}
exports.deleteLike = deleteLike;
//# sourceMappingURL=delete-like.js.map