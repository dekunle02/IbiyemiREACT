import React, { useEffect, useState } from "react";
import { useApi } from "../../context/AuthContext";
import { setCartItemArr } from "../../redux/cartSlice";
import { setActiveCartIdx, setCartTabState } from "../../redux/cartTabSlice";

import { toast } from "react-toastify";
import { toastConfig } from "../../constants/constants";
import { HiOutlineSearch, HiX } from "react-icons/hi";
import { DjangoClient, RequestStatus } from "../../api/django";
import { LoadStates } from "../../constants/constants";
import { Product, CartItem } from "../../api/interfaces";
import { formatMoney } from "../../helpers/format-helpers";
import { addProductToCartItemArr } from "../../helpers/cart-helpers";
import { HelperStatus, HelperResult } from "../../helpers/interfaces";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";

import { FormInput } from "../../components/FormInput";
import Cart from "./Cart";
import LoadFailedMessage from "../../components/LoadFailedMessage";
import Spinner from "../../components/Spinner";

function ShopIndex() {
  const dispatch = useAppDispatch();
  const django: DjangoClient = useApi();
  const [query, setQuery] = useState<string>("");
  const [productArr, setProductArr] = useState<Product[]>([]);
  const [displayedProductArr, setDisplayedProductArr] = useState<Product[]>([]);

  const activeTabIdx: number = useAppSelector(
    (state) => state.cartTab.activeCartIdx
  );
  const cartTab2DArr: CartItem[][] = useAppSelector(
    (state) => state.cartTab.cartTab2DArr
  );

  const cartItemArr: CartItem[] = cartTab2DArr[activeTabIdx];

  const [loadState, setLoadState] = useState<LoadStates>(LoadStates.Loading);

  useEffect(() => {
    django.getProducts().then((response) => {
      if (response.status === RequestStatus.Success) {
        setLoadState(LoadStates.Success);
        setProductArr(response.data);
        setDisplayedProductArr(response.data);
      } else {
        setLoadState(LoadStates.Failure);
      }
    });
  }, [django]);

  useEffect(() => {
    const mappedProducts: Product[] = productArr.filter((product) =>
      product.name.toLowerCase().includes(query.trim().toLowerCase())
    );
    setDisplayedProductArr(mappedProducts);
  }, [query, productArr]);

  // Handlers
  const handleSearchQueryChange = (event: React.ChangeEvent) => {
    const element = event.target as HTMLInputElement;
    setQuery(element.value);
  };

  const handleClearQuery = () => {
    if (query.length > 0) {
      setQuery("");
    }
  };

  const handleProductClick = (product: Product) => {
    const result: HelperResult<CartItem[]> = addProductToCartItemArr(
      product,
      cartItemArr
    );
    if (result.status === HelperStatus.Success) {
      const newCartTab2DArr = [...cartTab2DArr];
      newCartTab2DArr[activeTabIdx] = result.data;
      dispatch(setCartTabState(newCartTab2DArr));
      // dispatch(setCartItemArr(result.data));
    } else {
      toast.warn(result.message, toastConfig);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col">
      {/* SEARCH BAR */}
      <div className="relative w-5/6 md:w-3/4 mx-auto pt-10 pb-5">
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
        <div className="flex flex-col md:flex-row px-3 gap-2 justify-around overflow-scroll">
          {/* PRODUCT LIST */}
          <div className="flex flex-col gap-5 w-full md:w-3/5 px-5 overflow-auto max-h-full">
            {displayedProductArr.map((product) => (
              // PRODUCT
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="flex flex-row rounded-lg border cursor-pointer hover:bg-colorBlack/5"
              >
                <div className="flex flex-col flex-grow p-5">
                  <p className="text-2xl mb-3">{product.name}</p>
                  <p>
                    Unit Price (1):{" "}
                    <span className="text-xl font-semibold">
                      {formatMoney(product.unit_sell_price)}
                    </span>
                  </p>
                  {!!product.pack_sell_price && !!product.pack_quantity && (
                    <p>
                      Pack Price ({product.pack_quantity}):{" "}
                      {formatMoney(product.pack_sell_price)}
                    </p>
                  )}
                  {!!product.dozen_sell_price && (
                    <p>
                      Dozen Price (12): {formatMoney(product.dozen_sell_price)}
                    </p>
                  )}
                </div>

                <div
                  className={`flex flex-col p-4 rounded justify-center items-center 
                ${
                  product.quantity === 0
                    ? "bg-colorRed/50"
                    : product.notify_quantity &&
                      product.quantity <= product.notify_quantity
                    ? "bg-orange-200"
                    : "bg-colorGreen/50"
                }`}
                >
                  <span>Stock</span>
                  <span className="text-2xl font-semibold">
                    {product.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* CART */}
          <Cart />
        </div>
      )}
    </div>
  );
}

export default ShopIndex;
