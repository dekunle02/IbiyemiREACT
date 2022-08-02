import { HiOutlineRefresh } from "react-icons/hi";

function LoadFailedMessage(): JSX.Element {
  return (
    <div className="w-full px-5 py-10 bg-colorBlack/5 rounded-lg">
      <button
        onClick={() => window.location.reload()}
        className="icon-button mx-auto"
      >
        <HiOutlineRefresh />
        An Error occured while attempting to Load this Information. Click to
        Refresh.
      </button>
    </div>
  );
}

export default LoadFailedMessage;
