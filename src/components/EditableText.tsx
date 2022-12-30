import React, { useState } from "react";
import { MdEdit, MdCancel } from "react-icons/md";
import { IoIosSave } from "react-icons/io";

interface EditableTextProps
  extends React.InputHTMLAttributes<
    HTMLDivElement | HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  > {
  id: string;
  text: string;
  inputType: string;
  onEditSaved: (id: string, value: string) => void;
  onEditChanged?: (id: string, value: string) => void;
}

/**
 * id: the unique Id used to identify the Text and serves as reference in the callbacks
 * children: the content of the editable Text; a simple HTMLString
 * inputType: the input type of the form created
 *  className: styling of the text, inteded to be used as the typical React className prop
 *  onEditSaved: callback that is called with : id, value : when the Text is Saved
 *  onEditChanged: optional callback that is called with :id, value : when the Text changes
 */
export default function EditableText({
  id,
  inputType,
  text,
  onEditSaved,
  onEditChanged,
  className,
}: EditableTextProps) {
  const Mode = {
    READ: "read",
    WRITE: "write",
  };
  const [mode, setMode] = useState(Mode.READ);
  const [value, setValue] = useState(text);

  function toggleMode() {
    if (mode === Mode.READ) return setMode(Mode.WRITE);
    return setMode(Mode.READ);
  }

  function handleChange(event: React.ChangeEvent) {
    const target = event.target as HTMLInputElement;
    setValue(target.value);
    if (onEditChanged) {
      onEditChanged(id, target.value);
    }
  }

  function saveChanges(event: React.FormEvent) {
    event.preventDefault();
    if (value === text || value === "" || !value) {
      setValue(text);
    } else {
      onEditSaved(id, value.trim());
    }
    setMode(Mode.READ);
  }

  function discardChanges() {
    setValue(text);
    setMode(Mode.READ);
  }

  return (
    <div className="flex flex-grow">
      {mode === Mode.READ && (
        <span
          className={`cursor-pointer flex flex-row flex-wrap items-center ${className}`}
          onClick={toggleMode}
        >
          {value}
          <button
            className="text-sm scale-100 transition-all duration-200 
                        bg-colorWhite/50 hover:scale-105 p-2 rounded-full"
          >
            <MdEdit />
          </button>
        </span>
      )}

      {mode === Mode.WRITE && (
        <form className="flex flex-col w-full" onSubmit={saveChanges}>
          {inputType === "textarea" ? (
            <textarea
              className={`px-2 py-1 rounded-xl bg-colorWhite text-colorBlack ${className}`}
              onChange={handleChange}
              id={id}
              value={value}
              autoFocus
            />
          ) : (
            <input
              className={`px-2 py-1 rounded-xl bg-colorWhite text-colorBlack ${className}`}
              onChange={handleChange}
              value={value}
              type={inputType}
              autoFocus
            />
          )}

          <div className="z-[8] my-2 flex flex-row gap-2">
            <button
              type="button"
              onClick={discardChanges}
              className="flex flex-row items-center border bg-colorWhite rounded-2xl p-1 px-3 gap-x-2
                             hover:scale-105"
            >
              <MdCancel />
              <span>Discard</span>
            </button>
            <button
              type="submit"
              className="flex flex-row items-center rounded-2xl p-1 px-3 gap-x-2
                            bg-colorGreen/40 text-colorPrimaryDark hover:scale-105"
            >
              <IoIosSave />
              <span>Save</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
