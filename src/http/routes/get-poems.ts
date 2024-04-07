import { FastifyInstance } from "fastify";

import { prisma } from "../../lib/prisma";
import { boolean } from "zod";

export async function getPoems(app: FastifyInstance) {
  app.get(
    "/poems",
    {
      schema: {
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string", format: "uuid" },
                text: { type: "string" },
                likes: { type: "number" },
                comments: { type: "number" },
                user: { type: "string" },
              },
            },
          },
        },
      },
    },
    async (req, reply) => {
      try {
        const poems = await prisma.poem.findMany({
          select: {
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

        return reply
          .status(500)
          .send({ message: "Erro ao solicitar requisição" });
      }
    }
  );
}
