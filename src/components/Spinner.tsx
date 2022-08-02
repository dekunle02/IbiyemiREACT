import Lottie from "lottie-react";
import loadingAnimation from "../assets/animations/loading.json";

function Spinner() {
  return (
    <div className="my-auto mx-auto w-1/4">
      <Lottie animationData={loadingAnimation} loop autoplay />
    </div>
  );
}

export default Spinner;
