import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import App from "./src/App";
import BooksList from "./src/components/BooksList";
import { gql } from "@apollo/client";
import "@testing-library/jest-dom";
import BookPage from "./src/components/BookPage";

global.ResizeObserver = require("resize-observer-polyfill");

const GET_BOOKS = gql`
  query GetAllBooks {
    getAllBooks {
      id
      title
      author
      publicationYear
      createdAt
    }
  }
`;

const CREATE_BOOK = gql`
  mutation CreateBook($payload: BookInput) {
    createBook(payload: $payload)
  }
`;

const mocks: any = [
  {
    request: {
      query: GET_BOOKS,
    },
    result: {
      data: {
        getAllBooks: [
          {
            id: "55360ce6-6ec9-4046-a12d-0596c5432522",
            title: "One Book",
            author: "Me",
            publicationYear: 2022,
            createdAt: "2023-05-27 09:34:17.507",
          },
          {
            id: "55360ce6-6ec9-4046-a12d-0596c5432523",
            title: "Two Books",
            author: "One Me",
            publicationYear: 2021,
            createdAt: "2023-05-27 09:34:17.507",
          },
          {
            id: "55360ce6-6ec9-4046-a12d-0596c5432524",
            title: "Three Books",
            author: "Me3",
            publicationYear: 2023,
            createdAt: "2023-05-27 09:34:17.507",
          },
          {
            id: "55360ce6-6ec9-4046-a12d-0596c5432525",
            title: "Four Books",
            author: "Me4",
            publicationYear: 2023,
            createdAt: "2023-05-27 09:34:17.507",
          },
          {
            id: "55360ce6-6ec9-4046-a12d-0596c5432526",
            title: "Five Books",
            author: "Me5",
            publicationYear: 2023,
            createdAt: "2023-05-27 09:34:17.507",
          },
          {
            id: "55360ce6-6ec9-4046-a12d-0596c5432527",
            title: "Six Books",
            author: "Me6",
            publicationYear: 2023,
            createdAt: "2023-05-27 09:34:17.507",
          },
        ],
      },
    },
  },
  {
    request: {
      query: CREATE_BOOK,
    },
    result: {
      data: {
        createBook: true,
      },
    },
  },
];

function renderApp(mocks) {
  const utils = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <App />
    </MockedProvider>
  );

  return { ...utils };
}

describe("App", () => {
  it("Renders Loading if there is no data", async () => {
    renderApp(undefined);
    expect(await screen.findByText("Loading...")).toBeInTheDocument();
  });

  it("Renders the Topbar when there is data", async () => {
    renderApp([mocks[0]]);
    expect(
      await screen.findByText("Book Management System")
    ).toBeInTheDocument();
  });

  it("Renders Book list when there is data", async () => {
    renderApp([mocks[0]]);
    expect(
      await screen.findByText(
        "Here you will find all of your books. Click on any of them to see more details about it"
      )
    ).toBeInTheDocument();
    const covers = screen.getAllByLabelText("thumbnail");
    expect(covers).toHaveLength(5);
  });
});

function renderBookList() {
  const mockFunction = jest.fn();

  const utils = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <BooksList
        books={mocks[0].result.data.getAllBooks}
        openModal={false}
        onCoverClick={mockFunction}
        fetchBooks={mockFunction}
        onHeaderButtonClick={mockFunction}
        onClose={mockFunction}
        onOpenModal={mockFunction}
      />
    </MockedProvider>
  );

  const searchInput = screen.getByLabelText("Search by title or author");
  const addBookButton = screen.getByText("Add new book");
  return { ...utils, searchInput, addBookButton };
}

describe("BooksList", () => {
  it("Searches and filters correctly", async () => {
    const { searchInput } = renderBookList();
    fireEvent.change(searchInput, { target: { value: "one" } });
    const covers = screen.getAllByLabelText("thumbnail");

    expect((searchInput as HTMLInputElement).value).toBe("one");
    expect(covers).toHaveLength(2);
  });

  it("Shows add book modal", async () => {
    const { addBookButton, rerender } = renderBookList();
    fireEvent.click(addBookButton);

    const mockFunction = jest.fn();
    rerender(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BooksList
          books={mocks[0].result.data.getAllBooks}
          openModal={true}
          onCoverClick={mockFunction}
          fetchBooks={mockFunction}
          onHeaderButtonClick={mockFunction}
          onClose={mockFunction}
          onOpenModal={mockFunction}
        />
      </MockedProvider>
    );

    const modal = screen.getByLabelText("modal");

    expect(modal).toBeInTheDocument();
    expect(await screen.findByText("New Book")).toBeInTheDocument();
  });
});

function renderBookPage() {
  const mockFunction = jest.fn();

  const utils = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <BookPage
        book={mocks[0].result.data.getAllBooks[0]}
        openModal={false}
        onUpdateSelectedBook={mockFunction}
        onHeaderButtonClick={mockFunction}
        onClose={mockFunction}
        onOpenModal={mockFunction}
        onBackToList={mockFunction}
      />
    </MockedProvider>
  );

  const coverBook = screen.getByLabelText("main");
  const editBookButton = screen.getByText("Edit Book");
  return { ...utils, editBookButton, coverBook };
}

describe("BookPage", () => {
  it("Renders the requested book page", async () => {
    const { coverBook } = renderBookPage();
    expect(await screen.findByText("Book Page")).toBeInTheDocument();
    expect(coverBook).toBeInTheDocument();
  });

  it("Shows edit book modal", async () => {
    const { editBookButton, rerender } = renderBookPage();
    fireEvent.click(editBookButton);

    const mockFunction = jest.fn();
    rerender(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BookPage
          book={mocks[0].result.data.getAllBooks[0]}
          openModal={true}
          onUpdateSelectedBook={mockFunction}
          onHeaderButtonClick={mockFunction}
          onClose={mockFunction}
          onOpenModal={mockFunction}
          onBackToList={mockFunction}
        />
      </MockedProvider>
    );

    const modal = screen.getByLabelText("modal");

    expect(modal).toBeInTheDocument();
    expect(await screen.findByText("Update Book")).toBeInTheDocument();
  });
});
