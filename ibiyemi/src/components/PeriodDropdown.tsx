import { useState, useEffect } from "react";
import { PeriodOption, PeriodOptions } from "../constants/constants";

interface PeriodDropdownProps {
  id: string;
  onPeriodOptionSelected: (p: PeriodOption) => void;
}

function PeriodDropdown({
  id,
  onPeriodOptionSelected,
}: PeriodDropdownProps): JSX.Element {
  const [selectedOption, setSelectedOption] = useState(PeriodOptions[0]);
  const initialPeriod = PeriodOptions[0];

  const handleSelect = () => {};

  return (
    <select
      id={id}
      className="rounded-3xl p-2 px-3 focus:border-colorPrimary focus:ring-colorPrimary focus:ring-2"
      onChange={handleSelect}
      value={selectedOption?.id}
    >
      {/* <option value={selectedOption.id}>{selectedOption.text}</option> */}
      {PeriodOptions.map((option) => (
        <option key={option.id} value={option.id}>
          {option.text}
        </option>
      ))}
    </select>
  );
}

export default PeriodDropdown;
