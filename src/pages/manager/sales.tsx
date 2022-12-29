import dayjs, { Dayjs } from "dayjs";
import DateRangePicker, { DateRange } from "../../components/DateRangePicker";
import { useState } from "react";
import { LoadStates } from "../../constants/constants";
import { MdPointOfSale } from "react-icons/md";

const Today = dayjs();
const LastWeek = Today.subtract(7, "day");

function Sales() {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: LastWeek,
    endDate: Today,
  });
  const [loadState, setLoadState] = useState(LoadStates.Loading);

  function handleDateChange(newDateRange: DateRange) {
    setLoadState(LoadStates.Loading);
    setDateRange(newDateRange);
    console.log("DateChanged");
  }

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <h1 className="font-semibold text-3xl text-colorBlack/80 flex flex-row items-center">
          <MdPointOfSale />
          Sales
        </h1>
        <DateRangePicker dateRange={dateRange} onChange={handleDateChange} />
      </div>
    </div>
  );
}

export default Sales;
