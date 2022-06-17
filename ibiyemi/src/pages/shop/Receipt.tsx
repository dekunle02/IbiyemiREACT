import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useApi } from "../../context/AuthContext";

import { LoadStates } from "../../constants/constants";
import Spinner from "../../components/Spinner";
import LoadFailedMessage from "../../components/LoadFailedMessage";
import { RequestStatus } from "../../api/django";

function ReceiptPage() {
  const { id } = useParams();
  const django = useApi();
  const [receipt, setReceipt] = useState(null);
  const [loadState, setLoadState] = useState(LoadStates.Loading);

  useEffect(() => {
    if (id) {
      django.getReceipt(id).then((response) => {
        if (response.status === RequestStatus.Success) {
          setReceipt(response.data);
          setLoadState(LoadStates.Success);
        } else {
          setLoadState(LoadStates.Success);
        }
      });
    }
  }, [django, id]);

  console.log("receipt => ", receipt);

  return (
    <div>
      {loadState === LoadStates.Loading && <Spinner />}
      {loadState === LoadStates.Failure && <LoadFailedMessage />}
      {loadState === LoadStates.Success && (
        <>
          <span>HELLO WORLD</span>
        </>
      )}
    </div>
  );
}

export default ReceiptPage;
