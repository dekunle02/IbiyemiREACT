import React from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { toast } from "react-toastify";
import { toastConfig } from "../../constants/constants";

import { HiXCircle } from "react-icons/hi";
import { CartItem, Product } from "../../api/interfaces";
import { formatMoney } from "../../helpers/format-helpers";
import {
  calculateCartItemSellingPrice,
  calculateCartSellingPrice,
  removeProductFromCartItemArr,
  setProductQuantityInCartItemArr,
} from "../../helpers/cart-helpers";
import { HelperResult, HelperStatus } from "../../helpers/interfaces";
import { setCartItemArr } from "../../redux/cartSlice";

function Cart(): JSX.Element {
  const dispatch = useAppDispatch();
  const cartItemArr: CartItem[] = useAppSelector(
    (state) => state.cart.cartItemArr
  );

  const handleCartItemQuantityChange = (event: React.ChangeEvent) => {
    const element = event.target as HTMLInputElement;
    const productId = element.id;
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
      dispatch(setCartItemArr(result.data));
    }
  };

  const handleCartItemDelete = (product: Product) => {
    const result: HelperResult<CartItem[]> = removeProductFromCartItemArr(
      product,
      cartItemArr
    );
    if (result.status === HelperStatus.Failure) {
      toast.warn(result.message, toastConfig);
    } else {
      dispatch(setCartItemArr(result.data));
    }
  };

  return (
    <div className="w-2/5 border rounded-xl h-fit p-5 flex flex-col">
      <p className="text-center mb-3">CART</p>
      {cartItemArr.map((item) => (
        <div
          key={item.product.id}
          className="text-lg flex flex-row items-center gap-x-2 mb-5"
        >
          <button
            onClick={() => handleCartItemDelete(item.product)}
            className="text-colorRed text-xl hover:scale-105"
          >
            <HiXCircle />
          </button>
          <span className="flex-grow">{item.product.name}</span>
          <input
            id={item.product.id.toString()}
            value={item.quantity}
            // max={item.product.quantity}
            min={0}
            type="number"
            className="w-20 mx-2"
            onChange={handleCartItemQuantityChange}
          />
          <span>{formatMoney(calculateCartItemSellingPrice(item))}</span>
        </div>
      ))}

      <div className="flex flex-row justify-between border-t border-b my-2 mb-5 py-2">
        <p>Total: </p>
        <span className="text-2xl">
          {formatMoney(calculateCartSellingPrice(cartItemArr))}
        </span>
      </div>

      <button
        className={`${
          cartItemArr.length === 0 ? "inactive-button" : "button"
        }  mx-auto w-3/4`}
      >
        CHECKOUT
      </button>
    </div>
  );
}
export default Cart;
