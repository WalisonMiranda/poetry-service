import { FastifyInstance } from "fastify";
import { z } from "zod";

import { prisma } from "../../lib/prisma";

export async function createPoem(app: FastifyInstance) {
  app.post(
    "/poems",
    {
      schema: {
        body: {
          type: "object",
          required: ["text", "userId"],
          properties: {
            text: { type: "string" },
            userId: { type: "string", format: "uuid" },
          },
        },
        response: {
          201: {
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
    async (req, reply) => {
      const createPoemBody = z.object({
        userId: z.string().uuid(),
        text: z.string(),
      });

      const { userId, text } = createPoemBody.parse(req.body);

      const poem = await prisma.poem.create({
        data: {
          text,
          userId,
        },
      });

      return reply.status(201).send({ poem });
    }
  );
}
