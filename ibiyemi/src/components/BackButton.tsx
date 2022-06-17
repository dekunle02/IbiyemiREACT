import { useNavigate } from "react-router-dom";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";

function BackButton() {
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
      className="p-3 mx-2 rounded-full text-2xl md:hover:bg-colorBlack/10 active:bg-colorBlack/20"
    >
      <HiOutlineArrowNarrowLeft />
    </button>
  );
}

export default BackButton;
