import { useState, useEffect } from "react";
import { Egg, Thermometer, Droplets, RefreshCw, Plus, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function CouveuseCard() {
  const [couveuses, setCouveuses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = "http://127.0.0.1:8000/api/couveuses";

  const loadCouveuses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL, { credentials: "include" }); // Sanctum
      if (!res.ok) throw new Error("Erreur API");
      const data = await res.json();
      setCouveuses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCouveuses();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "text-green-600";
      case "standby": return "text-gray-500";
      case "maintenance": return "text-yellow-600";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center gap-2 font-semibold text-gray-800">
          <Egg className="w-5 h-5 text-green-600" />
          Couveuses
        </h3>
        <button
          onClick={loadCouveuses}
          disabled={isLoading}
          className="p-2 text-gray-500 hover:text-green-600 rounded-lg"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Erreur */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Loading */}
      {isLoading && <p className="text-gray-500 text-sm">Chargement...</p>}

      {/* Liste couveuses */}
      <div className="space-y-3">
        {couveuses.map((c) => (
          <div key={c.id} className="p-3 border rounded-lg hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-800">{c.nom}</h4>
              <span className={`text-sm font-medium ${getStatusColor(c.statut)}`}>
                {c.statut}
              </span>
            </div>

            <div className="mt-1 text-sm text-gray-600 space-y-1">
              <p>Capacité : {c.capacite} œufs</p>
              <p>Occupation : {c.occupation_actuelle} ({c.taux_occupation}%)</p>
              <p className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-gray-500" />
                {c.temperature_actuelle ?? "-"}°C
                <Droplets className="w-4 h-4 text-gray-500 ml-2" />
                {c.humidite_actuelle ?? "-"}%
              </p>
              <p>Lots actifs : {c.lots_actifs}</p>
              <p className="text-xs text-gray-400">Dernier relevé : {c.dernier_releve}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <Link
          to="/couveuse/ajouter"
          className="flex-1 bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700 text-sm"
        >
          <Plus className="w-4 h-4 inline" /> Nouveau lot
        </Link>
        <Link
          to="/couveuse"
          className="flex-1 bg-gray-100 text-gray-700 text-center py-2 rounded-lg hover:bg-gray-200 text-sm"
        >
          <Settings className="w-4 h-4 inline" /> Gérer
        </Link>
      </div>
    </div>
  );
}
