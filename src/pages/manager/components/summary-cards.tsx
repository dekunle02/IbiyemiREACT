import { useMemo } from "react";
import { LoadStates, PeriodOption } from "../../../constants/constants";
import { Sale } from "../../../api/interfaces";
import { formatMoney } from "../../../helpers/format-helpers";
import Spinner from "../../../components/Spinner";
import LoadFailedMessage from "../../../components/LoadFailedMessage";

interface SummaryCardProps {
  componentLoadState: LoadStates;
  saleArr: Sale[];
  period: PeriodOption;
}

function SummaryCards({
  componentLoadState,
  saleArr,
  period,
}: SummaryCardProps) {
  // period.startDate.format(ISO_DATE_FORMAT)

  const totalProfits: number = useMemo(() => {
    return saleArr.reduce(
      (previousValue: number, currentItem: Sale) =>
        previousValue + currentItem.profit,
      0
    );
  }, [saleArr]);

  const totalRevenue: number = useMemo(() => {
    return saleArr.reduce(
      (previousValue: number, currentItem: Sale) =>
        previousValue + currentItem.sell_price,
      0
    );
  }, [saleArr]);

  const totalSalesMade: number = saleArr.length;

  return (
    <div className="flex flex-row gap-3 flex-wrap md:flex-nowrap">
      <div className="rounded-xl p-2 flex flex-col w-full bg-pink-100 text-pink-900">
        <h3 className="font-semibold text-xl text-pink-900/80">Profit</h3>
        <span className="text-4xl text-center py-4">
          {componentLoadState === LoadStates.Loading && <Spinner />}
          {componentLoadState === LoadStates.Success &&
            formatMoney(totalProfits)}
          {componentLoadState === LoadStates.Failure && <LoadFailedMessage />}
        </span>
        <span className="text-right font-light">{period.text}</span>
      </div>

      <div className="rounded-xl p-2 flex flex-col w-full bg-sky-100 text-sky-900">
        <h3 className="font-semibold text-xl text-sky-900/80">Sales Made</h3>
        <span className="text-4xl text-center py-4">{totalSalesMade}</span>
        <span className="text-right font-light">{period.text}</span>
      </div>
      <div className="rounded-xl p-2 flex flex-col w-full bg-amber-100 text-amber-900">
        <h3 className="font-semibold text-xl text-amber-900/80">
          Total Revenue
        </h3>
        <span className="text-4xl text-center py-4">
          {formatMoney(totalRevenue)}
        </span>
        <span className="text-right font-light">{period.text}</span>
      </div>
    </div>
  );
}

export default SummaryCards;
