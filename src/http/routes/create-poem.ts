import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import Jwt from "jsonwebtoken";

import { prisma } from "../../lib/prisma";

export async function createPoem(app: FastifyInstance) {
  app.post("/poems", async (req: FastifyRequest, reply: FastifyReply) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return reply.code(401).send({ error: "Missing token" });
    }
    const token = authHeader.split(" ")[1];

    const tokenSchema = z.object({
      token: z.string(),
    });
    const { token: validatedToken } = tokenSchema.parse({ token });

    const createPoemBody = z.object({
      title: z.string().nullish(),
      text: z.string(),
    });

    try {
      const decoded = Jwt.verify(
        validatedToken,
        process.env.JWT_SECRET as string
      ) as any;

      const userId = decoded.userId;

      const { title, text } = createPoemBody.parse(req.body);

      const poem = await prisma.poem.create({
        data: {
          title,
          text,
          userId,
        },
      });

      return reply.status(201).send({ poem });
    } catch (error) {
      reply.code(401).send({ error: "Invalid token" });
    }
  });
}
