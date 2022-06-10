import Lottie from "lottie-react";
import animation from "../assets/animations/notfound.json";

function NotFoundPage() {
  return (
    <div
      className="w-screen h-screen z-30 fixed top-0 right-0 
    bg-colorWhite flex flex-col justify-center items-center"
    >
      <div className="mx-auto my-auto md:w-1/2">
        <Lottie animationData={animation} loop={false} autoplay />
      </div>
    </div>
  );
}

export default NotFoundPage;
