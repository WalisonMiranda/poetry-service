import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import Jwt from "jsonwebtoken";

import { prisma } from "../../lib/prisma";

export async function postLike(app: FastifyInstance) {
  app.post(
    "/poems/:poemId/likes",
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

      const postLikeParams = z.object({
        poemId: z.string().uuid(),
      });

      const { poemId } = postLikeParams.parse(req.params);

      try {
        const decoded = Jwt.verify(
          validatedToken,
          process.env.JWT_SECRET as string
        ) as any;

        const userId = decoded.userId;

        const hasLike = await prisma.like.findFirst({
          where: {
            poemId,
            userId,
          },
        });

        if (hasLike) {
          return reply.status(400).send({ message: "erro" });
        } else {
          const like = await prisma.like.create({
            data: {
              poemId,
              userId,
            },
          });

          return reply.status(201).send({ like });
        }
      } catch (error) {
        console.log(error);

        return reply.status(500).send({ message: "Erro desconhecido." });
      }
    }
  );
}
