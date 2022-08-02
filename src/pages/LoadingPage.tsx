import Spinner from "../components/Spinner";

function LoadingPage() {
  return (
    <div
      className="w-screen h-screen z-30 fixed top-0 right-0 
    bg-colorWhite flex flex-col justify-center items-center"
    >
      <div className="mx-auto my-auto md:w-1/2">
        <Spinner />
      </div>
    </div>
  );
}

export default LoadingPage;
