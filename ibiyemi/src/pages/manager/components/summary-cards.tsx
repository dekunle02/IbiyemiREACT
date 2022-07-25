import { useState, useEffect } from "react";
import { useApi } from "../../../context/AuthContext";
import {
  LoadStates,
  PeriodOption,
  ISO_DATE_FORMAT,
} from "../../../constants/constants";
import { DjangoClient, RequestStatus } from "../../../api/django";

interface SummaryCardProps {
  period: PeriodOption;
}

function SummaryCards({ period }: SummaryCardProps) {
  const django: DjangoClient = useApi();
  const [saleArr, setSaleArr] = useState([]);
  const [loadState, setLoadState] = useState(LoadStates.Loading);

  useEffect(() => {
    const startDate = period.startDate.format(ISO_DATE_FORMAT);
    django.getSales(startDate, null).then((response) => {
      if (response.status === RequestStatus.Success) {
        console.log(response.data);
      } else {
        setLoadState(LoadStates.Failure);
      }
    });
  }, [django, period]);

  // period.startDate.format(ISO_DATE_FORMAT)
  return (
    <div className="flex flex-row gap-3 flex-wrap md:flex-nowrap">
      <div className="rounded-xl p-2 flex flex-col w-full bg-pink-100 text-pink-900">
        <h3 className="font-semibold text-xl text-pink-900/80">Profit</h3>
        <span className="text-4xl text-center py-4">$4,000</span>
        <span className="text-right font-light">Last 7 days</span>
      </div>

      <div className="rounded-xl p-2 flex flex-col w-full bg-sky-100 text-sky-900">
        <h3 className="font-semibold text-xl text-sky-900/80">Sales Made</h3>
        <span className="text-4xl text-center py-4">56</span>
        <span className="text-right font-light">Last 7 days</span>
      </div>
      <div className="rounded-xl p-2 flex flex-col w-full bg-amber-100 text-amber-900">
        <h3 className="font-semibold text-xl text-amber-900/80">
          Total Revenue
        </h3>
        <span className="text-4xl text-center py-4">$4,000</span>
        <span className="text-right font-light">Last 7 days</span>
      </div>
    </div>
  );
}

export default SummaryCards;
