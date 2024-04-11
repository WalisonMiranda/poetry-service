import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import Jwt from "jsonwebtoken";

import { prisma } from "../../lib/prisma";

export async function deleteComment(app: FastifyInstance) {
  app.delete(
    "/poems/:poemId/comments/:commentId",
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
        commentId: z.string().uuid(),
      });

      const { poemId, commentId } = getPoemParams.parse(req.params);

      try {
        const decoded = Jwt.verify(
          validatedToken,
          process.env.JWT_SECRET as string
        ) as any;

        const userId = decoded.userId;

        const comment = await prisma.comment.findUnique({
          where: {
            id: commentId,
            poemId,
            userId,
          },
        });

        if (!comment) {
          return reply
            .status(404)
            .send({ message: "Comentário não encontrado." });
        }

        if (userId !== comment.userId) {
          return reply.status(400).send({ message: "Não autorizado." });
        }

        await prisma.comment.delete({
          where: {
            id: commentId,
            poemId,
            userId,
          },
        });

        return reply.status(200).send({ message: "Comentário excluído." });
      } catch (error) {
        console.log(error);

        return reply.status(500).send({ message: "Erro desconhecido." });
      }
    }
  );
}
