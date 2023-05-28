import { Book } from "@prisma/client";
import Input from "./common/Input";
import { ChangeEvent, useEffect, useState } from "react";

type BookFormData = {
  title: string;
  author: string;
  publicationYear: number;
};

export default function BookForm({
  existingBook,
  buttonText,
  onSubmit,
}: {
  existingBook?: Book;
  buttonText: string;
  onSubmit: (event: React.SyntheticEvent, book: Book) => void;
}) {
  const [book, setBook] = useState<BookFormData>({
    title: "",
    author: "",
    publicationYear: new Date().getFullYear(),
  });
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (existingBook) {
      const { title, author, publicationYear } = existingBook;
      setBook({ title, author, publicationYear });
    }
  }, [existingBook]);

  const validateFields = (field: string, value: string | number) => {
    if (field === "publicationYear") {
      if (
        (value as number) > new Date().getFullYear() ||
        (value as number) < 1
      ) {
        setError("Invalid Year");
      } else {
        setError("");
      }
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    validateFields(name, value);
    setBook({ ...book, [name]: value });
  };

  const disabledButton =
    !!error ||
    !Object.keys(book).every(
      (field: string) => !!(book as { [key: string]: number | string })[field]
    );

  return (
    <form onSubmit={(e) => onSubmit(e, book as Book)}>
      <Input
        label="Title"
        name="title"
        value={book.title}
        onChange={handleChange}
      />
      <Input
        label="Author"
        name="author"
        value={book.author}
        onChange={handleChange}
      />
      <Input
        label="Publication Year"
        type="number"
        name="publicationYear"
        value={book.publicationYear}
        error={error}
        onChange={handleChange}
      />
      <button
        type="submit"
        disabled={disabledButton}
        className={`h-8 mt-8 rounded font-semibold border border-transparent px-5 py-1.5 text-xs shadow-sm focus:outline-none ${
          disabledButton ? "bg-gray-400" : "bg-teal-400 hover:bg-teal-500"
        } text-white`}
      >
        {buttonText}
      </button>
    </form>
  );
}
