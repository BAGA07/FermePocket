import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Eye, 
  Thermometer, 
  Droplets, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  Egg,
  BarChart3,
  Plus,
  RefreshCw,
  X,
  Edit,
  Trash2
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { couveuseService } from "../api/couveuse";
import { ensureAuthenticated } from "../utils/auth-helper";

export default function CouveuseSuivi() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showAjouterLot, setShowAjouterLot] = useState(false);

  // États pour les données de la couveuse
  const [couveuse, setCouveuse] = useState(null);
  const [lots, setLots] = useState([]);
  const [statistiques, setStatistiques] = useState(null);

  // État pour le formulaire d'ajout de lot
  const [nouveauLot, setNouveauLot] = useState({
    nom: '',
    nb_oeufs: '',
    date_debut: new Date().toISOString().split('T')[0],
    type_volaille: 'poule'
  });

  // Fonction pour charger les données de la couveuse
  const loadCouveuseDatas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!id) {
        throw new Error('ID de couveuse manquant');
      }
      
      await ensureAuthenticated();
      
      // Charger les données de la couveuse
      const couveuseDatas = await couveuseService.getById(id);
      setCouveuse(couveuseDatas);
      
      // Appliquer les bonnes pratiques de vérification des types
      const lotsData = Array.isArray(couveuseDatas.lots_actifs) ? couveuseDatas.lots_actifs : [];
      setLots(lotsData);
      
      // Calculer les statistiques
      calculateStatistics(couveuseDatas, lotsData);
      
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError(`Erreur lors du chargement des données de la couveuse: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour calculer les statistiques
  const calculateStatistics = (couveuseDatas, lotsData) => {
    if (!couveuseDatas) return;
    
    const totalOeufs = lotsData.reduce((total, lot) => total + (lot.nb_oeufs || 0), 0);
    const tauxOccupation = couveuseDatas.capacite > 0 ? Math.round((totalOeufs / couveuseDatas.capacite) * 100) : 0;
    
    setStatistiques({
      totalOeufs,
      tauxOccupation,
      lotsActifs: lotsData.length,
      temperature: couveuseDatas.temperature_actuelle || 0,
      humidite: couveuseDatas.humidite_actuelle || 0
    });
  };

  // Fonction pour actualiser les données
  const refreshData = async () => {
    setRefreshing(true);
    await loadCouveuseDatas();
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
        couveuse_id: id,
        nb_oeufs: parseInt(nouveauLot.nb_oeufs)
      };
      
      // Ici vous pouvez ajouter l'appel API pour créer le lot
      // await couveuseService.ajouterLot(lotData);
      
      // Recharger les données
      await loadCouveuseDatas();
      
      // Réinitialiser le formulaire
      setNouveauLot({
        nom: '',
        nb_oeufs: '',
        date_debut: new Date().toISOString().split('T')[0],
        type_volaille: 'poule'
      });
      setShowAjouterLot(false);
      
    } catch (err) {
      console.error('Erreur lors de l\'ajout du lot:', err);
      setError('Erreur lors de l\'ajout du lot');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadCouveuseDatas();
    }
  }, [id]);

  // Fonctions utilitaires pour le statut
  const getStatutColor = (statut) => {
    switch (statut) {
      case 'active':
        return 'border-green-200 bg-green-50 text-green-800';
      case 'maintenance':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'inactive':
        return 'border-gray-200 bg-gray-50 text-gray-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'maintenance':
        return <AlertTriangle className="w-4 h-4" />;
      case 'inactive':
        return <Activity className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getStatutText = (statut) => {
    switch (statut) {
      case 'active':
        return 'Active';
      case 'maintenance':
        return 'Maintenance';
      case 'inactive':
        return 'Inactive';
      default:
        return 'Inconnu';
    }
  };

  // Affichage du chargement
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Affichage des erreurs
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Erreur</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => navigate('/couveuse')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Retour à la liste
            </button>
            <button
              onClick={refreshData}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!couveuse) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-yellow-800 mb-2">Couveuse introuvable</h3>
          <p className="text-yellow-600 mb-4">La couveuse demandée n'existe pas ou n'est plus disponible.</p>
          <button
            onClick={() => navigate('/couveuse')}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* En-tête avec navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/couveuse')}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            title="Retour à la liste des couveuses"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                  {couveuse.nom}
                </h1>
                <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${getStatutColor(couveuse.statut)} flex-shrink-0`}>
                  {getStatutIcon(couveuse.statut)}
                  <span className="hidden xs:inline">{getStatutText(couveuse.statut)}</span>
                </span>
              </div>
              <p className="text-sm sm:text-base text-gray-600 mt-1 truncate">
                {couveuse.type} • Capacité: {couveuse.capacite} œufs
              </p>
                <div className="space-y-3">
                  {Array.isArray(lots) && lots.length > 0 ? (
                    lots.map((lot, index) => (
                      <div key={lot.id || index} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900">{lot.nom || `Lot ${index + 1}`}</h4>
                        <p className="text-sm text-gray-600">{lot.nb_oeufs || 0} œufs</p>
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <Egg className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Aucun lot actif</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Contenu de l'onglet Lots */}
          {activeTab === 'lots' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Gestion des lots</h3>
                <button
                  onClick={() => navigate(`/couveuse/${couveuse.id}/ajouter-lot`)}
                  disabled={couveuse.statut !== 'active'}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter un lot
                </button>
              </div>
              
              {Array.isArray(lots) && lots.length > 0 ? (
                lots.map((lot, index) => (
                  <div key={lot.id || index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{lot.nom || `Lot ${index + 1}`}</h4>
                        <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Œufs:</span>
                            <span className="ml-2 font-medium">{lot.nb_oeufs || 0}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Date:</span>
                            <span className="ml-2 font-medium">{lot.date_ajout || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <Egg className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Aucun lot actif</h4>
                  <p className="text-gray-600 mb-4">Ajoutez un lot d'œufs pour commencer.</p>
                  <button
                    onClick={() => navigate(`/couveuse/${couveuse.id}/ajouter-lot`)}
                    disabled={couveuse.statut !== 'active'}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter le premier lot
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
  } catch (renderError) {
    console.error('Erreur de rendu dans CouveuseSuivi:', renderError);
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Erreur de rendu</h3>
          <p className="text-red-600 mb-4">Une erreur s'est produite lors du rendu de la page de suivi.</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => navigate('/couveuse')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Retour à la liste
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Recharger la page
            </button>
          </div>
        </div>
      </div>
    );
  }
}