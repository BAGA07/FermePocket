import { useState, useEffect } from "react";
import { ArrowLeft, TrendingUp, TrendingDown, Activity, Egg, Thermometer, Droplets, Calendar, AlertTriangle, CheckCircle, Info, Plus, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { couveuseService } from "../api/couveuse";
import { ensureAuthenticated } from "../utils/auth-helper";

export default function CouveuseDashboard() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("7j");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les données du dashboard
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // S'assurer que l'utilisateur est authentifié
      await ensureAuthenticated();

      const data = await couveuseService.getDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('Erreur lors du chargement du dashboard:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 300000000);

    // Actualiser les données toutes les 30 secondes
    const dataTimer = setInterval(() => {
      loadDashboardData();
    }, 300000000); // 5 minutes

    return () => {
      clearInterval(timer);
      clearInterval(dataTimer);
    };
  }, []);

  const getStatutColor = (statut) => {
    switch (statut) {
      case "active": return "bg-green-100 text-green-800";
      case "maintenance": return "bg-yellow-100 text-yellow-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatutText = (statut) => {
    switch (statut) {
      case "active": return "Active";
      case "maintenance": return "Maintenance";
      case "inactive": return "Inactive";
      default: return "Inconnu";
    }
  };

  const getAlerteIcon = (type) => {
    switch (type) {
      case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "error": return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "info": return <Info className="w-4 h-4 text-blue-500" />;
      case "success": return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAlerteColor = (type) => {
    switch (type) {
      case "warning": return "border-yellow-400 bg-yellow-50";
      case "error": return "border-red-400 bg-red-50";
      case "info": return "border-blue-400 bg-blue-50";
      case "success": return "border-green-400 bg-green-50";
      default: return "border-gray-400 bg-gray-50";
    }
  };

  // Affichage du chargement
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des données...</p>
          </div>
        </div>
      </div>
    );
  }

  // Affichage de l'erreur
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Erreur de chargement</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Vérifier que les données sont disponibles
  if (!dashboardData) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/couveuse")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Couveuses</h1>
            <p className="text-gray-600">Vue d'ensemble de toutes les couveuses</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Temps actuel</div>
            <div className="text-lg font-mono font-medium">
              {currentTime.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
          </div>

          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="7j">7 derniers jours</option>
            <option value="30j">30 derniers jours</option>
            <option value="90j">90 derniers jours</option>
          </select>
        </div>
      </div>

      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Egg className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total lots</p>
            <p className="text-2xl font-bold text-gray-900">{dashboardData.statistiques.total_lots}</p>
          </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-600">+2 ce mois</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 rounded-lg">
            <Activity className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Lots actifs</p>
            <p className="text-2xl font-bold text-gray-900">{dashboardData.statistiques.lots_actifs}</p>
          </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${dashboardData.statistiques.total_lots > 0 ? (dashboardData.statistiques.lots_actifs / dashboardData.statistiques.total_lots) * 100 : 0}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-600">
            {dashboardData.statistiques.total_lots > 0 ? Math.round((dashboardData.statistiques.lots_actifs / dashboardData.statistiques.total_lots) * 100) : 0}%
          </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Taux de réussite</p>
            <p className="text-2xl font-bold text-gray-900">{dashboardData.statistiques.taux_reussite}%</p>
          </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-600">+5.2% vs mois dernier</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 rounded-lg">
            <CheckCircle className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Œufs éclos</p>
            <p className="text-2xl font-bold text-gray-900">{dashboardData.statistiques.oeufs_eclos}</p>
          </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full"
              style={{ width: `${dashboardData.statistiques.total_oeufs > 0 ? (dashboardData.statistiques.oeufs_eclos / dashboardData.statistiques.total_oeufs) * 100 : 0}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-600">
            {dashboardData.statistiques.total_oeufs > 0 ? Math.round((dashboardData.statistiques.oeufs_eclos / dashboardData.statistiques.total_oeufs) * 100) : 0}%
          </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* État des couveuses */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">État des couveuses</h3>
            <button
              onClick={() => navigate("/couveuse/gestion")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              Gestion des couveuses
            </button>
          </div>
          <div className="space-y-4">
            {dashboardData.couveuses.map((couveuse) => (
              <div key={couveuse.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-gray-600">{couveuse.id}</span>
              </div>
              <div>
                <h4 className="font-medium">{couveuse.nom}</h4>
                <p className="text-sm text-gray-600">Capacité: {couveuse.capacite} œufs</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-sm text-gray-600">Occupation</div>
                <div className="font-medium">{couveuse.occupation || 0}/{couveuse.capacite}</div>
              </div>

              {couveuse.statut === "active" && (
                <>
              <div className="text-center">
                <div className="text-sm text-gray-600">Température</div>
                <div className="font-medium text-blue-600">{couveuse.temperature || 'N/A'}°C</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Humidité</div>
                <div className="font-medium text-green-600">{couveuse.humidite || 'N/A'}%</div>
              </div>
                </>
              )}

              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatutColor(couveuse.statut)}`}>
                {getStatutText(couveuse.statut)}
              </span>
            </div>
              </div>
            ))}
          </div>
            </div>
          </div>

          {/* Alertes et échéances */}
          <div className="space-y-6">
            {/* Alertes récentes */}
            <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Alertes récentes</h3>
          <div className="space-y-3">
            {dashboardData.alertes.slice(0, 3).map((alerte) => (
              <div
            key={alerte.id}
            className={`p-3 rounded-lg border-l-4 ${getAlerteColor(alerte.type)}`}
              >
            <div className="flex items-start gap-2">
              {getAlerteIcon(alerte.type)}
              <div className="flex-1">
                <div className="text-sm font-medium">{alerte.message}</div>
                <div className="text-xs text-gray-600 mt-1">{alerte.couveuse}</div>
                {alerte.valeur && (
              <div className="text-xs text-gray-500 mt-1">
                {alerte.valeur} {alerte.seuil && `(Seuil: ${alerte.seuil})`}
              </div>
                )}
              </div>
            </div>
              </div>
            ))}
          </div>
            </div>

            {/* Prochaines échéances */}
            <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Prochaines échéances</h3>
          <div className="space-y-3">
            {dashboardData.alertes && dashboardData.alertes.length > 0 ? (
              <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Fonctionnalité en cours de développement</p>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Aucune échéance à venir</p>
              </div>
            )}
          </div>
            </div>
          </div>
        </div>

        {/* Graphiques d'évolution */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-6">Évolution des paramètres ({selectedPeriod})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Graphique température */}
          <div>
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-blue-500" />
              Température moyenne (°C)
            </h4>
            <div className="h-48 flex items-end justify-between gap-1">
              {dashboardData.evolution && dashboardData.evolution.temperature ? (
                dashboardData.evolution.temperature.map((temp, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${temp ? ((temp - 35) / 5) * 100 : 0}%` }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-1">{temp || 'N/A'}°C</div>
                    <div className="text-xs text-gray-400">{dashboardData.evolution.dates[index]}</div>
                  </div>
                ))
              ) : (
                <div className="w-full flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Thermometer className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Données en cours de chargement...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Graphique humidité */}
          <div>
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-green-500" />
              Humidité moyenne (%)
            </h4>
            <div className="h-48 flex items-end justify-between gap-1">
              {dashboardData.evolution && dashboardData.evolution.humidite ? (
                dashboardData.evolution.humidite.map((hum, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-green-500 rounded-t"
                      style={{ height: `${hum ? (hum / 100) * 100 : 0}%` }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-1">{hum || 'N/A'}%</div>
                    <div className="text-xs text-gray-400">{dashboardData.evolution.dates[index]}</div>
                  </div>
                ))
              ) : (
                <div className="w-full flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Droplets className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Données en cours de chargement...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/couveuse/ajouter")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nouveau lot
          </button>
          <button
            onClick={() => navigate("/couveuse")}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Voir tous les lots
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Maintenance
          </button>
        </div>
      </div>
    </div>
  );
}
