"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserPoems = void 0;
const zod_1 = __importDefault(require("zod"));
const prisma_1 = require("../../lib/prisma");
async function getUserPoems(app) {
    app.get("/poems/:userId/user-poems", async (req, reply) => {
        const userPoemsParams = zod_1.default.object({
            userId: zod_1.default.string().uuid(),
        });
        const { userId } = userPoemsParams.parse(req.params);
        try {
            const user = await prisma_1.prisma.user.findUnique({
                where: {
                    id: userId,
                },
                select: {
                    name: true,
                    poems: true,
                },
            });
            if (!user) {
                return reply.status(404).send({ message: "Usuário não encontrado." });
            }
            return reply.status(200).send({
                userName: user.name,
                poems: user.poems,
            });
        }
        catch (error) {
            console.log(error);
            return reply.status(500).send({ message: "Erro desconhecido." });
        }
    });
}
exports.getUserPoems = getUserPoems;
//# sourceMappingURL=get-user-poems.js.map