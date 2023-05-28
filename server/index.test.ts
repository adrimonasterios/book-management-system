import { typeDefs, resolvers } from "./graphql/books";
import { ApolloServer } from "@apollo/server";

let testServer;
let createdBook;

const runQuery = async (query: string, variables?: { [key: string]: any }) => {
  const testObject = variables ? { query, variables } : { query };
  const response = await testServer.executeOperation(testObject);
  const { errors, data } = response.body.singleResult;
  return { errors, data };
};

beforeAll(() => {
  testServer = new ApolloServer({
    typeDefs,
    resolvers,
  });
});

describe("Create a Book", () => {
  const query =
    "mutation CreateBook($payload: BookInput) {createBook(payload: $payload)}";

  it("returns true when a book is created", async () => {
    const {
      errors,
      data: { createBook },
    } = await runQuery(query, {
      payload: { title: "Test Book", author: "Me", publicationYear: 2023 },
    });

    expect(errors).toBeUndefined();
    expect(createBook).toBe(true);
  });

  it("returns an error when payload is missing a required field", async () => {
    const {
      errors,
      data: { createBook },
    } = await runQuery(query, {
      payload: { title: "Test Book", author: "Me" },
    });

    expect(errors).toBeTruthy();
    expect(errors?.[0].extensions.code).toBe("INTERNAL_SERVER_ERROR");
    expect(createBook).toBe(null);
  });

  it("returns an error when field in payload has the wrong type", async () => {
    const { errors, data } = await runQuery(query, {
      payload: { title: "Test Book", author: "Me", publicationYear: "2023" },
    });

    expect(errors).toBeTruthy();
    expect(errors?.[0].extensions.code).toBe("BAD_USER_INPUT");
    expect(data).toBeUndefined();
  });
});

describe("Get All Books", () => {
  const query =
    "query GetAllBooks {getAllBooks {id author title publicationYear}}";

  it("returns an array of books", async () => {
    const {
      errors,
      data: { getAllBooks },
    } = await runQuery(query);

    createdBook = getAllBooks[0];

    expect(errors).toBeUndefined();
    expect(getAllBooks).toEqual(expect.any(Array));
    expect(getAllBooks[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        author: expect.any(String),
        title: expect.any(String),
        publicationYear: expect.any(Number),
      })
    );
  });
});

describe("Get Book by Id", () => {
  const query =
    "query GetBookById($id: String!) {getBookById(id: $id) {id author title publicationYear}}";

  it("returns requested book", async () => {
    const {
      errors,
      data: { getBookById },
    } = await runQuery(query, {
      id: createdBook.id,
    });

    expect(errors).toBeUndefined();
    expect(getBookById).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        author: expect.any(String),
        title: expect.any(String),
        publicationYear: expect.any(Number),
      })
    );
  });

  it("returns an error when id is invalid", async () => {
    const {
      errors,
      data: { getBookById },
    } = await runQuery(query, {
      id: "123",
    });

    expect(errors).toBeTruthy();
    expect(errors?.[0].extensions.code).toBe("INTERNAL_SERVER_ERROR");
    expect(getBookById).toBe(null);
  });

  it("returns an error when id is of the wrong type", async () => {
    const { errors, data } = await runQuery(query, {
      id: 123,
    });

    expect(errors).toBeTruthy();
    expect(errors?.[0].extensions.code).toBe("BAD_USER_INPUT");
    expect(data).toBeUndefined();
  });
});

describe("Update a Book", () => {
  const query =
    "mutation UpdateBook($id: String!, $payload: BookInput!) { updateBook(id: $id, payload: $payload){ id title author publicationYear} }";

  it("returns updated book when a book is updated", async () => {
    const {
      errors,
      data: { updateBook },
    } = await runQuery(query, {
      id: createdBook.id,
      payload: { author: "You" },
    });

    expect(errors).toBeUndefined();
    expect(updateBook).toEqual(
      expect.objectContaining({
        id: createdBook.id,
        author: "You",
        title: createdBook.title,
        publicationYear: createdBook.publicationYear,
      })
    );
  });

  it("returns an error when query is missing the id", async () => {
    const {
      errors,
      data: { updateBook },
    } = await runQuery(query, {
      id: "123",
      payload: { author: "You" },
    });

    expect(errors).toBeTruthy();
    expect(errors?.[0].extensions.code).toBe("INTERNAL_SERVER_ERROR");
    expect(updateBook).toBe(null);
  });

  it("returns an error when id is of the wrong type", async () => {
    const { errors, data } = await runQuery(query, {
      id: 123,
      payload: { author: "You" },
    });

    expect(errors).toBeTruthy();
    expect(errors?.[0].extensions.code).toBe("BAD_USER_INPUT");
    expect(data).toBeUndefined();
  });
});

describe("Delete a Book", () => {
  const query = "mutation DeleteBook($id: String!) { deleteBook(id: $id) }";

  it("returns true when book is deleted", async () => {
    const {
      errors,
      data: { deleteBook },
    } = await runQuery(query, {
      id: createdBook.id,
    });

    expect(errors).toBeUndefined();
    expect(deleteBook).toBe(true);
  });

  it("returns an error when query is missing the id", async () => {
    const {
      errors,
      data: { deleteBook },
    } = await runQuery(query, {
      id: "123",
    });

    expect(errors).toBeTruthy();
    expect(errors?.[0].extensions.code).toBe("INTERNAL_SERVER_ERROR");
    expect(deleteBook).toBe(null);
  });

  it("returns an error when id is of the wrong type", async () => {
    const { errors, data } = await runQuery(query, {
      id: 123,
    });

    expect(errors).toBeTruthy();
    expect(errors?.[0].extensions.code).toBe("BAD_USER_INPUT");
    expect(data).toBeUndefined();
  });
});
