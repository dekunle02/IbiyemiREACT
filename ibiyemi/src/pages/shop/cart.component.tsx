import { CartItem } from "../../api/interfaces";
import { calculateCartItemSellingPrice } from "../../helpers/cart-helpers";

import { HiXCircle, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { formatMoney } from "../../helpers/format-helpers";

interface CartProps {
  cartItemArr: CartItem[];
}

function Cart({ cartItemArr }: CartProps): JSX.Element {
  return (
    <div className="w-2/5 border rounded-xl h-fit p-5 flex flex-col">
      {cartItemArr.map((item) => (
        <div
          key={item.product.id}
          className="text-lg grid grid-cols-[min-content_max-content_min-content_min-content_min-content_max-content] items-center gap-x-2 mb-5"
        >
          <button className="text-colorRed text-xl hover:scale-105">
            <HiXCircle />
          </button>
          <span>{item.product.name}</span>
          <button className="text-lg hover:scale-105">
            <HiChevronLeft />
          </button>
          <input value={item.quantity} />
          <button className="text-lg hover:scale-105">
            <HiChevronRight />
          </button>
          <span>{formatMoney(calculateCartItemSellingPrice(item))}</span>
        </div>
      ))}
      <button
        className={`${
          cartItemArr.length === 0 ? "inactive-button" : "button"
        }  mx-auto`}
      >
        CHECKOUT
      </button>
    </div>
  );
}
export default Cart;
