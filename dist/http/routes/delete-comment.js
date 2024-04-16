"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = void 0;
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../../lib/prisma");
async function deleteComment(app) {
    app.delete("/poems/:poemId/comments/:commentId", async (req, reply) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return reply.code(401).send({ error: "Missing token" });
        }
        const token = authHeader.split(" ")[1];
        const tokenSchema = zod_1.z.object({
            token: zod_1.z.string(),
        });
        const { token: validatedToken } = tokenSchema.parse({ token });
        const getPoemParams = zod_1.z.object({
            poemId: zod_1.z.string().uuid(),
            commentId: zod_1.z.string().uuid(),
        });
        const { poemId, commentId } = getPoemParams.parse(req.params);
        try {
            const decoded = jsonwebtoken_1.default.verify(validatedToken, process.env.JWT_SECRET);
            const userId = decoded.userId;
            const comment = await prisma_1.prisma.comment.findUnique({
                where: {
                    id: commentId,
                    poemId,
                    userId,
                },
            });
            if (!comment) {
                return reply
                    .status(404)
                    .send({ message: "Comentário não encontrado." });
            }
            if (userId !== comment.userId) {
                return reply.status(400).send({ message: "Não autorizado." });
            }
            await prisma_1.prisma.comment.delete({
                where: {
                    id: commentId,
                    poemId,
                    userId,
                },
            });
            return reply.status(200).send({ message: "Comentário excluído." });
        }
        catch (error) {
            console.log(error);
            return reply.status(500).send({ message: "Erro desconhecido." });
        }
    });
}
exports.deleteComment = deleteComment;
//# sourceMappingURL=delete-comment.js.map