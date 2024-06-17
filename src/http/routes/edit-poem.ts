import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import Jwt from "jsonwebtoken";

import { prisma } from "../../lib/prisma";

export async function editPoem(app: FastifyInstance) {
  app.put(
    "/poems/:poemId",
    async (req: FastifyRequest, reply: FastifyReply) => {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return reply.code(401).send({ error: "Missing token" });
      }
      const token = authHeader.split(" ")[1];

      const tokenSchema = z.object({
        token: z.string(),
      });

      const { token: validatedToken } = tokenSchema.parse({ token });

      const getPoemParams = z.object({
        poemId: z.string().uuid(),
      });

      const { poemId } = getPoemParams.parse(req.params);

      const getPoemBody = z.object({
        title: z.string(),
        text: z.string(),
      });

      const { title, text } = getPoemBody.parse(req.body);

      try {
        const decoded = Jwt.verify(
          validatedToken,
          process.env.JWT_SECRET as string
        ) as any;

        const userId = decoded.userId;

        const poem = await prisma.poem.findUnique({
          where: {
            id: poemId,
          },
        });

        if (userId !== poem?.userId) {
          return reply.status(400).send({ message: "Não autorizado" });
        }

        const editPoem = await prisma.poem.update({
          where: {
            id: poemId,
          },
          data: {
            title,
            text,
          },
        });

        return reply.status(201).send({ editPoem });
      } catch (error) {
        console.log(error);

        return reply.status(500).send({ message: "Erro desconhecido" });
      }
    }
  );
}
