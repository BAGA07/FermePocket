import { useState, useEffect } from "react";
import { Egg, Thermometer, Droplets, Clock, TrendingUp, AlertTriangle, RefreshCw, Plus, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function CouveuseCard() {
  const [couveuses, setCouveuses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Charger les données des couveuses
  const loadCouveusesData = async () => {
    setIsLoading(true);
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockCouveuses = [
        {
          id: 1,
          nom: "Couveuse A",
          status: "active",
          nbLots: 2,
          nbOeufs: 270,
          temperature: 37.5 + (Math.random() - 0.5) * 0.6, // Variation ±0.3°C
          humidity: 65 + (Math.random() - 0.5) * 6, // Variation ±3%
          alertes: Math.floor(Math.random() * 3), // 0-2 alertes
          lastMaintenance: "2024-01-15",
          efficiency: 92 + (Math.random() - 0.5) * 8 // 88-96%
        },
        {
          id: 2,
          nom: "Couveuse B",
          status: "active",
          nbLots: 1,
          nbOeufs: 80,
          temperature: 37.8 + (Math.random() - 0.5) * 0.6,
          humidity: 68 + (Math.random() - 0.5) * 6,
          alertes: Math.floor(Math.random() * 2),
          lastMaintenance: "2024-01-10",
          efficiency: 89 + (Math.random() - 0.5) * 8
        },
        {
          id: 3,
          nom: "Couveuse C",
          status: "standby",
          nbLots: 0,
          nbOeufs: 0,
          temperature: 25.0,
          humidity: 45,
          alertes: 0,
          lastMaintenance: "2024-01-20",
          efficiency: 0
        },
        {
          id: 4,
          nom: "Couveuse D",
          status: Math.random() > 0.7 ? "maintenance" : "active",
          nbLots: Math.floor(Math.random() * 2),
          nbOeufs: Math.floor(Math.random() * 150),
          temperature: 37.2 + (Math.random() - 0.5) * 0.6,
          humidity: 62 + (Math.random() - 0.5) * 6,
          alertes: Math.floor(Math.random() * 2),
          lastMaintenance: "2024-01-18",
          efficiency: 85 + (Math.random() - 0.5) * 10
        }
      ];

      setCouveuses(mockCouveuses);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erreur lors du chargement des couveuses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les données au montage et toutes les 2 minutes
  useEffect(() => {
    loadCouveusesData();
    const interval = setInterval(loadCouveusesData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Fonction pour rafraîchir manuellement
  const handleRefresh = () => {
    loadCouveusesData();
  };

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-200";
      case "standby": return "bg-gray-100 text-gray-800 border-gray-200";
      case "error": return "bg-red-100 text-red-800 border-red-200";
      case "maintenance": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Fonction pour obtenir le texte du statut
  const getStatusText = (status) => {
    switch (status) {
      case "active": return "Active";
      case "standby": return "En attente";
      case "error": return "Erreur";
      case "maintenance": return "Maintenance";
      default: return "Inconnu";
    }
  };

  // Fonction pour obtenir l'icône du statut
  const getStatusIcon = (status) => {
    switch (status) {
      case "active": return <TrendingUp className="w-4 h-4" />;
      case "standby": return <Clock className="w-4 h-4" />;
      case "error": return <AlertTriangle className="w-4 h-4" />;
      case "maintenance": return <Settings className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // Fonction pour obtenir la couleur de la température
  const getTemperatureColor = (temp) => {
    if (temp < 36.5 || temp > 38.5) return "text-red-500";
    if (temp < 37.0 || temp > 38.0) return "text-yellow-500";
    return "text-green-500";
  };

  // Fonction pour obtenir la couleur de l'humidité
  const getHumidityColor = (humidity) => {
    if (humidity < 55 || humidity > 75) return "text-red-500";
    if (humidity < 60 || humidity > 70) return "text-yellow-500";
    return "text-green-500";
  };

  // Calculer les totaux
  const totalOeufs = couveuses.reduce((sum, couveuse) => sum + couveuse.nbOeufs, 0);
  const totalLots = couveuses.reduce((sum, couveuse) => sum + couveuse.nbLots, 0);
  const totalAlertes = couveuses.reduce((sum, couveuse) => sum + couveuse.alertes, 0);
  const activeCouveuses = couveuses.filter(c => c.status === "active").length;
  const averageEfficiency = couveuses.length > 0 ?
    Math.round(couveuses.reduce((sum, c) => sum + c.efficiency, 0) / couveuses.length) : 0;

  // Formater la date de dernière mise à jour
  const formatLastUpdate = (date) => {
    if (!date) return "Jamais";
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60);

    if (diff < 1) return "À l'instant";
    if (diff < 60) return `Il y a ${diff} min`;
    return `Il y a ${Math.floor(diff / 60)}h`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Egg className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Couveuses</h3>
            <p className="text-sm text-gray-500">Gestion de l'incubation</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
            title="Actualiser les données"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/couveuse"
            className="text-green-600 hover:text-green-700 text-sm font-medium hover:underline"
          >
            Voir tout →
          </Link>
        </div>
      </div>

      {/* Informations de mise à jour */}
      {lastUpdate && (
        <div className="text-xs text-gray-500 mb-4 text-center">
          Dernière mise à jour: {formatLastUpdate(lastUpdate)}
        </div>
      )}

      {/* Statistiques rapides */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{totalOeufs}</p>
          <p className="text-xs text-gray-500">Total œufs</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{totalLots}</p>
          <p className="text-xs text-gray-500">Lots actifs</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{activeCouveuses}</p>
          <p className="text-xs text-gray-500">Couveuses actives</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{averageEfficiency}%</p>
          <p className="text-xs text-gray-500">Efficacité moy.</p>
        </div>
      </div>

      {/* Liste des couveuses */}
      <div className="space-y-3">
        {couveuses.map((couveuse) => (
          <div
            key={couveuse.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
            onClick={() => window.location.href = `/couveuse`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${getStatusColor(couveuse.status)}`}>
                {getStatusIcon(couveuse.status)}
              </div>
              <div>
                <h4 className="font-medium text-gray-900 group-hover:text-green-700 transition-colors">
                  {couveuse.nom}
                </h4>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{couveuse.nbLots} lot(s)</span>
                  <span>{couveuse.nbOeufs} œuf(s)</span>
                  {couveuse.efficiency > 0 && (
                    <span className="text-green-600 font-medium">{couveuse.efficiency}%</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {couveuse.status === "active" && (
                <>
                  <div className="flex items-center gap-1 text-xs">
                    <Thermometer className="w-3 h-3" />
                    <span className={getTemperatureColor(couveuse.temperature)}>
                      {couveuse.temperature.toFixed(1)}°C
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Droplets className="w-3 h-3" />
                    <span className={getHumidityColor(couveuse.humidity)}>
                      {couveuse.humidity.toFixed(0)}%
                    </span>
                  </div>
                </>
              )}

              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(couveuse.status)}`}>
                {getStatusText(couveuse.status)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Actions rapides */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Link
            to="/couveuse/ajouter"
            className="flex-1 bg-green-600 text-white text-center py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nouveau lot
          </Link>
          <Link
            to="/couveuse"
            className="flex-1 bg-gray-100 text-gray-700 text-center py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Gérer
          </Link>
        </div>
      </div>
    </div>
  );
}
