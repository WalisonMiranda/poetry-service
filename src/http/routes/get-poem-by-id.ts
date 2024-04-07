import { FastifyInstance } from "fastify";
import { z } from "zod";

import { prisma } from "../../lib/prisma";

export async function getPoemById(app: FastifyInstance) {
  app.get(
    "/poems/:poemId",
    {
      schema: {
        params: {
          poemId: { type: "string" },
        },
        response: {
          200: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              text: { type: "string" },
              likes: { type: "number" },
              comments: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string", format: "uuid" },
                    user: { type: "string" },
                    content: { type: "string" },
                  },
                },
              },
              user: {
                type: "object",
                properties: {
                  id: { type: "string", format: "uuid" },
                  name: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    async (req, reply) => {
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
      } catch (error) {
        console.error(error);
        return reply
          .status(500)
          .send({ message: "Erro ao solicitar requisição" });
      }
    }
  );
}
