import React, { useState } from "react";

import { GrFormView } from "react-icons/gr";
import { GrFormViewHide } from "react-icons/gr";
import { IoAlertCircleSharp } from "react-icons/io5";

interface FormInputProps
  extends React.InputHTMLAttributes<
    HTMLDivElement | HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  > {
  id: string;
  label?: string;
  showError?: boolean;
  errorMessage?: string;
  isRequired?: boolean;
  type: string;
  children?: React.ReactNode;
}

//React.InputHTMLAttributes<HTMLInputElement>

function FormInput({
  id,
  label,
  errorMessage,
  type,
  children,
  showError,
  isRequired,
  ...otherProps
}: FormInputProps): JSX.Element {
  const [isVisible, setVisibility] = useState(false);
  const initialType = type;

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
      {type === "textarea" ? (
        <textarea
          className={`${
            showError ? "ring-2 ring-colorRed border border-colorRed" : "border"
          } w-full rounded-lg p-2 focus:border-colorPrimary focus:ring-colorPrimary focus:ring-2`}
          id={id}
          {...otherProps}
        />
      ) : (
        <input
          className={`${
            showError ? "ring-2 ring-colorRed border border-colorRed" : "border"
          } w-full rounded-lg p-2  focus:border-colorPrimary focus:ring-colorPrimary focus:ring-2`}
          type={isVisible ? "text" : initialType}
          id={id}
          {...otherProps}
        />
      )}

      {/* ERROR MESSAGE */}
      <div
        className={`text-colorRed flex flex-row items-center transition-all duration-100 
      ${showError ? "scale-100 my-2 " : "hidden"}`}
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
        className="border w-full rounded-lg p-2 focus:border-colorPrimary focus:ring-colorPrimary focus:ring-2"
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
