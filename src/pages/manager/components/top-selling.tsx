import { useState, useEffect, useMemo } from "react";
import { useApi } from "../../../context/AuthContext";
import { Sale, Product } from "../../../api/interfaces";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import {
  LoadStates,
  PeriodOption,
  ISO_DATE_FORMAT,
} from "../../../constants/constants";
import Spinner from "../../../components/Spinner";
import LoadFailedMessage from "../../../components/LoadFailedMessage";
import { DjangoClient, RequestStatus } from "../../../api/django";
import { capitalizeSentence } from "../../../helpers/format-helpers";
import EmptyListMessage from "../../../components/EmptyListMessage";

interface TopSellingProps {
  period: PeriodOption;
}

type TopSellingProductObj = {
  product: Product;
  quantity_sold: number;
};

function TopSellingProducts({ period }: TopSellingProps) {
  const django = useApi();
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

  // console.log("most sold products =>", mostSoldProductArr);
  // console.log("most sold products =>", mostSoldProductArr[0].product);

  return (
    <div className="border rounded-2xl p-3">
      <h3 className="text-xl">Top Selling Products</h3>
      <h6 className="font-thin">Last 7 days</h6>

      <table className="w-full text-center">
        <thead>
          <tr className="border-b my-2">
            <th>#</th>
            <th>Product</th>
            <th>Category</th>
            <th>Sold</th>
            <th>Earnings</th>
          </tr>
        </thead>
        <tbody>
          {}
          <tr>
            <td>1.</td>
            <td>Macmillan Book</td>
            <td>Books</td>
            <td>234</td>
            <td>$5,230</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default TopSellingProducts;
