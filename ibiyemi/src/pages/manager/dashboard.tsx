import { useState } from "react";
import PeriodDropdown from "../../components/PeriodDropdown";
import {
  PeriodOption,
  ISO_DATE_FORMAT,
  LoadStates,
  PeriodOptions,
} from "../../constants/constants";
import { MdDashboard } from "react-icons/md";
import SummaryCards from "./components/summary-cards";
import SalesChart from "./components/sales-chart";
import SalesPie from "./components/sales-pie";
import TopSellingProducts from "./components/top-selling";

function Dashboard() {
  const [selectedPeriod, selectPeriod] = useState(PeriodOptions[0]);

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
      <SummaryCards period={selectedPeriod} />
      <br />
      <br />
      <div className="grid grid-rows-2  md:grid-cols-[2fr_1fr] md:grid-rows-1 items-center">
        <SalesChart period={selectedPeriod} />
        <SalesPie period={selectedPeriod} />
      </div>
      <br />
      <div>
        <TopSellingProducts />
      </div>
      <br />
      <br />
      <br />
    </div>
  );
}

export default Dashboard;
