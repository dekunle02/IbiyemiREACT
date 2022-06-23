// react
import { useState, useEffect } from "react";
import { useApi } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";

// external
import { HiLockClosed, HiPencil, HiOutlinePlus } from "react-icons/hi";

// local
import { Remission, User, CartItem } from "../../api/interfaces";
import EmptyListMessage from "../../components/EmptyListMessage";
import {
  capitalizeSentence,
  formatMoney,
  formatRawDate,
} from "../../helpers/format-helpers";
import PeriodDropdown from "../../components/PeriodDropdown";
import { PeriodOption } from "../../constants/constants";

function ProfileIndex() {
  const django = useApi();
  const [remissionArr, setRemissionArr] = useState<Remission[]>([]);
  const [cartItemArr, setCartItemArr] = useState<CartItem[]>([]);
  const [startDate, setStartDate] = useState("");

  const user: User = useAppSelector((state) => state.user.user);

  const handlePeriodOptionSelected = (p: PeriodOption) => {
    setStartDate(p.startDate.toString());
  };

  return (
    <div className="w-full md:px-14">
      {/* MAIN PROFILE */}
      <div className="m-3 md:m-5 p-3 rounded-xl border">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-3xl">
            Hi {capitalizeSentence(user.username)} 👋🏾
          </h1>
          <PeriodDropdown
            id="profile"
            onPeriodOptionSelected={handlePeriodOptionSelected}
          />
        </div>

        <p>
          Total Sales: <span className="text-xl font-semibold">5</span>
        </p>
        <p>
          Amount Received: <span className="text-xl font-semibold">5</span>
        </p>
        <p>
          Remissions: <span className="text-xl font-semibold">5</span>
        </p>

        <div className="flex flex-col md:flex-row gap-2 md:items-center items-end justify-end">
          <Link to="change-username" className="icon-button outline-button">
            <HiPencil />
            Edit Username
          </Link>
          <Link to="change-password" className="icon-button outline-button">
            <HiLockClosed />
            Change Password
          </Link>
        </div>
      </div>
      {/* MAIN PROFILE END */}

      {/* REMISSION TABLE START*/}
      <div className="m-3 md:m-5 p-3 rounded-xl border overflow-auto">
        <div className="flex flex-row justify-between mb-2">
          <h1 className="text-2xl">💸 Remissions</h1>
          <Link className="button icon-button" to="new-remission">
            <HiOutlinePlus />
            <span className="hidden md:inline"> Remit Money </span>
          </Link>
        </div>

        <table className="w-full">
          <thead className="text-left border-b-2">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Description</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {remissionArr.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-4">{formatRawDate(item.date)}</td>
                <td className="p-4">{formatMoney(item.amount)}</td>
                <td className="p-4">{item.description}</td>
                <td
                  className={`p-4 ${
                    item.approved ? "bg-colorGreen" : "bg-colorRed/50"
                  } `}
                >
                  {item.approved ? "Approved" : "Awaiting Approval"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {remissionArr.length === 0 && (
          <EmptyListMessage message="No remissions..." />
        )}
      </div>
      {/* REMISSION TABLE END */}

      {/* PRODUCT TABLE START  */}
      <div className="m-3 md:m-5 p-3 rounded-xl border overflow-auto">
        <h1 className="text-2xl mb-2">📕 Products Sold</h1>

        <table className="w-full">
          <thead className="text-left border-b-2">
            <tr>
              <th className="p-4">#</th>
              <th className="p-4">Product</th>
              <th className="p-4">Receipt No</th>
              <th className="p-4">Quantity</th>
              <th className="p-4">Price</th>
            </tr>
          </thead>

          <tbody>
            {cartItemArr.map((cartItem, index) => (
              <tr key={cartItem.product.id} className="border-b">
                <td className="p-4">{index}</td>
                <td className="p-4">{cartItem.product.name}</td>
                <td className="p-4">{cartItem.sale?.transaction_id}</td>
                <td className="p-4">{cartItem.quantity}</td>
                <td className="p-4">{cartItem.sale_price}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {cartItemArr.length === 0 && (
          <EmptyListMessage message="No products..." />
        )}
      </div>
      {/* PRODUCT TABLE END  */}
    </div>
  );
}
export default ProfileIndex;
