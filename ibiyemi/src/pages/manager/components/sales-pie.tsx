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
import { SaleAggregateObject } from "../../../api/interfaces";
import { capitalizeSentence } from "../../../helpers/format-helpers";
import EmptyListMessage from "../../../components/EmptyListMessage";

interface SalesPieProps {
  period: PeriodOption;
}

function SalesPie({ period }: SalesPieProps) {
  const django: DjangoClient = useApi();
  const [saleArr, setSaleArr] = useState<Sale[]>([]);
  const [loadState, setLoadState] = useState(LoadStates.Loading);

  useEffect(() => {
    const startDate = period.startDate.format(ISO_DATE_FORMAT);
    django.getSales(startDate, null).then((response) => {
      if (response.status === RequestStatus.Success) {
        setSaleArr(response.data);
        response.data.length > 0
          ? setLoadState(LoadStates.Success)
          : setLoadState(LoadStates.Empty);
      } else {
        setLoadState(LoadStates.Failure);
      }
    });
  }, [django, period]);

  function reducePaymentMethod(arr: Sale[]) {
    const paymentObj: any = {};
    arr.forEach((sale) => {
      const paymentMethod = sale.payment_method;
      let total: number = paymentObj[paymentMethod] ?? 0;
      total += 1;
      paymentObj[paymentMethod] = total;
    });
    const keys: string[] = Object.keys(paymentObj); // [cash, transfer, ...]
    const values: number[] = Object.values(paymentObj); // [5, 2, ...]
    return {
      labels: keys.map((key) => capitalizeSentence(key)),
      totals: values,
    };
  }

  const paymentMethodData = useMemo(() => {
    return reducePaymentMethod(saleArr);
  }, [saleArr]);

  const chartOptions: ApexOptions = {
    chart: {
      id: `donut-${Math.random()}`, // should be a different one every re-render
    },
    series: paymentMethodData.totals,
    labels: paymentMethodData.labels,
    theme: {
      palette: "palette4",
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              fontSize: "16px",
              color: "#171717",
            },
            value: {
              fontSize: "28px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 800,
              color: undefined,
            },
          },
        },
      },
    },
  };

  return (
    <div>
      <h3>Payment Options</h3>
      {loadState === LoadStates.Loading && <Spinner />}
      {loadState === LoadStates.Failure && <LoadFailedMessage />}
      {loadState === LoadStates.Empty && (
        <EmptyListMessage message="No Sales in this Period" />
      )}
      {loadState === LoadStates.Success && (
        <Chart
          options={chartOptions}
          series={chartOptions.series}
          type="donut"
          width="380"
        />
      )}
    </div>
  );
}

export default SalesPie;
