export default function Header({
  title,
  description,
  buttonText,
  onButtonClick,
}: {
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
}) {
  return (
    <div className="border-b border-gray-200 pb-5 flex justify-between items-center">
      <div className="flex flex-col">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          {title}
        </h3>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">{description}</p>
      </div>
      {!!buttonText && (
        <button
          type="button"
          className="h-8 rounded font-semibold border border-transparent px-5 py-1.5 text-xs shadow-sm focus:outline-none bg-teal-400  text-white  hover:bg-teal-500"
          onClick={onButtonClick}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}
