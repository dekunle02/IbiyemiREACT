// react
import { useState, useEffect, useMemo } from "react";
import { useApi } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";

// external
import { HiLockClosed, HiPencil, HiOutlinePlus } from "react-icons/hi";

// local
import { Remission, User, CartItem, Sale } from "../../api/interfaces";
import EmptyListMessage from "../../components/EmptyListMessage";
import LoadFailedMessage from "../../components/LoadFailedMessage";

import {
  capitalizeSentence,
  formatMoney,
  formatRawDate,
} from "../../helpers/format-helpers";
import PeriodDropdown from "../../components/PeriodDropdown";
import {
  PeriodOption,
  ISO_DATE_FORMAT,
  LoadStates,
} from "../../constants/constants";
import { RequestStatus } from "../../api/django";
import Spinner from "../../components/Spinner";

function ProfileIndex() {
  const django = useApi();
  const user: User = useAppSelector((state) => state.user.user);
  const [remissionArr, setRemissionArr] = useState<Remission[]>([]);
  const [loadState, setLoadState] = useState(LoadStates.Loading);
  const [cartItemArr, setCartItemArr] = useState<CartItem[]>([]);
  const [startDate, setStartDate] = useState("");

  const handlePeriodOptionSelected = (p: PeriodOption) => {
    setStartDate(p.startDate.format(ISO_DATE_FORMAT));
  };

  useEffect(() => {
    if (startDate === "") {
      return;
    }
    setLoadState(LoadStates.Loading);
    Promise.all([
      django.getRemissions(user, startDate),
      django.getSaleItems(user, startDate),
    ]).then((responseArr) => {
      const failedResponses = responseArr.filter(
        (r) => r.status === RequestStatus.Failure
      );
      if (failedResponses.length > 0) {
        setLoadState(LoadStates.Failure);
        return;
      }
      setLoadState(LoadStates.Success);
      setRemissionArr(responseArr[0].data);
      setCartItemArr(responseArr[1].data);
    });
  }, [django, startDate, user]);

  const totalRemission = useMemo(() => {
    return remissionArr.reduce(
      (total, remission) => total + remission.amount,
      0
    );
  }, [remissionArr]);

  const totalSales = useMemo(() => {
    const saleArr: Sale[] = [];
    const saleIdSet: Set<number | undefined> = new Set<number>();
    cartItemArr.forEach((item) => {
      if (item.sale && !saleIdSet.has(item.sale.id)) {
        saleArr.push(item.sale);
        saleIdSet.add(item.sale.id);
      }
    });
    return saleArr;
  }, [cartItemArr]);

  const totalAmountReceived = useMemo(() => {
    return cartItemArr.reduce(
      (total, item) => total + (item.sell_price ?? 0),
      0
    );
  }, [cartItemArr]);

  console.log("Total SaleItems received ===> ", cartItemArr);

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
          Total Sales:{" "}
          <span className="text-xl font-semibold">{totalSales.length}</span>
        </p>
        <p>
          Amount Received:{" "}
          <span className="text-xl font-semibold">
            {formatMoney(totalAmountReceived)}
          </span>
        </p>
        <p>
          Remissions:{" "}
          <span className="text-xl font-semibold">
            {formatMoney(totalRemission)}
          </span>
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
          <Link className="button icon-button" to="add-remission">
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

          {loadState === LoadStates.Success && (
            <tbody className="overflow-auto max-h-96">
              {remissionArr.map((item, index) => (
                <tr
                  key={item.id}
                  className={`${
                    index !== remissionArr.length - 1 ? "border-b" : ""
                  }`}
                >
                  <td className="p-4">
                    {formatRawDate(item.date ? item.date : "")}
                  </td>
                  <td className="p-4">{formatMoney(item.amount)}</td>
                  <td className="p-4">{item.description}</td>
                  <td className="p-4">
                    {item.approved && (
                      <span className="bg-colorGreen rounded p-3">
                        Approved
                      </span>
                    )}
                    {!item.approved && (
                      <span className="bg-colorRed/50 rounded p-3">
                        Awaiting Approval
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {remissionArr.length === 0 && loadState === LoadStates.Success && (
          <EmptyListMessage message="No remissions..." />
        )}
        {loadState === LoadStates.Loading && <Spinner />}
        {loadState === LoadStates.Failure && <LoadFailedMessage />}
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

          {loadState === LoadStates.Success && (
            <tbody className="overflow-auto max-h-96">
              {cartItemArr.map((cartItem, index) => (
                <tr
                  key={
                    cartItem.product?.id?.toString() + "-" + index.toString()
                  }
                  className={`${
                    index !== cartItemArr.length - 1 ? "border-b" : ""
                  }`}
                >
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{cartItem.product?.name}</td>
                  <td className="p-4">{cartItem.sale?.transaction_id}</td>
                  <td className="p-4">{cartItem.quantity}</td>
                  <td className="p-4">
                    {formatMoney(cartItem.sell_price ? cartItem.sell_price : 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {cartItemArr.length === 0 && loadState === LoadStates.Success && (
          <EmptyListMessage message="No products..." />
        )}
        {loadState === LoadStates.Loading && <Spinner />}
        {loadState === LoadStates.Failure && <LoadFailedMessage />}
      </div>
      {/* PRODUCT TABLE END  */}
    </div>
  );
}
export default ProfileIndex;
