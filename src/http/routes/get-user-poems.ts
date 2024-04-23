import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

import { prisma } from "../../lib/prisma";

export async function getUserPoems(app: FastifyInstance) {
  app.get(
    "/poems/:userId/user-poems",
    async (req: FastifyRequest, reply: FastifyReply) => {
      const userPoemsParams = z.object({
        userId: z.string().uuid(),
      });

      const { userId } = userPoemsParams.parse(req.params);

      try {
        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            name: true,
            poems: {
              select: {
                id: true,
                title: true,
                text: true,
                likes: true,
                comments: true,
              }
            },
          },
        });

        if (!user) {
          return reply.status(404).send({ message: "Usuário não encontrado." });
        }

        return reply.status(200).send({
          user
        });
      } catch (error) {
        console.log(error);

        return reply.status(500).send({ message: "Erro desconhecido." });
      }
    }
  );
}
