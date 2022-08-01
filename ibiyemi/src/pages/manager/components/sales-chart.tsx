import { useState, useEffect, useMemo } from "react";
import { useApi } from "../../../context/AuthContext";
import {
  LoadStates,
  PeriodOption,
  ISO_DATE_FORMAT,
} from "../../../constants/constants";
import { DjangoClient, RequestStatus } from "../../../api/django";
import { Sale, SaleAggregateObject } from "../../../api/interfaces";
import { formatMoney } from "../../../helpers/format-helpers";
import Spinner from "../../../components/Spinner";
import LoadFailedMessage from "../../../components/LoadFailedMessage";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface SalesChartProps {
  period: PeriodOption;
}

function SalesChart({ period }: SalesChartProps) {
  const django: DjangoClient = useApi();
  const [saleAggregate, setSaleAggregate] =
    useState<SaleAggregateObject | null>(null);
  const [loadState, setLoadState] = useState(LoadStates.Loading);

  useEffect(() => {
    const startDate = period.startDate.format(ISO_DATE_FORMAT);
    django.getSalesAggregate(startDate, period.granularity).then((response) => {
      if (response.status === RequestStatus.Success) {
        setSaleAggregate(response.data);
        setLoadState(LoadStates.Success);
      } else {
        setLoadState(LoadStates.Failure);
      }
    });
  }, [django, period]);

  const salesTotalArr: number[] | undefined = useMemo(() => {
    return saleAggregate?.sales.map((saleArr) => saleArr.length);
  }, [saleAggregate]);

  const chartSeries = [
    {
      name: "Total Sales",
      data: salesTotalArr ?? [],
    },
  ];

  const chartOptions: ApexOptions = {
    chart: {
      id: "basic-bar",
      toolbar: { show: false },
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: saleAggregate?.dates ?? [],
    },
    yaxis: {
      labels: {
        formatter: (val) => val.toString(),
      },
    },
    legend: {
      show: false,
    },
  };

  return (
    <div>
      {loadState === LoadStates.Loading && <Spinner />}
      {loadState === LoadStates.Failure && <LoadFailedMessage />}
      {loadState === LoadStates.Success && (
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="line"
          height={350}
        />
      )}
      Sales Chart
    </div>
  );
}

export default SalesChart;
