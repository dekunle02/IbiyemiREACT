import dayjs from "dayjs";
import DateRangePicker, { DateRange } from "../../components/DateRangePicker";
import React, { useEffect, useMemo, useState } from "react";
import { ISO_DATE_FORMAT, LoadStates } from "../../constants/constants";
import { MdPointOfSale, MdPrint } from "react-icons/md";
import { Sale, CartItem } from "../../api/interfaces";
import { useApi } from "../../context/AuthContext";
import {
  formatMoney,
  formatRawDate,
  capitalizeSentence,
} from "../../helpers/format-helpers";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";
import LoadFailedMessage from "../../components/LoadFailedMessage";

const Today = dayjs();

export default function Sales() {
  const django = useApi();
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: Today,
    endDate: Today,
  });
  const [loadState, setLoadState] = useState(LoadStates.Loading);
  const [saleArr, setSaleArr] = useState<Sale[]>([]);
  const [cartItemArr, setCartItemArr] = useState<CartItem[]>([]);

  function handleDateChange(newDateRange: DateRange) {
    setLoadState(LoadStates.Loading);
    setDateRange(newDateRange);
  }

  useEffect(() => {
    Promise.all([
      django.getSales(
        dateRange.startDate.format(ISO_DATE_FORMAT),
        null,
        dateRange.endDate.format(ISO_DATE_FORMAT)
      ),
      django.getSaleItems(
        null,
        dateRange.startDate.format(ISO_DATE_FORMAT),
        dateRange.endDate.format(ISO_DATE_FORMAT)
      ),
    ]).then((responseArr) => {
      if (responseArr.find((response) => response.status === django.FAILURE)) {
        setLoadState(LoadStates.Failure);
      } else {
        const [saleResponse, saleItemResponse] = responseArr;
        setSaleArr(saleResponse.data);
        setCartItemArr(saleItemResponse.data);
        setLoadState(LoadStates.Success);
      }
    });
  }, [dateRange, django]);

  const totalMoneyReceived = useMemo(() => {
    return saleArr.reduce(
      (previousValue: number, currentItem: Sale) =>
        previousValue + currentItem.sell_price,
      0
    );
  }, [saleArr]);

  const soldProducts = useMemo(() => {
    const productDict: any = {};
    cartItemArr.forEach((item) => {
      const initialQty = productDict[item.product.name] ?? 0;
      productDict[item.product.name] = initialQty + item.quantity;
    });
    return productDict;
  }, [cartItemArr]);

  // HARD CODED ; BAD PRACTICE, IMPROVE IN LATER VERSIONS
  const printSummaryHref = `https://ibiyemi-s-5ldap.ondigitalocean.app/manager/summary/?from=${dateRange.startDate.format(
    ISO_DATE_FORMAT
  )}&to=${dateRange.endDate.format(ISO_DATE_FORMAT)}`;

  return (
    <div>
      <div className="flex flex-row items-center gap-2 mb-2 flex-wrap">
        <h1 className="font-semibold text-3xl text-colorBlack/80 flex flex-row items-center flex-grow">
          <MdPointOfSale />
          Sales
        </h1>
        <a className="outline-button icon-button p-2" href={printSummaryHref}>
          <MdPrint />
          Sale Summary
        </a>
        <DateRangePicker dateRange={dateRange} onChange={handleDateChange} />
      </div>

      {loadState === LoadStates.Loading && <Spinner />}
      {loadState === LoadStates.Failure && <LoadFailedMessage />}
      {loadState === LoadStates.Success && (
        <>
          <div className="flex flex-row gap-3 flex-wrap md:flex-nowrap mb-3">
            <SimpleCard
              mainText="Sales Made"
              subText={saleArr.length.toString()}
            />
            <SimpleCard
              mainText="Money received"
              subText={formatMoney(totalMoneyReceived)}
            />
            <SimpleCard
              mainText="Products sold"
              subText={Object.keys(soldProducts).length.toString()}
            />
          </div>

          <ReceiptBox receiptArr={saleArr} />
          <br />
          <ProductBox soldProducts={soldProducts} />
        </>
      )}
    </div>
  );
}

function SimpleCard(props: { mainText: string; subText: string }) {
  const { mainText, subText } = props;

  return (
    <div className="flex flex-col border border-colorPrimaryDark/80 rounded p-2 w-full">
      <h5 className="font-semibold mb-3">{mainText}</h5>
      <p className="text-3xl text-center font-bold text-colorBlack/80">
        {subText}
      </p>
    </div>
  );
}

function ReceiptBox({ receiptArr }: { receiptArr: Sale[] }) {
  return (
    <div className="flex flex-col p-2 rounded-lg border">
      <h1 className="text-xl">Receipts</h1>
      <div className="flex flex-col divide-y my-2 overflow-auto max-h-60">
        {receiptArr.map((receipt, idx) => (
          <ReceiptRow
            key={receipt.transaction_id}
            receipt={receipt}
            index={idx}
          />
        ))}
      </div>
    </div>
  );
}

function ReceiptRow({ receipt, index }: { receipt: Sale; index: number }) {
  const navigate = useNavigate();
  const { transaction_id, user, sell_price, date_ordered, payment_method } =
    receipt;

  function handleReceiptLinkClick() {
    navigate(`/receipt/${receipt.id}`, { state: { sale: receipt } });
  }

  return (
    <div className="p-1 grid grid-cols-[auto_max-content] grid-rows-2 items-center">
      <p>
        <span className="text-sm">{index + 1}. </span>
        <button onClick={handleReceiptLinkClick} className="font-semibold link">
          Receipt No:{transaction_id}
        </button>
        <span className="py-1 px-2 mx-1 rounded-2xl bg-colorGreen/20">
          {capitalizeSentence(payment_method)}
        </span>
      </p>

      <span className="row-span-2 text-xl">{formatMoney(sell_price)}</span>
      <p className="text-sm">
        <span>Sold by: </span>
        <span className="underline">{user.username}</span>
        <span> on </span>
        <span className="underline">{formatRawDate(date_ordered)}</span>
      </p>
    </div>
  );
}

function ProductBox({ soldProducts }: { soldProducts: any }) {
  return (
    <div className="flex flex-col p-2 rounded-lg border">
      <h1 className="text-xl mb-2">Products Sold</h1>
      <div className="flex flex-col gap-2 divide-y">
        {Object.keys(soldProducts).map((key, idx) => (
          <ProductRow
            key={key}
            product={key}
            quantity={soldProducts[key]}
            index={idx}
          />
        ))}
      </div>
    </div>
  );
}
function ProductRow(props: {
  product: string;
  quantity: number;
  index: number;
}) {
  const { product, quantity, index } = props;
  return (
    <div className="p-1 flex flex-row items-center justify-between overflow-auto max-h-60">
      <p>
        <span className="text-sm">{index + 1}. </span>
        <span className="font-semibold">{product}</span>
      </p>

      <span className="row-span-2 text-xl">{quantity} item(s)</span>
    </div>
  );
}
