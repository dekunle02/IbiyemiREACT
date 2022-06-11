import React, { useState } from "react";
import { HiOutlineSearch, HiX } from "react-icons/hi";
import { FormInput } from "../../components/FormInput";

function ShopIndex() {
  const [query, setQuery] = useState<string>("");
  const [productArr, setProductArr] = useState([]);

  const handleSearchQueryChange = (event: React.ChangeEvent) => {
    const element = event.target as HTMLInputElement;
    setQuery(element.value);
  };

  const handleClearQuery = () => {
    if (query.length > 0) {
      setQuery("");
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* SEARCH BAR */}
      <div className="relative w-5/6 md:w-3/4 mx-auto py-10">
        <FormInput
          id="query"
          name="query"
          type="text"
          placeholder="Search for a product.."
          value={query}
          onChange={handleSearchQueryChange}
        >
          <button
            onClick={handleClearQuery}
            className="absolute top-1 right-0 text-xl rounded-r-xl
          hover:bg-colorBlack/5 p-3 pl-5"
          >
            {query.length > 0 ? <HiX /> : <HiOutlineSearch />}
          </button>
        </FormInput>
      </div>
    </div>
  );
}

export default ShopIndex;
