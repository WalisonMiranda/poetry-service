"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const cors_1 = __importDefault(require("@fastify/cors"));
const sign_up_1 = require("./routes/sign-up");
const login_1 = require("./routes/login");
const create_poem_1 = require("./routes/create-poem");
const get_poems_1 = require("./routes/get-poems");
const get_poem_by_id_1 = require("./routes/get-poem-by-id");
const delete_poem_1 = require("./routes/delete-poem");
const post_like_1 = require("./routes/post-like");
const delete_like_1 = require("./routes/delete-like");
const post_comment_1 = require("./routes/post-comment");
const edit_comment_1 = require("./routes/edit-comment");
const delete_comment_1 = require("./routes/delete-comment");
const get_user_poems_1 = require("./routes/get-user-poems");
const app = (0, fastify_1.default)();
app.register(cookie_1.default, {
    secret: "my-secret",
    hook: "onRequest",
});
app.register(cors_1.default, {
    origin: true,
});
app.register(sign_up_1.signUp);
app.register(login_1.login);
app.register(create_poem_1.createPoem);
app.register(get_poems_1.getPoems);
app.register(get_poem_by_id_1.getPoemById);
app.register(delete_poem_1.deletePoem);
app.register(post_like_1.postLike);
app.register(delete_like_1.deleteLike);
app.register(post_comment_1.postComment);
app.register(edit_comment_1.editComment);
app.register(delete_comment_1.deleteComment);
app.register(get_user_poems_1.getUserPoems);
const port = process.env.PORT || 3333;
app.listen({ port: 3333, host: "0.0.0.0" }, () => {
    console.log(`server running on port ${port}`);
});
//# sourceMappingURL=server.js.map