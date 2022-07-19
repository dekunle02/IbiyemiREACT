import { useState, useEffect } from "react";
import { LoadStates } from "../../constants/constants";

function SummaryCards() {
  return (
    <div className="flex flex-row gap-3">
      <div className="card flex flex-col max-w-6xl bg-orange-200">
        <h3 className="font-semibold text-lg text-colorBlack/80">Profit</h3>
        <h5 className="text-3xl text-center font-mono">$4,000</h5>
        <h6>Last 7 days</h6>
      </div>

      <div className="card flex flex-col max-w-6xl ">
        <h3>Total Revenue</h3>
        <h5>$4,000</h5>
        <h6>Last 7 days</h6>
      </div>

      <div className="card flex flex-col max-w-6xl ">
        <h3>Sales Made</h3>
        <h5>7</h5>
        <h6>Last 7 days</h6>
      </div>
    </div>
  );
}

export default SummaryCards;
