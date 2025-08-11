import ReactApexChart from "react-apexcharts";
import { useState } from "react";

export default function ChartOne() {
  const [state] = useState({
    series: [
      {
        name: "Ventes",
        data: [40, 55, 65, 50, 70, 90, 100],
      },
      {
        name: "Dépenses",
        data: [30, 35, 40, 60, 50, 65, 80],
      },
    ],
    options: {
      chart: {
        type: "line",
        height: 350,
        toolbar: { show: false },
      },
      colors: ["#10B981", "#EF4444"],
      stroke: {
        curve: "smooth",
        width: 3,
      },
      xaxis: {
        categories: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil"],
      },
      legend: { position: "top" },
    },
  });

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h4 className="text-lg font-semibold mb-4">Ventes & Dépenses</h4>
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="line"
        height={300}
      />
    </div>
  );
}
