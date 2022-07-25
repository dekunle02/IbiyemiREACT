import Chart from "react-apexcharts";

function SalesPie() {
  const chartConfig = {
    options: {},
    series: [44, 55, 41, 17],
    labels: ["Cash", "POS", "Transfer", "Other"],
  };
  return (
    <div>
      <Chart
        options={chartConfig.options}
        series={chartConfig.series}
        type="donut"
        width="380"
      />
    </div>
  );
}

export default SalesPie;
