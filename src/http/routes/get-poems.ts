import { FastifyInstance, FastifyReply } from "fastify";

import { prisma } from "../../lib/prisma";

export async function getPoems(app: FastifyInstance) {
  app.get("/poems", async (_, reply: FastifyReply) => {
    try {
      const poems = await prisma.poem.findMany({
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
    } catch (error) {
      console.log(error);

      return reply.status(500).send({ message: "Erro desconhecido" });
    }
  });
}
