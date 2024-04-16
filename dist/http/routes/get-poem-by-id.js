"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPoemById = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../../lib/prisma");
async function getPoemById(app) {
    app.get("/poems/:poemId", async (req, reply) => {
        const getPoemParams = zod_1.z.object({
            poemId: zod_1.z.string().uuid(),
        });
        const { poemId } = getPoemParams.parse(req.params);
        try {
            const poem = await prisma_1.prisma.poem.findUnique({
                where: {
                    id: poemId,
                },
                select: {
                    likes: true,
                    user: true,
                    comments: true,
                },
            });
            if (!poem) {
                return reply.status(404).send({ message: "Poema não econtrado." });
            }
            return reply.status(200).send({
                poem,
                user: {
                    name: poem.user.name,
                },
                likes: poem.likes,
                comments: poem.comments,
            });
        }
        catch (error) {
            console.error(error);
            return reply.status(500).send({ message: "Erro desconhecido" });
        }
    });
}
exports.getPoemById = getPoemById;
//# sourceMappingURL=get-poem-by-id.js.map