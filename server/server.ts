import { ApolloServer } from "@apollo/server";
import * as dotenv from "dotenv";
import { resolvers, typeDefs } from "./graphql/books.js";
import { startStandaloneServer } from "@apollo/server/standalone";
import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";

dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const token = req.headers.authorization || "";

    if (!token) {
      throw new GraphQLError("Token not found", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    }

    jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any) => {
      if (err) {
        console.log(err);
        throw new GraphQLError("Invalid Token", {
          extensions: {
            code: "FORBIDDEN",
            http: { status: 403 },
          },
        });
      }
    });

    return {};
  },
});

console.log(`🚀  Server ready at: ${url}`);
