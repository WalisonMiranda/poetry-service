import fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";

import { signUp } from "./routes/sign-up";
import { login } from "./routes/login";
import { createPoem } from "./routes/create-poem";
import { getPoems } from "./routes/get-poems";
import { getPoemById } from "./routes/get-poem-by-id";
import { deletePoem } from "./routes/delete-poem";
import { postLike } from "./routes/post-like";
import { deleteLike } from "./routes/delete-like";
import { postComment } from "./routes/post-comment";
import { editComment } from "./routes/edit-comment";
import { deleteComment } from "./routes/delete-comment";
import { getUserPoems } from "./routes/get-user-poems";

const app: FastifyInstance = fastify();

app.register(cookie, {
  secret: "my-secret",
  hook: "onRequest",
});

app.register(cors, {
  origin: true,
});

app.register(signUp);
app.register(login);
app.register(createPoem);
app.register(getPoems);
app.register(getPoemById);
app.register(deletePoem);
app.register(postLike);
app.register(deleteLike);
app.register(postComment);
app.register(editComment);
app.register(deleteComment);
app.register(getUserPoems);

app.listen({ port: 3333 }).then(() => {
  console.log("Server running on port 3333");
});
