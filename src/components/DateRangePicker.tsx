import dayjs, { Dayjs } from "dayjs";
import React from "react";
import {
  dateStringToDayjs,
  dayJsToDateString,
} from "../helpers/format-helpers";

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
    const newDate = element.value;
    if (element.id === "startDate") {
      onChange({ startDate: dayjs(newDate), endDate: dateRange.endDate });
    } else {
      onChange({ startDate: dateRange.startDate, endDate: dayjs(newDate) });
    }
  }

  return (
    <div className="flex flex-row items-center">
      <input
        id="startDate"
        className="border-colorPrimary rounded p-1"
        type="date"
        value={dayJsToDateString(dateRange.startDate)}
        onChange={handleChange}
      />
      <span className="mx-1">-</span>
      <input
        id="endDate"
        className="border-colorPrimary rounded p-1"
        type="date"
        value={dayJsToDateString(dateRange.endDate)}
        onChange={handleChange}
      />
    </div>
  );
}
