import { FastifyInstance } from "fastify";
import { z } from "zod";
import { sign } from "jsonwebtoken";

import { prisma } from "../../lib/prisma";
import { hash } from "../../auth/auth";

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function register(app: FastifyInstance) {
  app.post("/user", async (req, reply) => {
    const createUserBody = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    });

    const { name, email, password } = createUserBody.parse(req.body);

    const hashedPassword = await hash(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = sign({ userId: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "2m",
    });

    reply.setCookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
    });

    reply.send({ message: "User registered successfully" });
  });
}
