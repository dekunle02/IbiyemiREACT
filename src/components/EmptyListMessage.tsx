interface EmptyListProps {
  message?: string;
}

function EmptyListMessage({ message }: EmptyListProps): JSX.Element {
  const defaultMessage = "Nothing to See Here...";
  return (
    <div className="px-5 py-10 m-3 bg-colorBlack/5 rounded-lg text-center text-xl text-colorBlack/30">
      <p>{message ? message : defaultMessage}</p>
    </div>
  );
}

export default EmptyListMessage;
