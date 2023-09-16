import { useState, useEffect } from "react";
import { useApi } from "../../../context/AuthContext";
import { useParams, Link, useNavigate } from "react-router-dom";
import { LoadStates, ISO_DATE_FORMAT } from "../../../constants/constants";
import dayjs from "dayjs";

import { Product, CartItem } from "../../../api/interfaces";
import Spinner from "../../../components/Spinner";
import BackButton from "../../../components/BackButton";
import DateRangePicker, {
  DateRange,
} from "../../../components/DateRangePicker";
import SimpleDialog from "../../../components/SimpleDialog";
import { usePopup } from "../../../context/PopupContext";
import { formatMoney, formatRawDate } from "../../../helpers/format-helpers";

const Today = dayjs();

interface SaleItem extends CartItem {
  date_added: string;
}

export default function ProductDetail() {
  const django = useApi();
  const popup = usePopup();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loadState, setLoadState] = useState<LoadStates>(LoadStates.Loading);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: Today.subtract(7, "days"),
    endDate: Today,
  });
  const [product, setProduct] = useState<Product | null>(null);
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);

  useEffect(() => {
    if (!id || isNaN(parseFloat(id))) return;
    django.getProduct(parseInt(id)).then((res) => {
      if (res.status === django.SUCCESS) {
        setProduct(res.data);
        setLoadState(LoadStates.Success);
      } else {
        setLoadState(LoadStates.Failure);
      }
    });
  }, [django, id]);

  useEffect(() => {
    if (!id || isNaN(parseFloat(id))) return;
    const formData = {
      start_date: dateRange.startDate.format(ISO_DATE_FORMAT),
      end_date: dateRange.endDate.format(ISO_DATE_FORMAT),
      product: id,
    };
    django.getSaleItemsGeneric(formData).then((res) => {
      if (res.status === django.SUCCESS) {
        setSaleItems(res.data);
      } else {
        setSaleItems([]);
      }
    });
  }, [django, dateRange, id]);

  function handleDateChange(newDateRange: DateRange) {
    setDateRange(newDateRange);
  }

  function handleDelete() {
    if (!id) return;
    django.deleteProduct(id).then((res) => {
      if (res.status === django.SUCCESS) {
        navigate(-1);
        popup?.dismiss();
      }
    });
  }

  function handleDeleteClick() {
    popup?.show(
      <SimpleDialog
        title="Delete Product"
        body="Are you sure you want to delete this product? This is Irreversible"
        positiveText="Yes, Delete"
        negativeText="Cancel"
        positiveAction={handleDelete}
      />
    );
  }

  if (loadState === LoadStates.Loading) return <Spinner />;
  if (!product) return <>No Product Found?</>;

  return (
    <div>
      <div className="flex flex-row items-center">
        <BackButton relative />
        <h1 className="font-semibold text-3xl text-colorBlack/80 mr-5">
          {product.name}
        </h1>
        (
        <Link to="edit" className="">
          Edit
        </Link>
        /
        <button className="link" onClick={handleDeleteClick}>
          Delete
        </button>
        )
      </div>

      <div className="border rounded-md p-2 text-lg">
        <h5>
          Qty: <span className="font-semibold">{product.quantity}</span>
        </h5>
        <h5>
          Category:
          <span className="font-semibold">{product.category?.name}</span>
        </h5>
        <h5>
          Unit Cost Price:{" "}
          <span className="font-semibold">
            {formatMoney(product.unit_cost_price)}
          </span>
        </h5>
        <h5>
          Unit Sell Price:{" "}
          <span className="font-semibold">
            {formatMoney(product.unit_sell_price)}
          </span>
        </h5>
      </div>

      <div className="flex flex-row items-center justify-between mt-10 mb-5 w-full">
        <h6 className="text-xl text-colorPrimary">Sales History</h6>
        <DateRangePicker dateRange={dateRange} onChange={handleDateChange} />
      </div>
      <div className="text-center overflow-y-auto max-h-[40rem]">
        <table className="w-full">
          <thead className="border-b-2">
            <tr className="my-2">
              <th>#</th>
              <th className="text-left py-2">Date</th>
              <th className="text-left">Qty</th>
              <th className="text-left">Sold by</th>
            </tr>
          </thead>

          <tbody>
            {saleItems.map((s, idx) => (
              <tr
                key={s.product.id + Math.random()}
                className="border-b hover:bg-colorPrimaryDark/5"
              >
                <td>{idx + 1}.</td>
                <td className="text-left py-4">
                  {formatRawDate(s.date_added)}
                </td>
                <td className="text-left py-4">{s.quantity}</td>
                <td className="text-left py-4">{s.sale?.user.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
