import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import Jwt from "jsonwebtoken";

import { prisma } from "../../lib/prisma";

export async function deleteLike(app: FastifyInstance) {
  app.delete(
    "/poems/:poemId/likes/:likeId",
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

      const deleteLikeParams = z.object({
        poemId: z.string().uuid(),
        likeId: z.string().uuid(),
      });

      const { poemId, likeId } = deleteLikeParams.parse(req.params);

      try {
        const decoded = Jwt.verify(
          validatedToken,
          process.env.JWT_SECRET as string
        ) as any;

        const userId = decoded.userId;

        const like = await prisma.like.findFirst({
          where: {
            id: likeId,
            poemId,
            userId,
          },
        });

        if (!like) {
          return reply.status(404).send({ message: "Erro na operação." });
        }

        await prisma.like.delete({
          where: {
            id: like.id,
          },
        });
      } catch (error) {
        console.log(error);

        return reply.status(500).send({ message: "Erro desconhecido" });
      }
    }
  );
}
