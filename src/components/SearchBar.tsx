import React from "react";
import { MdCancel, MdSearch } from "react-icons/md";

interface SeachBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  query: string;
  placeholder?: string;
  onSubmit: (event: React.FormEvent) => void;
  onChange?: (event: React.ChangeEvent) => void;
  onClear?: () => void;
}

function SearchBar({
  query,
  placeholder,
  onSubmit,
  onChange,
  onClear,
  className,
  ...otherProps
}: SeachBarProps) {
  return (
    <form className={`relative ${className}`} onSubmit={onSubmit}>
      <input
        id="query"
        name="q"
        type="text"
        value={query}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-3xl py-2 px-4  focus:border-colorPrimary focus:ring-colorPrimary focus:ring-2 truncate"
        {...otherProps}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 right-0 bg-transparent
                       py-3 icon-button gap-0"
      >
        {query.length > 0 && (
          <button
            type="button"
            className="py-3 px-2 hover:bg-colorPrimaryDark/10"
            onClick={onClear}
          >
            <MdCancel />
          </button>
        )}

        <button
          type="submit"
          className="py-3 px-2 rounded-r-3xl hover:bg-colorPrimaryDark/10"
        >
          <MdSearch className="text-xl" />
        </button>
      </div>
    </form>
  );
}
export default SearchBar;
