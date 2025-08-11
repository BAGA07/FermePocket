import { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus, Eye, Edit, Trash2, Calendar, Egg, TrendingUp,
  AlertTriangle, CheckCircle, Clock, Thermometer, Droplets
} from "lucide-react";

export default function Couveuse() {
  const [lots, setLots] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Charger les données depuis Laravel
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/lots-couveuses")
      .then(res => {
        if (res.data.status === "success") {
          setLots(res.data.data);
        }
      })
      .catch(err => {
        console.error("Erreur chargement lots:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "en_cours": return "bg-blue-100 text-blue-800 border-blue-200";
      case "termine": return "bg-green-100 text-green-800 border-green-200";
      case "pause": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "erreur": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "en_cours": return <Clock className="w-4 h-4" />;
      case "termine": return <CheckCircle className="w-4 h-4" />;
      case "pause": return <AlertTriangle className="w-4 h-4" />;
      case "erreur": return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "en_cours": return "En cours";
      case "termine": return "Terminé";
      case "pause": return "En pause";
      case "erreur": return "Erreur";
      default: return "Inconnu";
    }
  };

  const filteredLots = lots.filter(lot => {
    const matchesFilter = selectedFilter === "all" || lot.statut === selectedFilter;
    const matchesSearch =
      lot.code_lot.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.couveuse.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getProgressColor = (progression) => {
    if (progression >= 80) return "bg-green-500";
    if (progression >= 50) return "bg-blue-500";
    if (progression >= 20) return "bg-yellow-500";
    return "bg-gray-500";
  };

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header avec stats */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Gestion des Couveuses</h1>
            <p className="text-green-100">Suivi et contrôle de l'incubation</p>
          </div>
          <a
            href="/couveuse/ajouter"
            className="inline-flex items-center gap-2 bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" /> Nouveau lotttt
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Egg className="w-5 h-5" /><span className="text-sm">Total œufs</span>
            </div>
            <p className="text-2xl font-bold">{lots.reduce((sum, lot) => sum + lot.nb_oeufs, 0)}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" /><span className="text-sm">Lots actifs</span>
            </div>
            <p className="text-2xl font-bold">{lots.filter(lot => lot.statut === "en_cours").length}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /><span className="text-sm">Taux moyen</span>
            </div>
            <p className="text-2xl font-bold">
              {Math.round(lots.reduce((sum, lot) => sum + (lot.taux_reussite || 0), 0) / Math.max(lots.length, 1))}%
            </p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" /><span className="text-sm">Jours restants max</span>
            </div>
            <p className="text-2xl font-bold">{Math.max(...lots.map(lot => lot.jours_restants || 0), 0)}</p>
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher par code ou couveuse..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <Egg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Filtres */}
          <div className="flex gap-2">
            {["all", "en_cours", "termine", "pause", "erreur"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFilter === filter
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {filter === "all" && "Tous"}
                {filter === "en_cours" && "Actifs"}
                {filter === "termine" && "Terminés"}
                {filter === "pause" && "En pause"}
                {filter === "erreur" && "Erreurs"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Liste des lots */}
      <div className="space-y-4">
        {filteredLots.map((lot) => (
          <div key={lot.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getStatusColor(lot.statut)}`}>
                    {getStatusIcon(lot.statut)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{lot.code_lot}</h3>
                    <p className="text-sm text-gray-500">{lot.couveuse}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lot.statut)}`}>
                    {getStatusText(lot.statut)}
                  </span>
                  <div className="flex gap-1">
                    <a href={`/couveuse/suivi/${lot.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </a>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Infos */}
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Œufs</p>
                  <p className="text-2xl font-bold text-gray-900">{lot.nb_oeufs}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Jours restants</p>
                  <p className="text-2xl font-bold text-gray-900">{lot.jours_restants}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Taux</p>
                  <p className="text-2xl font-bold text-gray-900">{lot.taux_reussite}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Date début</p>
                  <p className="text-lg font-medium text-gray-900">
                    {new Date(lot.date_debut).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>

              {/* Progression */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progression de l'incubation</span>
                  <span>{lot.progression}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${getProgressColor(lot.progression)}`}
                    style={{ width: `${lot.progression}%` }}
                  ></div>
                </div>
              </div>

              {/* Paramètres si actif */}
              {lot.statut === "en_cours" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm">
                    <Thermometer className="w-4 h-4 text-red-500" />
                    <span className="text-gray-600">Température:</span>
                    <span className="font-medium">37.5°C</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-600">Humidité:</span>
                    <span className="font-medium">65%</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600">Jours restants:</span>
                    <span className="font-medium">{lot.jours_restants}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Aucun lot */}
      {filteredLots.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <Egg className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun lot trouvé</h3>
          <p className="text-gray-500 mb-4">Aucun lot ne correspond à vos critères.</p>
          <a href="/couveuse/ajouter" className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
            <Plus className="w-5 h-5" /> Ajouter un lot
          </a>
        </div>
      )}
    </div>
  );
}
