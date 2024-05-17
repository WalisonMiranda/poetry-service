import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { prisma } from "../../lib/prisma";

export async function getPoemById(app: FastifyInstance) {
  app.get(
    "/poems/:poemId",
    async (req: FastifyRequest, reply: FastifyReply) => {
      const getPoemParams = z.object({
        poemId: z.string().uuid(),
      });

      const { poemId } = getPoemParams.parse(req.params);

      try {
        const poem = await prisma.poem.findUnique({
          where: {
            id: poemId,
          },
          select: {
            id: true,
            title: true,
            text: true,
            likes: true,
            user: {
              select: {
                name: true,
              },
            },
            comments: {
              select: {
                id: true,
                content: true,
                createdAt: true,
                userId: true,
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            userId: true,
          },
        });

        if (!poem) {
          return reply.status(404).send({ message: "Poema não econtrado." });
        }

        return reply.status(200).send({
          poem,
        });
      } catch (error) {
        console.error(error);
        return reply.status(500).send({ message: "Erro desconhecido" });
      }
    }
  );
}
