import { InputHTMLAttributes } from "react";

type Props = Partial<InputHTMLAttributes<HTMLInputElement>> & {
  label: string;
  error?: string;
  value: string | number;
};

export default function Input({
  label,
  error,
  value,
  type,
  name,
  onChange,
  ...props
}: Props) {
  return (
    <div className="mt-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          {...props}
          type={type || "text"}
          name={name}
          id={name}
          className={`block w-full rounded-md focus:outline-none ${
            error ? "pr-10" : ""
          } sm:text-sm ${
            error
              ? " border-red-300  text-red-900 placeholder-red-300 focus:border-red-500  focus:ring-red-500"
              : " border-gray-300 focus:border-teal-400  focus:ring-teal-400"
          }`}
          onChange={onChange}
          value={value}
        />
      </div>
      {!!error && (
        <p className="mt-2 text-sm text-red-600" id="error">
          {error}
        </p>
      )}
    </div>
  );
}
