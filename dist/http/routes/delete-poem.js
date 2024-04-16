"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePoem = void 0;
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../../lib/prisma");
async function deletePoem(app) {
    app.delete("/poems/:poemId", async (req, reply) => {
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
        });
        const { poemId } = getPoemParams.parse(req.params);
        try {
            const decoded = jsonwebtoken_1.default.verify(validatedToken, process.env.JWT_SECRET);
            const userId = decoded.userId;
            const poem = await prisma_1.prisma.poem.findUnique({
                where: {
                    id: poemId,
                },
            });
            if (!poem) {
                return reply.status(404).send({ message: "Poem not found" });
            }
            if (poem.userId !== userId) {
                return reply.code(401).send({ error: "Unauthorized" });
            }
            await prisma_1.prisma.poem.delete({
                where: {
                    id: poemId,
                    userId: userId,
                },
            });
            return reply.status(200).send({ message: "Poem deleted" });
        }
        catch (error) {
            if (error === "invalid token") {
                reply.code(401).send({ error: "Unauthorized" });
            }
            else {
                reply.code(500).send({ error: "Internal server error" });
            }
        }
    });
}
exports.deletePoem = deletePoem;
//# sourceMappingURL=delete-poem.js.map