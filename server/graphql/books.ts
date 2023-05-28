import { GraphQLError } from "graphql";
//@ts-ignore
import { db } from "../utils/db.server.ts";

const typeDefs = `#graphql

  type Book {
    id: String 
    title: String 
    author: String
    publicationYear: Int
    createdAt: String
    updatedAt: String
  }

  input BookInput {
    title: String 
    author: String
    publicationYear: Int
  }

  type Query {
    getAllBooks: [Book]
    getBookById(id: String!): Book
  }

  type Mutation {
    createBook(payload: BookInput): Boolean
    updateBook(id: String!, payload: BookInput!): Book
    deleteBook(id: String!): Boolean
  }
`;

const resolvers = {
  Query: {
    getAllBooks: async () => {
      try {
        const books = await db.book.findMany();
        return books;
      } catch (error) {
        throw new GraphQLError("There was a problem getting books", {
          extensions: {
            error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
          },
        });
      }
    },
    getBookById: async (_: any, { id }) => {
      try {
        const book = await db.book.findFirst({ where: { id } });
        if (!book) throw new Error("Invalid id");
        return book;
      } catch (error) {
        throw new GraphQLError(`There was a problem getting the book ${id}`, {
          extensions: {
            error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
          },
        });
      }
    },
  },
  Mutation: {
    createBook: async (_: any, { payload }) => {
      try {
        const { author, title, publicationYear } = payload;
        const newBook = await db.book.create({
          data: {
            title,
            author,
            publicationYear,
          },
        });

        return !!newBook.id;
      } catch (error) {
        throw new GraphQLError("There was a problem creating the book", {
          extensions: {
            error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
          },
        });
      }
    },
    updateBook: async (_: any, { id, payload }) => {
      try {
        const updatedBook = await db.book.update({
          where: {
            id,
          },
          data: payload,
        });

        return updatedBook;
      } catch (error) {
        throw new GraphQLError(`There was a problem updating the book ${id}`, {
          extensions: {
            error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
          },
        });
      }
    },
    deleteBook: async (_: any, { id }) => {
      try {
        const deletedBook = await db.book.delete({
          where: { id },
        });

        return !!deletedBook.id;
      } catch (error) {
        throw new GraphQLError(`There was a problem deleting the book ${id}`, {
          extensions: {
            error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
          },
        });
      }
    },
  },
};

export { resolvers, typeDefs };
