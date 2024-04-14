import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import Jwt from "jsonwebtoken";

import { prisma } from "../../lib/prisma";

export async function editComment(app: FastifyInstance) {
  app.put(
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

      const getCommentBody = z.object({
        content: z.string(),
      });

      const { content } = getCommentBody.parse(req.body);

      try {
        const decoded = Jwt.verify(
          validatedToken,
          process.env.JWT_SECRET as string
        ) as any;

        const userId = decoded.userId;

        const comment = await prisma.comment.findUnique({
          where: {
            id: commentId,
          },
        });

        if (userId !== comment?.userId) {
          return reply.status(400).send({ message: "Não autorizado" });
        }

        const editedComment = await prisma.comment.update({
          where: {
            id: commentId,
            poemId,
            userId,
          },
          data: {
            content,
          },
        });

        return reply.status(201).send({ editedComment });
      } catch (error) {
        console.log(error);

        return reply.status(500).send({ message: "Erro desconhecido" });
      }
    }
  );
}
