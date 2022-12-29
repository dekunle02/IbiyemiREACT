import { Dayjs } from "dayjs";
import React from "react";
import { dayJsToDateString } from "../helpers/format-helpers";

interface DateRangePickerProps {
  dateRange: DateRange;
  onChange: (dateRange: DateRange) => void;
}

export interface DateRange {
  startDate: Dayjs;
  endDate: Dayjs;
}

export default function DateRangePicker(props: DateRangePickerProps) {
  const { dateRange, onChange } = props;

  function handleChange(event: React.ChangeEvent) {
    const element = event.target as HTMLInputElement;
    if (element.id === "startDate") {
      onChange({ startDate: dateRange.startDate, endDate: dateRange.endDate });
    } else {
      onChange({ startDate: dateRange.startDate, endDate: dateRange.endDate });
    }
  }

  console.log(dayJsToDateString(dateRange.startDate));
  return (
    <div className="flex flex-row items-center">
      <input
        id="startDate"
        type="date"
        value={dayJsToDateString(dateRange.startDate)}
        onChange={handleChange}
      />
      <span>-</span>
      <input
        id="endDate"
        type="date"
        value={dayJsToDateString(dateRange.endDate)}
        onChange={handleChange}
      />
    </div>
  );
}
