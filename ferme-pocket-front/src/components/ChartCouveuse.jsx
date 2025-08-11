import ReactApexChart from "react-apexcharts";
import { useState } from "react";

export default function ChartCouveuse() {
  const [state] = useState({
    series: [
      {
        name: "Œufs éclos",
        data: [12, 18, 25, 20, 30, 28, 35],
      },
    ],
    options: {
      chart: { type: "bar", toolbar: { show: false } },
      colors: ["#FBBF24"],
      xaxis: { categories: ["S1", "S2", "S3", "S4", "S5", "S6", "S7"] },
    },
  });

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h4 className="text-lg font-semibold mb-4">Éclosions par semaine</h4>
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="bar"
        height={300}
      />
    </div>
  );
}
