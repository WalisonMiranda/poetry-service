import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { sign } from "jsonwebtoken";
import bcrypt from "bcrypt";

import { prisma } from "../../lib/prisma";

export async function signUp(app: FastifyInstance) {
  app.post("/user/signup", async (req: FastifyRequest, reply: FastifyReply) => {
    const createUserBody = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    });

    const { name, email, password } = createUserBody.parse(req.body);

    const hasUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (hasUser) {
      return reply.status(400).send({ message: "email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = sign({ userId: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    // reply.setCookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   maxAge: 3600,
    // });

    reply.send({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
      message: "User registered successfully",
    });
  });
}
