import PeriodDropdown from "../../components/PeriodDropdown";
import {
  PeriodOption,
  ISO_DATE_FORMAT,
  LoadStates,
} from "../../constants/constants";
import SummaryCards from "./summary-cards";

function Dashboard() {
  const handlePeriodOptionSelected = (p: PeriodOption) => {
    console.log("selectedPeriod = ", p);
  };

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <h1 className="font-semibold text-3xl text-colorBlack/80 ">
          Dashboard
        </h1>
        <PeriodDropdown
          id="dashboard"
          onPeriodOptionSelected={handlePeriodOptionSelected}
        />
      </div>
      <SummaryCards />
    </div>
  );
}

export default Dashboard;
