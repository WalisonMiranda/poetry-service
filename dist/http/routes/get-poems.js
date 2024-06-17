"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPoems = void 0;
const prisma_1 = require("../../lib/prisma");
async function getPoems(app) {
    app.get("/poems", async (_, reply) => {
        try {
            const poems = await prisma_1.prisma.poem.findMany({
                select: {
                    id: true,
                    title: true,
                    text: true,
                    user: true,
                    likes: true,
                    comments: true,
                },
            });
            return reply.status(200).send({
                poems,
            });
        }
        catch (error) {
            console.log(error);
            return reply.status(500).send({ message: "Erro desconhecido" });
        }
    });
}
exports.getPoems = getPoems;
//# sourceMappingURL=get-poems.js.map