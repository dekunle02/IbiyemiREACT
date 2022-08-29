import { useState, useEffect } from "react";
import { useApi } from "../../../context/AuthContext";
import { Product } from "../../../api/interfaces";
import {
  LoadStates,
  PeriodOption,
  ISO_DATE_FORMAT,
} from "../../../constants/constants";
import Spinner from "../../../components/Spinner";
import LoadFailedMessage from "../../../components/LoadFailedMessage";
import { DjangoClient, RequestStatus } from "../../../api/django";
import EmptyListMessage from "../../../components/EmptyListMessage";
import {
  commaSeparateNumber,
  formatMoney,
} from "../../../helpers/format-helpers";
import { calculateProductBulKSellPrice } from "../../../helpers/cart-helpers";
import { Link } from "react-router-dom";

interface TopSellingProps {
  period: PeriodOption;
}

type TopSellingProductObj = {
  product: Product;
  quantity_sold: number;
};

function TopSellingProducts({ period }: TopSellingProps) {
  const django: DjangoClient = useApi();
  const [mostSoldProductArr, setMostSoldProductArr] = useState<
    TopSellingProductObj[]
  >([]);
  const [loadState, setLoadState] = useState(LoadStates.Loading);

  useEffect(() => {
    const startDate = period.startDate.format(ISO_DATE_FORMAT);
    django.getMostSoldProducts(startDate, 10).then((response) => {
      if (response.status === RequestStatus.Success) {
        setMostSoldProductArr(response.data);
        setLoadState(LoadStates.Success);
      } else {
        setLoadState(LoadStates.Failure);
      }
    });
  }, [django, period]);

  return (
    <div className="border rounded-2xl p-3">
      <div className="flex flex-row justify-between mx-3">
        <h3 className="text-xl">Top Selling Products</h3>
        <h6 className="">{period.text}</h6>
      </div>

      <br />
      {loadState === LoadStates.Loading && <Spinner />}
      {loadState === LoadStates.Failure && <LoadFailedMessage />}
      {mostSoldProductArr.length === 0 && <EmptyListMessage />}
      {loadState === LoadStates.Success && (
        <table className="w-full text-center">
          <thead className="border-b-2">
            <tr className="my-2">
              <th>#</th>
              <th className="text-left py-2">Product</th>
              <th className="text-left">Category</th>
              <th>Qty Sold</th>
              <th className="text-left">Earnings</th>
            </tr>
          </thead>

          <tbody className="overflow-auto max-h-96">
            {mostSoldProductArr.map(({ product, quantity_sold }, index) => (
              <tr key={product.id + index}>
                <td>{index + 1}</td>
                <td className="text-left py-4 text-blue-600 ">
                  <Link to={`products/${product.id}`}>{product.name} </Link>
                </td>
                <td className="text-left py-4 text-blue-600">
                  <Link to={`products/categories/${product.category?.id}`}>
                    {product.category?.name}
                  </Link>
                </td>
                <td>{commaSeparateNumber(quantity_sold)}</td>
                <td className="text-left">
                  {formatMoney(
                    calculateProductBulKSellPrice(product, quantity_sold)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TopSellingProducts;
