import ReactApexChart from "react-apexcharts";
import { useState } from "react";

export default function ChartTwo() {
  const [state] = useState({
    series: [45, 25, 30],
    options: {
      chart: {
        type: "donut",
      },
      labels: ["Poulets", "Œufs", "Aliments"],
      colors: ["#10B981", "#FBBF24", "#3B82F6"],
      legend: { position: "bottom" },
    },
  });

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h4 className="text-lg font-semibold mb-4">Répartition des Stocks</h4>
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="donut"
        height={300}
      />
    </div>
  );
}
