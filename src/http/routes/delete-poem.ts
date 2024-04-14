import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";

export async function deletePoem(app: FastifyInstance) {
  app.delete(
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

      try {
        const decoded = jwt.verify(
          validatedToken,
          process.env.JWT_SECRET as string
        ) as any;

        const userId = decoded.userId;

        const poem = await prisma.poem.findUnique({
          where: {
            id: poemId,
          },
        });

        if (!poem) {
          return reply.status(404).send({ message: "Poem not found" });
        }

        if (poem.userId !== userId) {
          return reply.code(401).send({ error: "Unauthorized" });
        }

        await prisma.poem.delete({
          where: {
            id: poemId,
            userId: userId,
          },
        });

        return reply.status(200).send({ message: "Poem deleted" });
      } catch (error) {
        if (error === "invalid token") {
          reply.code(401).send({ error: "Unauthorized" });
        } else {
          reply.code(500).send({ error: "Internal server error" });
        }
      }
    }
  );
}
