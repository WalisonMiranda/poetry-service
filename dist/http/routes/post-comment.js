"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postComment = void 0;
const zod_1 = __importDefault(require("zod"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../../lib/prisma");
async function postComment(app) {
    app.post("/poems/:poemId/comments", async (req, reply) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return reply.code(401).send({ error: "Missing token" });
        }
        const token = authHeader.split(" ")[1];
        const tokenSchema = zod_1.default.object({
            token: zod_1.default.string(),
        });
        const { token: validatedToken } = tokenSchema.parse({ token });
        const getPoemParams = zod_1.default.object({
            poemId: zod_1.default.string().uuid(),
        });
        const { poemId } = getPoemParams.parse(req.params);
        const getCommentBody = zod_1.default.object({
            content: zod_1.default.string(),
        });
        const { content } = getCommentBody.parse(req.body);
        try {
            const decoded = jsonwebtoken_1.default.verify(validatedToken, process.env.JWT_SECRET);
            const userId = decoded.userId;
            const comment = await prisma_1.prisma.comment.create({
                data: {
                    content,
                    poemId,
                    userId,
                },
            });
            return reply.status(201).send({ comment });
        }
        catch (error) {
            console.log(error);
            return reply.status(500).send({ message: "Erro desconhecido" });
        }
    });
}
exports.postComment = postComment;
//# sourceMappingURL=post-comment.js.map