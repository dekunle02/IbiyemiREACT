import { HelperResult, HelperStatus } from "./interfaces";
import { CartItem, Product } from "../api/interfaces";
import { divmod } from "./format-helpers";

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
      const newQuantity = item.quantity + 1;
      if (newQuantity > product.quantity) {
        return {
          status: HelperStatus.Failure,
          data: arr,
          message: `Only ${product.quantity} items left in stock`,
        };
      }
      newArr[i] = { ...item, quantity: newQuantity };
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
    newArr[index] = { ...cartItem, quantity: cartItem.quantity - 1 };
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
  newQuantity: number | string,
  product: Product,
  arr: CartItem[]
): HelperResult<CartItem[]> {
  if (newQuantity === 0) {
    return removeProductFromCartItemArr(product, arr);
  }

  if (newQuantity === "") {
    newQuantity = 0;
  }

  newQuantity = parseInt(newQuantity as string);

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
  newArr[index] = { ...cartItem, quantity: newQuantity };

  return {
    status: HelperStatus.Success,
    data: newArr,
  };
}

// calculates the total selling price for a given cartItem
export function calculateCartItemSellingPrice(cartItem: CartItem): number {
  return calculateProductBulKSellPrice(cartItem.product, cartItem.quantity);
}

function calculateProductBulKSellPrice(
  product: Product,
  quantity: number
): number {
  if (quantity <= 1) {
    return product.unit_sell_price * quantity;
  }
  const fields: string[] = [
    "pack_sell_price",
    "dozen_sell_price",
    "unit_sell_price",
  ];
  const field_quantities = {
    unit_sell_price: 1,
    dozen_sell_price: 6,
    pack_sell_price: product.pack_quantity
      ? product.pack_quantity / 2
      : product.unit_sell_price,
  };
  const field_prices = {
    unit_sell_price: product.unit_sell_price,
    dozen_sell_price: product.dozen_sell_price
      ? product.dozen_sell_price / 2
      : product.unit_sell_price,
    pack_sell_price: product.pack_sell_price
      ? product.pack_sell_price / 2
      : product.unit_sell_price,
  };
  let denumerator = 1;
  let price = product.unit_sell_price;

  for (let i = 0; i < fields.length; i++) {
    const field: string = fields[i];
    if (
      product[field as keyof Product]! > 0 &&
      quantity >= field_quantities[field as keyof typeof field_quantities]!
    ) {
      denumerator = field_quantities[field as keyof typeof field_quantities];
      price = field_prices[field as keyof typeof field_prices]!;
      break;
    }
  }
  const [quotient, remainder] = divmod(quantity, denumerator);
  return quotient * price + calculateProductBulKSellPrice(product, remainder);
}

// calculates the total selling price for the cart in total
export function calculateCartSellingPrice(arr: CartItem[]): number {
  const initialValue = 0;
  const sumWithInitial = arr.reduce(
    (previousValue, currentValue) =>
      previousValue + calculateCartItemSellingPrice(currentValue),
    initialValue
  );
  return sumWithInitial;
}

export function describeProductQuantity(
  product: Product,
  quantity: number
): string {
  // Has a pack quantity
  if (product.pack_quantity && product.pack_quantity > 0) {
    const [quotient, remainder] = divmod(quantity, product.pack_quantity);
    if (quotient === 0) {
      return `${quantity} unit(s)`;
    }
    return `${quotient} pack(s) ${remainder} unit(s)`;
  }

  // Has a dozen quantity
  if (product.dozen_sell_price && product.dozen_sell_price > 0) {
    const [quotient, remainder] = divmod(quantity, 12);
    if (quotient === 0) {
      return `${quantity} unit(s)`;
    }
    return `${quotient} dozen(s) ${remainder} unit(s)`;
  }

  return `${quantity} unit(s)`;
}

export function calculateTotalItemsInCart(arr: CartItem[]) {
  const initialValue = 0;
  const total = arr.reduce(
    (previousValue, currentItem) => previousValue + currentItem.quantity,
    initialValue
  );
  return total;
}
