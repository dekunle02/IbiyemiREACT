import React from "react";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { toast } from "react-toastify";
import { toastConfig } from "../../constants/constants";

import { HiXCircle } from "react-icons/hi";
import { MdAdd, MdClose } from "react-icons/md";
import { CartItem, Product } from "../../api/interfaces";
import { formatMoney } from "../../helpers/format-helpers";
import {
  calculateCartItemSellingPrice,
  calculateCartSellingPrice,
  removeProductFromCartItemArr,
  setProductQuantityInCartItemArr,
} from "../../helpers/cart-helpers";
import { HelperResult, HelperStatus } from "../../helpers/interfaces";
import { setActiveCartIdx, setCartTabState } from "../../redux/cartTabSlice";

function Cart(): JSX.Element {
  const dispatch = useAppDispatch();

  const cartTab2DArr: CartItem[][] = useAppSelector(
    (state) => state.cartTab.cartTab2DArr
  );
  const activeTabIdx: number = useAppSelector(
    (state) => state.cartTab.activeCartIdx
  );
  const cartItemArr = cartTab2DArr[activeTabIdx];

  const handleCartItemQuantityChange = (event: React.ChangeEvent) => {
    const element = event.target as HTMLInputElement;
    const productId = element.id;
    const cartItemArr = cartTab2DArr[activeTabIdx];
    const cartItem = cartItemArr.find(
      (item) => item.product.id.toString() === productId
    );
    const newQuantity = element.value;

    const result: HelperResult<CartItem[]> = setProductQuantityInCartItemArr(
      newQuantity,
      cartItem!.product,
      cartItemArr
    );
    if (result.status === HelperStatus.Failure) {
      toast.warn(result.message, toastConfig);
    } else {
      const newCartTab2DArr = [...cartTab2DArr];
      newCartTab2DArr[activeTabIdx] = result.data;
      dispatch(setCartTabState(newCartTab2DArr));
    }
  };

  const handleCartItemDelete = (product: Product) => {
    const cartItemArr = cartTab2DArr[activeTabIdx];
    const result: HelperResult<CartItem[]> = removeProductFromCartItemArr(
      product,
      cartItemArr
    );
    if (result.status === HelperStatus.Failure) {
      toast.warn(result.message, toastConfig);
    } else {
      const newCartTab2DArr = [...cartTab2DArr];
      newCartTab2DArr[activeTabIdx] = result.data;
      dispatch(setCartTabState(newCartTab2DArr));
    }
  };

  function handleAddNewCartTab() {
    const newCartTab2DArr = [...cartTab2DArr, []];
    const newSelectedIndex = newCartTab2DArr.length - 1;
    dispatch(setCartTabState(newCartTab2DArr));
    dispatch(setActiveCartIdx(newSelectedIndex));
  }

  function handleDeleteCartTab(event: React.MouseEvent) {
    event.stopPropagation();
    const element = event.target as HTMLElement;
    const idx: number = parseInt(element.id);
    let newCartTab2DArr = cartTab2DArr.filter((cart, i) => i !== idx);
    let newIdx = activeTabIdx;
    if (idx <= activeTabIdx) {
      newIdx--;
    }
    newIdx = newIdx < 0 ? 0 : newIdx;

    if (newCartTab2DArr.length === 0) {
      newCartTab2DArr = [[]];
      newIdx = 0;
    }
    dispatch(setActiveCartIdx(newIdx));
    dispatch(setCartTabState(newCartTab2DArr));
  }

  return (
    <div className="w-full md:w-2/5 border rounded-xl h-fit flex flex-col">
      {/* Cart Tab Group */}
      <div className="flex flex-row flex-wrap bg-violet-100 rounded-t-xl">
        {cartTab2DArr.map((cartArr, idx) => (
          <button
            onClick={() => dispatch(setActiveCartIdx(idx))}
            className={`px-3 py-1 icon-button rounded-t-xl
            ${
              idx === activeTabIdx
                ? "bg-colorWhite rounded-t-xl"
                : "bg-violet-100"
            }`}
            key={`${Math.floor(Math.random() * 1000)}-${idx}`}
          >
            {idx + 1}

            <MdClose
              id={idx.toString()}
              className="hover:bg-colorBlack/20 rounded-full"
              onClick={handleDeleteCartTab}
            />
          </button>
        ))}
        <button
          onClick={handleAddNewCartTab}
          className="text-lg rounded-full p-2 m-1 hover:bg-colorBlack/5"
        >
          <MdAdd />
        </button>
      </div>

      <div className="p-2 flex flex-col">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {cartTab2DArr[activeTabIdx].map((item) => (
              <tr key={item.product.id} className="text-center">
                <td>
                  <button
                    onClick={() => handleCartItemDelete(item.product)}
                    className="text-colorRed text-xl hover:scale-105"
                  >
                    <HiXCircle />
                  </button>
                </td>
                <td>{item.product.name}</td>
                <td>
                  <input
                    id={item.product.id.toString()}
                    value={item.quantity}
                    // max={item.product.quantity}
                    min={0}
                    type="number"
                    className="w-20 mx-2 rounded-lg focus:border-colorPrimary focus:ring-colorPrimary focus:ring-2"
                    onChange={handleCartItemQuantityChange}
                  />
                </td>
                <td>{formatMoney(calculateCartItemSellingPrice(item))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-row justify-between border-t border-b my-4 mb-5 py-2">
          <p>Total: </p>
          <span className="text-2xl">
            {formatMoney(calculateCartSellingPrice(cartItemArr))}
          </span>
        </div>

        <Link
          to="checkout"
          className={`${
            cartItemArr.length === 0 ? "inactive-button" : "button"
          }  mx-auto w-3/4 text-center`}
        >
          CHECKOUT
        </Link>
      </div>
    </div>
  );
}
export default Cart;
