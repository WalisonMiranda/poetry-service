import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient();

async function main() {
  const userData = {
    name: "walison miranda",
    email: "walison@gmail.com",
    password: "senha123",
  };

  const hasUser = await prisma.user.findFirst({
    where: {
      name: userData.name,
    },
  });

  if (hasUser) {
    return await prisma.user.deleteMany({
      where: {
        name: userData.name,
      },
    });
  } else {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
      },
    });

    const token = sign({ userId: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "2m",
    });
    console.log("Usuário criado:", user, token);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
