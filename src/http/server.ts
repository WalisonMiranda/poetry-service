import fastify from "fastify";
import cookie from "@fastify/cookie";
import websocket from "@fastify/websocket";
import cors from "@fastify/cors";

const app = fastify();

app.register(cookie, {
  secret: "my-secret",
  hook: "onRequest",
});

app.register(cors, {
  origin: true,
});

app.listen({ port: 3333 }).then(() => {
  console.log("Server runnin on port 3333");
});
