import { FastifyInstance, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";

export async function getPoems(app: FastifyInstance) {
  app.get("/poems", async (request, reply: FastifyReply) => {
    try {
      const { page = 0, limit = 10 } = request.query; // Definindo valores padrão para page e limit

      const totalPoems = await prisma.poem.count(); // Conta o total de poemas para calcular a paginação
      const skip = parseInt(page) * parseInt(limit); // Calcula o número de itens a serem ignorados

      const poems = await prisma.poem.findMany({
        take: parseInt(limit),
        skip: skip,
        orderBy: {
          id: 'asc', // Ordena os resultados pela ID em ordem crescente
        },
        select: {
          id: true,
          title: true,
          text: true,
          user: true,
          likes: true,
          comments: true,
        },
      });

      const totalPages = Math.ceil(totalPoems / parseInt(limit)); // Calcula o número total de páginas

      return reply.status(200).send({
        poems,
        currentPage: parseInt(page) + 1, // Retorna a página atual começando de 1
        totalPages, // Retorna o número total de páginas
      });
    } catch (error) {
      console.log(error);
      return reply.status(500).send({ message: "Erro desconhecido" });
    }
  });
}
