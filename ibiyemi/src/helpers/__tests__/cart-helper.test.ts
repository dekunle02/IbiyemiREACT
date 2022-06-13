import { CartItem, Product } from "../../api/interfaces";
import { HelperResult, HelperStatus } from "../interfaces";
import {
  addProductToCartItemArr,
  decreaseProductQuantityFromCartItemArr,
  removeProductFromCartItemArr,
  setProductQuantityInCartItemArr,
} from "../cart-helpers";

describe("Can Add Product to Cart", () => {
  let cartItemArr: CartItem[];
  let first_product: Product;

  beforeEach(() => {
    first_product = {
      id: "1",
      name: "SampleProduct",
      unit_cost_price: 10,
      unit_sell_price: 15,
      quantity: 1,
    };

    cartItemArr = [{ product: first_product, quantity: 1 }];
  });
  test("does not add if product not in stock", () => {
    const notStockedProduct: Product = {
      id: "2",
      name: "SampleProduct",
      unit_cost_price: 10,
      unit_sell_price: 15,
      quantity: 0,
    };
    const result: HelperResult<CartItem[]> = addProductToCartItemArr(
      notStockedProduct,
      cartItemArr
    );
    expect(result.status).toEqual(HelperStatus.Failure);
    expect(result.data.length).toEqual(cartItemArr.length);
  });

  test("does not add if product exceeds stock", () => {
    const result: HelperResult<CartItem[]> = addProductToCartItemArr(
      first_product,
      cartItemArr
    );
    expect(result.status).toEqual(HelperStatus.Failure);
    expect(result.data.length).toEqual(cartItemArr.length);
  });

  test("adds the product to cart if product not in cart already", () => {
    const notStockedProduct: Product = {
      id: "3",
      name: "SampleProduct",
      unit_cost_price: 10,
      unit_sell_price: 15,
      quantity: 2,
    };
    const result: HelperResult<CartItem[]> = addProductToCartItemArr(
      notStockedProduct,
      cartItemArr
    );
    expect(result.status).toEqual(HelperStatus.Success);
    expect(result.data.length).toEqual(cartItemArr.length + 1);
    expect(result.data.map((item) => item.product)).toContain(
      notStockedProduct
    );
    expect(
      result.data.find(
        (item) => item.product.id.toString() === notStockedProduct.id.toString()
      )?.quantity
    ).toEqual(1);
  });

  test("adds to quantity of product if in cart already", () => {
    const notStockedProduct: Product = {
      id: "3",
      name: "SampleProduct",
      unit_cost_price: 10,
      unit_sell_price: 15,
      quantity: 2,
    };
    const { data } = addProductToCartItemArr(notStockedProduct, cartItemArr);
    const result: HelperResult<CartItem[]> = addProductToCartItemArr(
      notStockedProduct,
      data
    );

    expect(result.status).toEqual(HelperStatus.Success);
    expect(result.data.length).toEqual(cartItemArr.length + 1);
    expect(result.data.map((item) => item.product)).toContain(
      notStockedProduct
    );
    expect(
      result.data.find(
        (item) => item.product.id.toString() === notStockedProduct.id.toString()
      )?.quantity
    ).toEqual(2);
  });
});

describe("Can remove item from cart", () => {
  test("Removes product if in cart", () => {
    const product: Product = {
      id: "1",
      name: "SampleProduct",
      unit_cost_price: 10,
      unit_sell_price: 15,
      quantity: 1,
    };

    const cartItemArr: CartItem[] = [{ product: product, quantity: 1 }];
    const result: HelperResult<CartItem[]> = removeProductFromCartItemArr(
      product,
      cartItemArr
    );

    expect(result.data.length).toEqual(0);
  });
});

describe("Can reduce quantity in cart", () => {
  it("Removes a product in cart if qty is 1", () => {
    const product: Product = {
      id: "1",
      name: "SampleProduct",
      unit_cost_price: 10,
      unit_sell_price: 15,
      quantity: 1,
    };
    const cartItemArr: CartItem[] = [{ product: product, quantity: 1 }];
    const result: HelperResult<CartItem[]> =
      decreaseProductQuantityFromCartItemArr(product, cartItemArr);
    expect(result.data.length).toEqual(0);
  });

  it("Reduces product quantity in cart if qty is 1", () => {
    const product: Product = {
      id: "1",
      name: "SampleProduct",
      unit_cost_price: 10,
      unit_sell_price: 15,
      quantity: 2,
    };
    const cartItemArr: CartItem[] = [{ product: product, quantity: 2 }];
    const result: HelperResult<CartItem[]> =
      decreaseProductQuantityFromCartItemArr(product, cartItemArr);
    expect(result.data[0].quantity).toEqual(1);
  });
});

describe("Can set cartItem quantity in the cartItemArr", () => {
  it("If new quantity is 0, it removes the item", () => {
    const product: Product = {
      id: "1",
      name: "SampleProduct",
      unit_cost_price: 10,
      unit_sell_price: 15,
      quantity: 1,
    };
    const cartItemArr: CartItem[] = [{ product: product, quantity: 1 }];
    const result: HelperResult<CartItem[]> = setProductQuantityInCartItemArr(
      0,
      product,
      cartItemArr
    );
    expect(result.data.length).toEqual(0);
  });
  it("If new quantity is greater than product stock quantity, it does not change the qty", () => {
    const product: Product = {
      id: "1",
      name: "SampleProduct",
      unit_cost_price: 10,
      unit_sell_price: 15,
      quantity: 1,
    };
    const cartItemArr: CartItem[] = [{ product: product, quantity: 1 }];
    const result: HelperResult<CartItem[]> = setProductQuantityInCartItemArr(
      2,
      product,
      cartItemArr
    );
    expect(result.status).toEqual(HelperStatus.Failure);
    expect(result.data[0].quantity).toEqual(1);
  });

  it("correctly sets the cartItem quantity to the new quanttity provided", () => {
    const product: Product = {
      id: "1",
      name: "SampleProduct",
      unit_cost_price: 10,
      unit_sell_price: 15,
      quantity: 10,
    };
    const cartItemArr: CartItem[] = [{ product: product, quantity: 1 }];
    const result: HelperResult<CartItem[]> = setProductQuantityInCartItemArr(
      5,
      product,
      cartItemArr
    );
    expect(result.status).toEqual(HelperStatus.Success);
    expect(result.data[0].quantity).toEqual(5);
  });
});
