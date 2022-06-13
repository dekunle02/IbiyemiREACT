import { HelperResult, HelperStatus } from "./interfaces";
import { CartItem, Product } from "../api/interfaces";

// adds a product to the cartItem arr if the product is not in the cartItem arr,
// if it does, it increases its count by 1
// if the product is not in stock, it does not add it
// does not add more than the stock of the product
export function addProductToCartItemArr(
  product: Product,
  arr: CartItem[]
): HelperResult<CartItem[]> {
  if (product.quantity < 1) {
    return {
      status: HelperStatus.Failure,
      data: arr,
      message: "Item Not In Stock",
    };
  }
  const newArr: CartItem[] = [...arr];
  let productAlreadyExists = false;
  for (let i = 0; i < newArr.length; i++) {
    const item: CartItem = newArr[i];
    if (item.product.id.toString() === product.id.toString()) {
      productAlreadyExists = true;
      item.quantity += 1;
      if (item.quantity > product.quantity) {
        return {
          status: HelperStatus.Failure,
          data: arr,
          message: `Only ${product.quantity} items left in stock`,
        };
      }
      newArr[i] = item;
    }
  }

  if (!productAlreadyExists) {
    newArr.push({ product: product, quantity: 1 });
  }

  return {
    status: HelperStatus.Success,
    data: newArr,
    message: "Item added",
  };
}

// removes a product completely from the cartItem arr
export function removeProductFromCartItemArr(
  product: Product,
  arr: CartItem[]
): HelperResult<CartItem[]> {
  const newArr: CartItem[] = arr.filter(
    (item) => item.product.id.toString() !== product.id.toString()
  );
  return {
    status: HelperStatus.Success,
    data: newArr,
    message: "Item Removed",
  };
}

// reduces the total quantity of the given product in the arr,
// if the product quantity was one, it removes it completely
export function decreaseProductQuantityFromCartItemArr(
  product: Product,
  arr: CartItem[]
): HelperResult<CartItem[]> {
  const newArr: CartItem[] = [...arr];
  const index: number = newArr.findIndex((item) => {
    return item.product.id.toString() === product.id.toString();
  });
  const cartItem = arr[index];
  if (cartItem.quantity === 1) {
    newArr.splice(index, 1);
  } else {
    cartItem.quantity -= 1;
    newArr[index] = cartItem;
  }
  return {
    status: HelperStatus.Success,
    data: newArr,
  };
}

// sets the cartItem if it already exists in the cartItem,
// if the incoming quantity 0, it removes the item
// if the cartItem quantity is > than product quantity, it returns an error
export function setProductQuantityInCartItemArr(
  newQuantity: number,
  product: Product,
  arr: CartItem[]
): HelperResult<CartItem[]> {
  if (newQuantity === 0) {
    return removeProductFromCartItemArr(product, arr);
  }
  if (newQuantity > product.quantity) {
    return {
      status: HelperStatus.Failure,
      data: arr,
      message: `Only ${product.quantity} items left in stock`,
    };
  }
  const newArr: CartItem[] = [...arr];
  const index: number = newArr.findIndex((item) => {
    return item.product.id.toString() === product.id.toString();
  });
  const cartItem = arr[index];
  cartItem.quantity = newQuantity;
  newArr[index] = cartItem;

  return {
    status: HelperStatus.Success,
    data: newArr,
  };
}

export function calculateCartItemSellingPrice(): number {
  // calculates the total selling price for a given cartItem
  return 0;
}

export function calculateCartSellingPrice(): number {
  // calculates the total selling price for the cart in total
  return 0;
}
