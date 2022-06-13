import React, { useEffect, useState } from "react";
import { useApi } from "../../context/AuthContext";
import { DjangoClient, RequestStatus } from "../../api/django";
import { LoadStates } from "../../constants/constants";
import LoadFailedMessage from "../../components/LoadFailedMessage";
import Spinner from "../../components/Spinner";
import { HiOutlineSearch, HiX } from "react-icons/hi";
import { FormInput } from "../../components/FormInput";
import ProductComponent from "./product.component";
import { Product } from "../../api/interfaces";

function ShopIndex() {
  const django: DjangoClient = useApi();
  const [query, setQuery] = useState<string>("");
  const [productArr, setProductArr] = useState<Product[]>([]);
  const [loadState, setLoadState] = useState<LoadStates>(LoadStates.Loading);

  useEffect(() => {
    django.getProducts().then((response) => {
      if (response.status === RequestStatus.Success) {
        setLoadState(LoadStates.Success);
        console.log(response.data);
        setProductArr(response.data);
      } else {
        setLoadState(LoadStates.Failure);
      }
    });
  }, [django]);

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

        <div className="flex flex-col">
          {loadState === LoadStates.Loading && <Spinner />}
          {loadState === LoadStates.Failure && <LoadFailedMessage />}
        </div>
      </div>

      {/* PAGE CONTENT  */}
      {loadState === LoadStates.Success && (
        <div>
          {productArr.map((prod) => (
            <ProductComponent key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ShopIndex;
