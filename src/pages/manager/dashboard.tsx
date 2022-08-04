import { useState, useEffect } from "react";
import PeriodDropdown from "../../components/PeriodDropdown";
import {
  PeriodOption,
  ISO_DATE_FORMAT,
  LoadStates,
  PeriodOptions,
} from "../../constants/constants";
import { MdDashboard } from "react-icons/md";
import { DjangoClient, RequestStatus } from "../../api/django";
import { useApi } from "../../context/AuthContext";
import SummaryCards from "./components/summary-cards";
import SalesChart from "./components/sales-chart";
import SalesPie from "./components/sales-pie";
import TopSellingProducts from "./components/top-selling";
import { Sale } from "../../api/interfaces";

function Dashboard() {
  const django: DjangoClient = useApi();
  const [selectedPeriod, selectPeriod] = useState(PeriodOptions[0]);
  const [saleArr, setSaleArr] = useState<Sale[]>([]);
  const [loadState, setLoadState] = useState(LoadStates.Loading);

  useEffect(() => {
    const startDate = selectedPeriod.startDate.format(ISO_DATE_FORMAT);
    django.getSales(startDate, null).then((response) => {
      if (response.status === RequestStatus.Success) {
        setSaleArr(response.data);
        setLoadState(LoadStates.Success);
      } else {
        setLoadState(LoadStates.Failure);
      }
    });
  }, [django, selectedPeriod]);

  const handlePeriodOptionSelected = (period: PeriodOption) => {
    selectPeriod(period);
  };

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <h1 className="font-semibold text-3xl text-colorBlack/80 flex flex-row items-center">
          <MdDashboard />
          Dashboard
        </h1>
        <PeriodDropdown
          id="dashboard"
          onPeriodOptionSelected={handlePeriodOptionSelected}
        />
      </div>
      <br />
      <SummaryCards
        saleArr={saleArr}
        componentLoadState={loadState}
        period={selectedPeriod}
      />
      <br />
      <br />
      <div className="grid grid-rows-2  md:grid-cols-[2fr_1fr] md:grid-rows-1 items-center">
        <SalesChart period={selectedPeriod} />
        <SalesPie saleArr={saleArr} componentLoadState={loadState} />
      </div>
      <br />
      <div>
        <TopSellingProducts period={selectedPeriod} />
      </div>
      <br />
      <br />
      <br />
    </div>
  );
}

export default Dashboard;
