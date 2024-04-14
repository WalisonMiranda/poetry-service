import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import Jwt from "jsonwebtoken";

import { prisma } from "../../lib/prisma";

export async function postComment(app: FastifyInstance) {
  app.post(
    "/poems/:poemId/comments",
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

        const comment = await prisma.comment.create({
          data: {
            content,
            poemId,
            userId,
          },
        });

        return reply.status(201).send({ comment });
      } catch (error) {
        console.log(error);

        return reply.status(500).send({ message: "Erro desconhecido" });
      }
    }
  );
}
