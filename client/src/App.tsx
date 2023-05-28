import { gql, useLazyQuery } from "@apollo/client";
import { Book } from "@prisma/client";
import { useEffect, useState } from "react";
import BooksList from "./components/BooksList";
import BookPage from "./components/BookPage";

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

function App() {
  const [getBooks, { data }] = useLazyQuery(GET_BOOKS, {
    fetchPolicy: "network-only",
  });
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleOpenModal = (open: boolean) => {
    setOpenModal(open);
  };

  const handleHeaderButtonClick = () => {
    setOpenModal(true);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    getBooks();
  };

  const handleCoverClick = (id: string) => {
    setSelectedBook(data.getAllBooks.find((book: Book) => book.id === id));
  };

  const handleUpdateSelectedBook = (book: Book) => {
    setSelectedBook(book);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleBackToList = () => {
    setSelectedBook(null);
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center">
      <div className="w-full h-20 flex justify-center items-center border-b border-solid border-gray-100">
        <h3 className="text-lg font-bold text-gray-600">
          Book Management System
        </h3>
      </div>
      {selectedBook ? (
        <BookPage
          book={selectedBook}
          openModal={openModal}
          onUpdateSelectedBook={handleUpdateSelectedBook}
          onHeaderButtonClick={handleHeaderButtonClick}
          onClose={handleClose}
          onOpenModal={handleOpenModal}
          onBackToList={handleBackToList}
        />
      ) : (
        <BooksList
          books={data.getAllBooks}
          openModal={openModal}
          onCoverClick={handleCoverClick}
          fetchBooks={fetchBooks}
          onHeaderButtonClick={handleHeaderButtonClick}
          onClose={handleClose}
          onOpenModal={handleOpenModal}
        />
      )}
    </div>
  );
}

export default App;
