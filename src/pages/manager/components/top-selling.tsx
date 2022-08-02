import { useState, useEffect, useMemo } from "react";
import { useApi } from "../../../context/AuthContext";
import { Sale } from "../../../api/interfaces";
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
  componentLoadState: LoadStates;
  saleArr: Sale[];
}

function TopSellingProducts({ componentLoadState, saleArr }: TopSellingProps) {
  console.log("topsellingproducts =", saleArr);
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
