import { usePopup } from "../context/PopupContext";
import PopupCloseButton from "../components/PopupCloseButton";

type SimpleDialogProps = {
  title: string;
  body: string;
  positiveText?: string;
  positiveAction: Function;
  negativeText?: string;
  negativeAction?: Function;
};

function SimpleDialog({
  title,
  body,
  positiveText,
  positiveAction,
  negativeText,
  negativeAction,
}: SimpleDialogProps) {
  const popup = usePopup();

  const handlePositiveAction = () => {
    positiveAction();
    popup?.dismiss();
  };

  const handleNegativeAction = () => {
    if (negativeAction) negativeAction();
    popup?.dismiss();
  };

  return (
    <div className="popup-card">
      <PopupCloseButton />
      <h2 className="text-2xl">{title}</h2>
      <br />
      <h5 className="text-xl">{body}</h5>
      <br />
      <div className="flex gap-3 text-lg flex-row-reverse">
        <button onClick={handlePositiveAction} className="button p-1 px-3">
          {positiveText ?? "Confirm"}
        </button>
        <button onClick={handleNegativeAction}>
          {negativeText ?? "Cancel"}
        </button>
      </div>
    </div>
  );
}

export default SimpleDialog;
