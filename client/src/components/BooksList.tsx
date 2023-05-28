import { Book } from "@prisma/client";
import BookCover from "./BookCover";
import Header from "./common/Header";
import Modal from "./common/Modal";
import BookForm from "./BookForm";
import { toast, ToastContainer } from "react-toastify";
import { gql, useMutation } from "@apollo/client";
import Input from "./common/Input";
import { ChangeEvent, useEffect, useState } from "react";

const CREATE_BOOK = gql`
  mutation CreateBook($payload: BookInput) {
    createBook(payload: $payload)
  }
`;

const booksPerPage = 5;

const BooksList = ({
  books,
  openModal,
  onCoverClick,
  fetchBooks,
  onClose,
  onHeaderButtonClick,
  onOpenModal,
}: {
  books: Book[];
  openModal: boolean;
  onCoverClick: (id: string) => void;
  fetchBooks: () => void;
  onClose: () => void;
  onHeaderButtonClick: () => void;
  onOpenModal: (open: boolean) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [filteredBooks, setFileteredBooks] = useState<Book[]>(books);
  const [createBook] = useMutation(CREATE_BOOK, {
    onError: (error) => {
      toast.error(error.message);
    },
    onCompleted: () => {
      fetchBooks();
      onOpenModal(false);
      toast.success("The book was created successfully");
    },
  });

  useEffect(() => {
    if (books) {
      setFileteredBooks(books);
    }
  }, [books]);

  const handleCreate = (e: any, book: Book) => {
    e.preventDefault();
    createBook({
      variables: {
        payload: book,
      },
    });
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    const { value } = event.target;
    setSearchTerm(value);
    setFileteredBooks(
      books.filter((book: Book) =>
        `${book.title} ${book.author}`
          .toLowerCase()
          .includes(value.toLowerCase())
      )
    );
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < filteredBooks.length / booksPerPage) setPage(page + 1);
  };

  return (
    <div className="lg:max-w-content w-4/5 mt-20">
      <Header
        title="Books"
        description="Here you will find all of your books. Click on any of them to see more details about it"
        buttonText="Add new book"
        onButtonClick={onHeaderButtonClick}
      />
      <Input
        label="Search by title or author"
        value={searchTerm}
        onChange={handleSearch}
        name="search"
      />
      <div className="mt-9 grid-cols-5 grid gap-5">
        {!!books &&
          filteredBooks
            .slice((page - 1) * booksPerPage, page * booksPerPage)
            .sort((a, b) => Number(a.createdAt) - Number(b.createdAt))
            .map((book: Book, index: number) => (
              <BookCover
                book={book}
                size="thumbnail"
                key={index}
                onClick={onCoverClick}
              />
            ))}
      </div>
      <div>
        <button
          className="cursor-pointer font-semibold text-sm text-gray-400 inline-flex hover:text-gray-600 mt-16 mr-4"
          onClick={handlePreviousPage}
          aria-label="previous-page"
        >{`<`}</button>
        <span
          className="font-semibold text-sm text-gray-400 inline-flex"
          aria-label="page"
        >
          Page {page}
        </span>
        <button
          className="cursor-pointer font-semibold text-sm text-gray-400 inline-flex hover:text-gray-600 mt-16 ml-4"
          onClick={handleNextPage}
          aria-label="next-page"
        >{`>`}</button>
      </div>
      <Modal onClose={onClose} open={openModal}>
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          New Book
        </h3>
        <BookForm buttonText="Add Book" onSubmit={handleCreate} />
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default BooksList;
