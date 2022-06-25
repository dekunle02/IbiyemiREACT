import React, { useState, useEffect } from "react";
import { PeriodOption, PeriodOptions } from "../constants/constants";

interface PeriodDropdownProps {
  id: string;
  onPeriodOptionSelected: (p: PeriodOption) => void;
}

function PeriodDropdown({
  id,
  onPeriodOptionSelected,
}: PeriodDropdownProps): JSX.Element {
  const initialPeriod = PeriodOptions[0];
  const [selectedOption, setSelectedOption] = useState(initialPeriod);

  useEffect(() => {
    onPeriodOptionSelected(initialPeriod);
  }, [initialPeriod, onPeriodOptionSelected]);

  const handleSelect = (event: React.ChangeEvent) => {
    const target = event.target as HTMLSelectElement;
    const selectedOption = PeriodOptions.find((p) => p.id === target.value);
    if (selectedOption) {
      onPeriodOptionSelected(selectedOption);
      setSelectedOption(selectedOption);
    }
  };

  return (
    <select
      id={id}
      className="rounded-3xl py-2 pl-3 min-w-fit focus:border-colorPrimary focus:ring-colorPrimary focus:ring-2"
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
