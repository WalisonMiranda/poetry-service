import fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";
import cookie from "@fastify/cookie";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import cors from "@fastify/cors";

import { createPoem } from "./routes/create-poem";
import { getPoems } from "./routes/get-poems";
import { getPoemById } from "./routes/get-poem-by-id";

interface SwaggerOptions {
  routePrefix: string;
  swagger: {
    info: {
      title: string;
      description: string;
      version: string;
    };
    externalDocs: {
      url: string;
      description: string;
    };
    host: string;
    schemes: string[];
    consumes: string[];
    produces: string[];
  };
  uiConfig: {
    docExpansion: string;
    deepLinking: boolean;
  };
  staticCSP: boolean;
  transformStaticCSP: (header: string) => string;
  exposeRoute: boolean;
}

const app: FastifyInstance = fastify();

app.register(cookie, {
  secret: "my-secret",
  hook: "onRequest",
});

app.register(swagger, {
  routePrefix: "/docs",
  swagger: {
    info: {
      title: "Poetry Documentation",
      description: "API documentation with Swagger to use Poetry services",
      version: "1.0.0",
    },
    externalDocs: {
      url: "https://swagger.io",
      description: "Find more info here",
    },
    host: "localhost:3333",
    // schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
  },
  uiConfig: {
    docExpansion: "none",
    deepLinking: true,
  },
  staticCSP: false,
  transformStaticCSP: (header: string) => header,
  exposeRoute: true,
} as SwaggerOptions);

app.register(swaggerUi, {
  routePrefix: "/docs",
  swaggerOptions: {
    url: "http://localhost:3333/docs/json",
  },
} as RouteShorthandOptions);

app.register(cors, {
  origin: true,
});

app.register(createPoem);
app.register(getPoems);
app.register(getPoemById);

app.listen({ port: 3333 }).then(() => {
  console.log("Server running on port 3333");
});
