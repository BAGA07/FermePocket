import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Settings, 
  Thermometer, 
  Droplets, 
  Egg, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Edit,
  Eye,
  BarChart3,
  PlusCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { couveuseService } from "../api/couveuse";
import { ensureAuthenticated } from "../utils/auth-helper";

export default function CouveusesGestion() {
  const navigate = useNavigate();
  const [couveuses, setCouveuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // États pour l'édition
  const [editingCouveuse, setEditingCouveuse] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  // Pour formulaire création couveuse
  const [newNom, setNewNom] = useState("");
  const [newCapacite, setNewCapacite] = useState("");
  const [newType, setNewType] = useState("manuelle");
  const [newStatut, setNewStatut] = useState("active");
  
  // Pour formulaire édition couveuse
  const [editNom, setEditNom] = useState("");
  const [editCapacite, setEditCapacite] = useState("");
  const [editType, setEditType] = useState("manuelle");
  const [editStatut, setEditStatut] = useState("active");

  const fetchCouveuses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // S'assurer que l'utilisateur est authentifié
      await ensureAuthenticated();
      
      const data = await couveuseService.getAll();
      setCouveuses(data);
    } catch (err) {
      console.error('Erreur lors du chargement des couveuses:', err);
      
      // Diagnostic détaillé de l'erreur
      let errorMessage = "Erreur lors du chargement des couveuses";
      
      if (err.response) {
        // Erreur de réponse du serveur
        const status = err.response.status;
        const data = err.response.data;
        
        if (status === 401) {
          errorMessage = "Erreur d'authentification. Veuillez vous reconnecter.";
        } else if (status === 403) {
          errorMessage = "Accès non autorisé aux données des couveuses.";
        } else if (status === 404) {
          errorMessage = "Endpoint des couveuses non trouvé.";
        } else if (status >= 500) {
          errorMessage = "Erreur serveur. Vérifiez que l'API Laravel est démarrée.";
        } else {
          errorMessage = `Erreur ${status}: ${data?.message || 'Erreur inconnue'}`;
        }
      } else if (err.request) {
        // Erreur de réseau (serveur non accessible)
        errorMessage = "Impossible de contacter le serveur API. Vérifiez que Laravel est démarré sur http://127.0.0.1:8000";
      } else {
        // Autre erreur
        errorMessage = `Erreur: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCouveuses();
  }, []);

  const handleAddCouveuse = async (e) => {
    e.preventDefault();
    
    if (!newNom.trim() || !newCapacite) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await couveuseService.create({
        nom: newNom.trim(),
        capacite: parseInt(newCapacite),
        type: newType,
        statut: newStatut
      });

      // Réinitialiser le formulaire
      setNewNom("");
      setNewCapacite("");
      setNewType("manuelle");
      setNewStatut("active");
      setShowAddForm(false);
      
      // Recharger la liste
      await fetchCouveuses();
    } catch (err) {
      console.error('Erreur lors de l\'ajout:', err);
      setError("Erreur lors de l'ajout de la couveuse");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCouveuse = async (id, nom) => {
    if (!window.confirm(`Confirmer la suppression de la couveuse "${nom}" ?\n\nCette action est irréversible et supprimera tous les lots associés.`)) return;
    
    try {
      setError(null);
      await couveuseService.delete(id);
      await fetchCouveuses();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError("Erreur lors de la suppression de la couveuse");
    }
  };

  const handleEditCouveuse = (couveuse) => {
    setEditingCouveuse(couveuse);
    setEditNom(couveuse.nom || "");
    setEditCapacite(couveuse.capacite?.toString() || "");
    setEditType(couveuse.type || "manuelle");
    setEditStatut(couveuse.statut || "active");
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleUpdateCouveuse = async (e) => {
    e.preventDefault();
    
    if (!editNom.trim() || !editCapacite || !editingCouveuse) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await couveuseService.update(editingCouveuse.id, {
        nom: editNom.trim(),
        capacite: parseInt(editCapacite),
        type: editType,
        statut: editStatut
      });

      // Réinitialiser le formulaire d'édition
      setEditingCouveuse(null);
      setShowEditForm(false);
      setEditNom("");
      setEditCapacite("");
      setEditType("manuelle");
      setEditStatut("active");
      
      // Recharger la liste
      await fetchCouveuses();
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError("Erreur lors de la mise à jour de la couveuse");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCouveuse(null);
    setShowEditForm(false);
    setEditNom("");
    setEditCapacite("");
    setEditType("manuelle");
    setEditStatut("active");
    setError(null);
  };

  const handleViewDetails = (couveuse) => {
    navigate(`/couveuse/${couveuse.id}/suivi`);
  };

  const handleAddLot = (couveuse) => {
    navigate(`/couveuse/${couveuse.id}/ajouter-lot`);
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case "active": return "bg-green-100 text-green-800 border-green-200";
      case "maintenance": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "inactive": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
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

  const getStatutIcon = (statut) => {
    switch (statut) {
      case "active": return <CheckCircle className="w-4 h-4" />;
      case "maintenance": return <Settings className="w-4 h-4" />;
      case "inactive": return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  // Affichage du chargement
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des couveuses...</p>
          </div>
        </div>
      </div>
    );
  }

  // Debug: Affichage des données pour diagnostiquer
  console.log('CouveusesGestion - État actuel:', {
    loading,
    error,
    couveusesCount: couveuses?.length,
    couveuses: couveuses
  });

  // Protection contre les erreurs de rendu
  try {
    return (
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Couveuses</h1>
            <p className="text-gray-600 mt-1">
              {couveuses?.length || 0} couveuse{(couveuses?.length || 0) > 1 ? 's' : ''} enregistrée{(couveuses?.length || 0) > 1 ? 's' : ''}
            </p>
          </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouvelle couveuse
        </button>
      </div>

      {/* Affichage des erreurs */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-red-800">Erreur</h3>
            <p className="text-red-600">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            ×
          </button>
        </div>
      )}

      {/* Formulaire ajout couveuse */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-600" />
            Ajouter une nouvelle couveuse
          </h2>

          <form onSubmit={handleAddCouveuse} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la couveuse *
                </label>
                <input
                  type="text"
                  required
                  value={newNom}
                  onChange={e => setNewNom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: Couveuse A1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacité (œufs) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={newCapacite}
                  onChange={e => setNewCapacite(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: 100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="manuelle">Manuelle</option>
                  <option value="automatique">Automatique</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut initial
                </label>
                <select
                  value={newStatut}
                  onChange={e => setNewStatut(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setError(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Ajout en cours...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Formulaire édition couveuse */}
      {showEditForm && editingCouveuse && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Edit className="w-5 h-5 text-blue-600" />
            Modifier la couveuse "{editingCouveuse.nom}"
          </h2>

          <form onSubmit={handleUpdateCouveuse} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la couveuse *
                </label>
                <input
                  type="text"
                  required
                  value={editNom}
                  onChange={e => setEditNom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Couveuse A1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacité (œufs) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={editCapacite}
                  onChange={e => setEditCapacite(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={editType}
                  onChange={e => setEditType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="manuelle">Manuelle</option>
                  <option value="automatique">Automatique</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={editStatut}
                  onChange={e => setEditStatut(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4" />
                    Mettre à jour
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste couveuses */}
      {couveuses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Egg className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune couveuse</h3>
          <p className="text-gray-600 mb-4">Commencez par ajouter votre première couveuse</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Ajouter une couveuse
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {couveuses.map(couveuse => (
            <div key={couveuse.id} className="bg-white rounded-xl shadow-lg p-6">
              {/* En-tête de la carte */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{couveuse.nom}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatutColor(couveuse.statut)}`}>
                      {getStatutIcon(couveuse.statut)}
                      {getStatutText(couveuse.statut)}
                    </span>
                    <span className="text-sm text-gray-500 capitalize">{couveuse.type}</span>
                  </div>
                </div>
                
                {/* Actions rapides */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleViewDetails(couveuse)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Voir les détails et le suivi"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditCouveuse(couveuse)}
                    className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Modifier la couveuse"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCouveuse(couveuse.id, couveuse.nom)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer la couveuse"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Informations principales */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Egg className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Capacité</p>
                    <p className="font-medium">{couveuse.capacite} œufs</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Occupation</p>
                    <p className="font-medium">
                      {couveuse.occupation_actuelle || 0} œufs ({couveuse.taux_occupation || 0}%)
                    </p>
                  </div>
                </div>
              </div>

              {/* Conditions actuelles */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600">Température</p>
                    <p className="font-medium">{couveuse.temperature_actuelle || 'N/A'}°C</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Humidité</p>
                    <p className="font-medium">{couveuse.humidite_actuelle || 'N/A'}%</p>
                  </div>
                </div>
              </div>

              {/* Lots actifs */}
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Egg className="w-4 h-4 text-yellow-500" />
                  Lots actifs ({Array.isArray(couveuse.lots_actifs) ? couveuse.lots_actifs.length : 0})
                </h3>
                {!couveuse.lots_actifs || !Array.isArray(couveuse.lots_actifs) || couveuse.lots_actifs.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">Aucun lot actif</p>
                ) : (
                  <div className="space-y-2">
                    {couveuse.lots_actifs.slice(0, 2).map(lot => (
                      <div key={lot.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-medium text-sm">{lot.code_lot}</p>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {lot.jours_restants || 0}j restants
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                          <span>{lot.nb_oeufs} œufs</span>
                          <span>{lot.taux_reussite || 0}% réussite</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Début: {new Date(lot.date_debut).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    ))}
                    {Array.isArray(couveuse.lots_actifs) && couveuse.lots_actifs.length > 2 && (
                      <p className="text-xs text-gray-500 text-center">
                        +{couveuse.lots_actifs.length - 2} autre{couveuse.lots_actifs.length - 2 > 1 ? 's' : ''} lot{couveuse.lots_actifs.length - 2 > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Dernier relevé */}
              {couveuse.dernier_releve && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-500" />
                    Dernier relevé
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Date</p>
                        <p className="font-medium">
                          {new Date(couveuse.dernier_releve.date_releve).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Temp.</p>
                        <p className="font-medium">{couveuse.dernier_releve.temperature}°C</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Humid.</p>
                        <p className="font-medium">{couveuse.dernier_releve.humidite}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions avancées */}
              <div className="border-t pt-4 mt-4">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAddLot(couveuse)}
                    disabled={couveuse.statut !== 'active'}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    title={couveuse.statut !== 'active' ? 'Couveuse inactive' : 'Ajouter un nouveau lot d\'œufs'}
                  >
                    <PlusCircle className="w-4 h-4" />
                    Ajouter œufs
                  </button>
                  <button
                    onClick={() => handleViewDetails(couveuse)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                    title="Voir le suivi détaillé et les statistiques"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Suivi détaillé
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  } catch (renderError) {
    console.error('Erreur de rendu dans CouveusesGestion:', renderError);
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-medium text-red-800 mb-2">Erreur de rendu</h2>
          <p className="text-red-600 mb-4">Une erreur s'est produite lors du rendu du composant.</p>
          <details className="text-sm">
            <summary className="cursor-pointer text-red-700 font-medium">Détails de l'erreur</summary>
            <pre className="mt-2 p-2 bg-red-100 rounded text-xs overflow-auto">
              {renderError.toString()}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Recharger la page
          </button>
        </div>
      </div>
    );
  }
}
