import { useNavigate } from "react-router-dom";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";

type BackButtonProps = {
  relative?: boolean;
};

function BackButton({ relative }: BackButtonProps) {
  const navigate = useNavigate();

  const navigateBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <button
      onClick={navigateBack}
      className={`p-3 mx-2 rounded-full text-2xl md:hover:bg-colorBlack/10 active:bg-colorBlack/20 
      ${relative ? "" : "absolute top-0 left-2 md:left-10"}`}
    >
      <HiOutlineArrowNarrowLeft />
    </button>
  );
}

export default BackButton;
