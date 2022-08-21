import { MdClose } from "react-icons/md";
import { usePopup } from "../context/PopupContext";

type PopupCloseButtonProps = {
  relative?: boolean;
};

function PopupCloseButton({ relative }: PopupCloseButtonProps) {
  const popup = usePopup();

  return (
    <button
      onClick={() => {
        popup?.dismiss();
      }}
      className={`p-3 rounded-full text-2xl md:hover:bg-colorBlack/10 active:bg-colorBlack/20 
      ${relative ? "" : "absolute top-1 right-2 md:right-3"}`}
    >
      <MdClose />
    </button>
  );
}

export default PopupCloseButton;
