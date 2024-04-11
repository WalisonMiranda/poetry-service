import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { sign, verify } from "jsonwebtoken";
import bcrypt from "bcrypt";

import { prisma } from "../../lib/prisma";

export async function login(app: FastifyInstance) {
  app.post("/user/login", async (req: FastifyRequest, reply: FastifyReply) => {
    const createUserBody = z.object({
      email: z.string(),
      password: z.string(),
    });

    try {
      const { email, password } = createUserBody.parse(req.body);

      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!user) {
        return reply.status(404).send({ message: "Usuário não encontrado." });
      }

      const mathPassword = await bcrypt.compare(password, user.password);

      if (mathPassword) {
        const token = sign(
          { userId: user.id },
          process.env.JWT_SECRET as string,
          {
            expiresIn: "7d",
          }
        );

        reply.send({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          token,
        });
      } else {
        return reply.status(404).send({ message: "Email ou senha incorretos" });
      }

      // reply.setCookie("token", token, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      //   maxAge: 3600,
      // });
    } catch (error) {
      console.log(error);

      reply.status(500).send({ message: "Erro desconhecido" });
    }
  });
}
