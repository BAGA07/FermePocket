import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Plus,
  RefreshCw,
  Search,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  Users,
  Activity,
  Pill,
  Package,
  Bell,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import elevageService from "../api/elevage";
import { ensureAuthenticated } from "../utils/auth-helper";
import { ModalAjouterLot, ModalAjouterVaccination } from "../components/ElevageModals";

export default function Elevage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("lots");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // États pour les données
  const [lots, setLots] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [alertes, setAlertes] = useState([]);

  // États pour les modales
  const [showAddLot, setShowAddLot] = useState(false);
  const [showAddVaccination, setShowAddVaccination] = useState(false);

  // États pour les formulaires
  const [nouveauLot, setNouveauLot] = useState({
    nom_lot: '',
    type_volaille: 'chair',
    quantite: '',
    date_arrivee: new Date().toISOString().split('T')[0],
    origine: ''
  });

  const [nouvelleVaccination, setNouvelleVaccination] = useState({
    lot_volaille_id: '',
    vaccin: '',
    date_vaccination: new Date().toISOString().split('T')[0],
    dose: '',
    observations: ''
  });

  // Fonction pour charger toutes les données
  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      await ensureAuthenticated();

      // Charger toutes les données en parallèle
      const [
        lotsData,
        vaccinationsData,
        alertesData
      ] = await Promise.all([
        elevageService.getAllLots(),
        elevageService.getAllVaccinations(),
        elevageService.getAllAlertes()
      ]);

      setLots(Array.isArray(lotsData) ? lotsData : []);
      setVaccinations(Array.isArray(vaccinationsData) ? vaccinationsData : []);
      setAlertes(Array.isArray(alertesData) ? alertesData : []);

    } catch (err) {
      console.error('Erreur lors du chargement des données d\'élevage:', err);
      setError(`Erreur lors du chargement des données: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour actualiser les données
  const refreshData = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  };

  // Fonction pour ajouter un nouveau lot
  const handleAjouterLot = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await ensureAuthenticated();

      const lotData = {
        ...nouveauLot,
        quantite: parseInt(nouveauLot.quantite)
      };

      await elevageService.createLot(lotData);
      await loadAllData();

      // Réinitialiser le formulaire
      setNouveauLot({
        nom_lot: '',
        type_volaille: 'chair',
        quantite: '',
        date_arrivee: new Date().toISOString().split('T')[0],
        origine: ''
      });
      setShowAddLot(false);

    } catch (err) {
      console.error('Erreur lors de l\'ajout du lot:', err);
      setError('Erreur lors de l\'ajout du lot');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour ajouter une vaccination
  const handleAjouterVaccination = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await ensureAuthenticated();

      await elevageService.createVaccination(nouvelleVaccination);
      await loadAllData();

      // Réinitialiser le formulaire
      setNouvelleVaccination({
        lot_volaille_id: '',
        vaccin: '',
        date_vaccination: new Date().toISOString().split('T')[0],
        dose: '',
        observations: ''
      });
      setShowAddVaccination(false);

    } catch (err) {
      console.error('Erreur lors de l\'ajout de la vaccination:', err);
      setError('Erreur lors de l\'ajout de la vaccination');
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les données selon le terme de recherche
  const filteredLots = lots.filter(lot =>
    lot.nom_lot?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.type_volaille?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVaccinations = vaccinations.filter(vaccination =>
    vaccination.vaccin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vaccination.lot_volaille?.nom_lot?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    loadAllData();
  }, []);

  // Fonction pour obtenir la couleur du type de volaille
  const getTypeVolailleColor = (type) => {
    switch (type) {
      case 'chair':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'pondeuse':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reproducteur':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données d'élevage...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestion de l'Élevage</h1>
                <p className="text-sm text-gray-600">
                  Suivi des lots, vaccinations et santé des volailles
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={refreshData}
                disabled={refreshing}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Lots</p>
                <p className="text-2xl font-bold text-gray-900">{lots.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Volailles</p>
                <p className="text-2xl font-bold text-gray-900">
                  {lots.reduce((total, lot) => total + (lot.quantite || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Pill className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vaccinations</p>
                <p className="text-2xl font-bold text-gray-900">{vaccinations.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Bell className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Alertes</p>
                <p className="text-2xl font-bold text-gray-900">{alertes.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Onglets de navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'lots', label: 'Lots de Volailles', icon: Users },
                { id: 'vaccinations', label: 'Vaccinations', icon: Pill },
                { id: 'stocks', label: 'Stocks Aliments', icon: Package }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Barre de recherche et actions */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-2">
                {activeTab === 'lots' && (
                  <button
                    onClick={() => setShowAddLot(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau Lot
                  </button>
                )}
                {activeTab === 'vaccinations' && (
                  <button
                    onClick={() => setShowAddVaccination(true)}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle Vaccination
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Contenu des onglets */}
          <div className="p-6">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Lots de Volailles */}
            {activeTab === 'lots' && (
              <div className="space-y-4">
                {filteredLots.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun lot trouvé</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Commencez par ajouter un nouveau lot de volailles.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredLots.map((lot) => (
                      <div key={lot.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{lot.nom_lot}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeVolailleColor(lot.type_volaille)}`}>
                                {lot.type_volaille}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Quantité:</span> {lot.quantite} volailles
                              </div>
                              <div>
                                <span className="font-medium">Date d'arrivée:</span> {new Date(lot.date_arrivee).toLocaleDateString('fr-FR')}
                              </div>
                              <div>
                                <span className="font-medium">Origine:</span> {lot.origine || 'Non spécifiée'}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-white transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-white transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Onglet Vaccinations */}
            {activeTab === 'vaccinations' && (
              <div className="space-y-4">
                {filteredVaccinations.length === 0 ? (
                  <div className="text-center py-12">
                    <Pill className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune vaccination trouvée</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Commencez par ajouter une nouvelle vaccination.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredVaccinations.map((vaccination) => (
                      <div key={vaccination.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{vaccination.vaccin}</h3>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                Administré
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Lot:</span> {vaccination.lot_volaille?.nom_lot || 'Non spécifié'}
                              </div>
                              <div>
                                <span className="font-medium">Date:</span> {new Date(vaccination.date_vaccination).toLocaleDateString('fr-FR')}
                              </div>
                              <div>
                                <span className="font-medium">Dose:</span> {vaccination.dose || 'Non spécifiée'}
                              </div>
                            </div>
                            {vaccination.observations && (
                              <div className="mt-2 text-sm text-gray-600">
                                <span className="font-medium">Observations:</span> {vaccination.observations}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-white transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-white transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Onglet Stocks Aliments */}
            {activeTab === 'stocks' && (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Stocks d'aliments</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Fonctionnalité en cours de développement.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modales */}
      <ModalAjouterLot
        showAddLot={showAddLot}
        setShowAddLot={setShowAddLot}
        nouveauLot={nouveauLot}
        setNouveauLot={setNouveauLot}
        handleAjouterLot={handleAjouterLot}
        loading={loading}
      />

      <ModalAjouterVaccination
        showAddVaccination={showAddVaccination}
        setShowAddVaccination={setShowAddVaccination}
        nouvelleVaccination={nouvelleVaccination}
        setNouvelleVaccination={setNouvelleVaccination}
        handleAjouterVaccination={handleAjouterVaccination}
        loading={loading}
        lots={lots}
      />
    </div>
  );
}
