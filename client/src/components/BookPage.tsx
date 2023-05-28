import { Book } from "@prisma/client";
import BookCover from "./BookCover";
import Header from "./common/Header";
import Modal from "./common/Modal";
import BookForm from "./BookForm";
import { gql, useMutation } from "@apollo/client";
import { toast, ToastContainer } from "react-toastify";

const UPDATE_BOOK = gql`
  mutation UpdateBook($id: String!, $payload: BookInput!) {
    updateBook(id: $id, payload: $payload) {
      id
      title
      author
      publicationYear
      createdAt
    }
  }
`;

const DELETE_BOOK = gql`
  mutation DeleteBook($id: String!) {
    deleteBook(id: $id)
  }
`;

const Row = ({ field, value }: { field: string; value: string }) => {
  return (
    <div className="flex">
      <span className="font-semibold text-gray-500 text-sm mr-2">{field}:</span>
      <span className=" text-gray-500 text-sm">{value}</span>
    </div>
  );
};

const BookPage = ({
  book,
  openModal,
  onUpdateSelectedBook,
  onClose,
  onHeaderButtonClick,
  onOpenModal,
  onBackToList,
}: {
  book: Book;
  openModal: boolean;
  onUpdateSelectedBook: (book: Book) => void;
  onClose: () => void;
  onHeaderButtonClick: () => void;
  onOpenModal: (open: boolean) => void;
  onBackToList: () => void;
}) => {
  const [updateBook] = useMutation(UPDATE_BOOK, {
    onError: (error) => {
      toast.error(error.message);
    },
    onCompleted: ({ updateBook }) => {
      onUpdateSelectedBook(updateBook);
      onOpenModal(false);
      toast.success("The book was updated successfully");
    },
  });
  const [deleteBook] = useMutation(DELETE_BOOK, {
    onError: (error) => {
      toast.error(error.message);
    },
    onCompleted: () => {
      toast.success("The book was deleted successfully");
      window.location.reload();
    },
  });

  const getDate = (seconds: Date) => {
    const newDate = new Date(Number(seconds));
    return newDate.toString().split("GMT")[0];
  };

  const handleUpdate = (e: any, bookForm: Book) => {
    e.preventDefault();
    updateBook({
      variables: {
        id: book.id,
        payload: bookForm,
      },
    });
  };

  const handleDeleteBook = () => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      deleteBook({ variables: { id: book.id } });
    }
  };

  return (
    <div className="lg:max-w-content w-4/5 mt-20">
      <Header
        title="Book Page"
        description={book.title}
        buttonText="Edit Book"
        onButtonClick={onHeaderButtonClick}
      />
      <div className="mt-9 flex">
        <BookCover book={book} size="main" />
        <div className="ml-9 flex flex-col">
          <Row field="Author" value={book.author} />
          <Row
            field="Year Published"
            value={book.publicationYear?.toString()}
          />
          <Row field="Date Created" value={getDate(book.createdAt)} />
          <button
            type="button"
            className="mt-7 h-8 rounded font-semibold border border-transparent px-5 py-1.5 text-xs shadow-sm focus:outline-none bg-red-400  text-white  hover:bg-red-500"
            onClick={handleDeleteBook}
          >
            Delete Book
          </button>
        </div>
      </div>
      <Modal onClose={onClose} open={openModal}>
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          Edit Book
        </h3>
        <BookForm
          buttonText="Update Book"
          onSubmit={handleUpdate}
          existingBook={book}
        />
      </Modal>
      <span
        className="cursor-pointer font-semibold text-sm text-gray-400 inline-flex hover:text-gray-600 mt-16"
        onClick={onBackToList}
      >{`<< Back to Book list`}</span>
      <ToastContainer />
    </div>
  );
};

export default BookPage;
