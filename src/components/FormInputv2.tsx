import React, { useState } from "react";

import { GrFormView } from "react-icons/gr";
import { GrFormViewHide } from "react-icons/gr";
import { IoAlertCircleSharp } from "react-icons/io5";

function formatMoneyDigits(amount: string | number): string {
  const convertedAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-NG").format(convertedAmount);
}

interface FormInputProps
  extends React.InputHTMLAttributes<
    HTMLDivElement | HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  > {
  id: string;
  label?: string;
  showError?: boolean;
  errorMessage?: string;
  isRequired?: boolean;
  type?: string;
  children?: React.ReactNode;
}

function FormInput({
  id,
  label,
  showError,
  errorMessage,
  isRequired,
  type,
  name,
  children,
  ...otherProps
}: FormInputProps): JSX.Element {
  const [isVisible, setVisibility] = useState(false);
  const initialType = type;

  // MONEY FIELDS CHANGES
  const displayedMoneyValue = formatMoneyDigits(otherProps.value as string);
  const handleMoneyFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const field = event.target as HTMLInputElement;
    let initialFieldValue = field.value;
    if (initialFieldValue === "") initialFieldValue = "0";
    const deformattedMoneyValue =
      parseFloat(initialFieldValue.replace(",", "")) ?? 0;
    const mappedEvent = { ...event };
    mappedEvent.target.value = deformattedMoneyValue.toString();
    otherProps.onChange?.(mappedEvent);
  };

  return (
    <div className="relative flex-grow flex flex-col">
      {/* LABEL */}
      <label
        className={`mb-1 ml-1 font-semibold ${
          isRequired ? "after:content-['*'] after:text-colorRed" : ""
        }`}
        htmlFor={id}
      >
        {label}
      </label>

      {/* INPUT */}

      {type === "textarea" && (
        <textarea
          className={`${
            showError ? "ring-2 ring-colorRed border border-colorRed" : "border"
          } w-full rounded-xl p-2 focus:border-colorPrimary focus:ring-colorPrimary focus:ring-2`}
          id={id}
          {...otherProps}
        />
      )}
      {type === "money" && (
        <input
          className={`${
            showError ? "ring-2 ring-colorRed border border-colorRed" : "border"
          } w-full rounded-xl p-2  focus:border-colorPrimary focus:ring-colorPrimary focus:ring-2`}
          type="text"
          id={id}
          name={name}
          value={displayedMoneyValue}
          onChange={handleMoneyFieldChange}
        />
      )}
      {type !== "textarea" && type !== "money" && (
        <input
          className={`${
            showError ? "ring-2 ring-colorRed border border-colorRed" : "border"
          } w-full rounded-xl p-2  focus:border-colorPrimary focus:ring-colorPrimary focus:ring-2`}
          type={isVisible ? "text" : initialType}
          id={id}
          name={name}
          {...otherProps}
        />
      )}

      {/* ERROR MESSAGE */}
      <div
        className={`text-colorRed flex flex-row items-center transition-all duration-100 
      ${showError ? "scale-100 my-2 " : "scale-0"}`}
      >
        <IoAlertCircleSharp className="text-lg" />
        <p className="text-sm text-right">&nbsp;&nbsp;{errorMessage}</p>
      </div>

      {/* PASSWORD VISIBILITY TOGGLE */}
      {type === "password" ? (
        <div
          className="text-lg absolute top-10 right-4 cursor-pointer"
          onClick={() => setVisibility(!isVisible)}
        >
          {isVisible ? <GrFormViewHide /> : <GrFormView />}
        </div>
      ) : null}
      {children}
    </div>
  );
}

function FormSelectInput({
  id,
  label,
  showError,
  errorMessage,
  children,
  isRequired,
  className,
  ...otherProps
}: FormInputProps): JSX.Element {
  return (
    <div className="relative flex-grow flex flex-col">
      {/* LABEL */}
      <label
        className={`mb-1 ml-1 font-semibold ${
          isRequired ? "after:content-['*'] after:text-colorRed" : ""
        }`}
        htmlFor={id}
      >
        {label}
      </label>

      {/* INPUT */}
      <select
        className="border w-full rounded-xl p-2 focus:border-colorPrimary focus:ring-colorPrimary focus:ring-2"
        id={id}
        {...otherProps}
      >
        {children}
      </select>

      {/* ERROR MESSAGE */}
      <div
        className={`top-full flex flex-row items-center transition-all duration-100  ${
          showError ? "scale-100 " : "scale-0"
        }`}
      >
        <IoAlertCircleSharp className="text-colorRed text-lg" />
        <p className="text-colorRed text-sm">&nbsp;&nbsp;{errorMessage}</p>
      </div>
    </div>
  );
}

export { FormInput, FormSelectInput };
