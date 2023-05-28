import { Book } from "@prisma/client";

const coverVariants = {
  main: "w-60 h-96",
  thumbnail: "w-36 h-48 cursor-pointer hover:bg-slate-100",
};

const titleVariants = {
  main: "text-lg",
  thumbnail: "text-md",
};

export default function BookCover({
  book,
  size,
  onClick,
}: {
  book: Book;
  size: "main" | "thumbnail";
  onClick?: (id: string) => void;
}) {
  return (
    <div
      className={`border border-gray-200 p-5 flex flex-col justify-between items-center ${coverVariants[size]}`}
      onClick={() => (onClick ? onClick(book.id) : undefined)}
      aria-label={size}
    >
      <h3
        className={`font-bold text-gray-600 ${titleVariants[size]} text-center`}
      >
        {book.title}
      </h3>

      {size === "thumbnail" && (
        <div className="flex flex-col justify-center items-center">
          <p className="text-gray-400 text-sm">{book.author}</p>
          <p className="text-gray-400 text-sm">{book.publicationYear}</p>
        </div>
      )}
    </div>
  );
}
