import fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";

import { createPoem } from "./routes/create-poem";
import { getPoems } from "./routes/get-poems";
import { getPoemById } from "./routes/get-poem-by-id";


const app: FastifyInstance = fastify();

app.register(cookie, {
  secret: "my-secret",
  hook: "onRequest",
});



 

app.register(cors, {
  origin: true,
});

app.register(createPoem);
app.register(getPoems);
app.register(getPoemById);

app.listen({ port: 3333 }).then(() => {
  console.log("Server running on port 3333");
});
