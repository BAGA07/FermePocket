import { TrendingUp, TrendingDown } from "lucide-react";

export default function CardDataStats({ title, total, rate, icon, trend, color = "blue" }) {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-50 border-blue-200",
    green: "text-green-600 bg-green-50 border-green-200",
    orange: "text-orange-600 bg-orange-50 border-orange-200",
    red: "text-red-600 bg-red-50 border-red-200",
    purple: "text-purple-600 bg-purple-50 border-purple-200"
  };

  const iconColorClasses = {
    blue: "text-blue-500 bg-blue-100",
    green: "text-green-500 bg-green-100",
    orange: "text-orange-500 bg-orange-100",
    red: "text-red-500 bg-red-100",
    purple: "text-purple-500 bg-purple-100"
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconColorClasses[color]}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colorClasses[color]}`}>
          {trend === "up" ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {rate}
        </div>
      </div>

      <h4 className="text-sm font-medium text-gray-600 mb-2">{title}</h4>
      <p className="text-3xl font-bold text-gray-900">{total}</p>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Ce mois</span>
          <span className={`font-medium ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
            {trend === "up" ? "↗" : "↘"} {rate}
          </span>
        </div>
      </div>
    </div>
  );
}
