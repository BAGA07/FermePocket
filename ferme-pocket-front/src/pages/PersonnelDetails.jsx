import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  Briefcase,
  Calendar,
  MapPin,
  Clock,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Loader,
  AlertTriangle
} from 'lucide-react';
import personnelService from '../services/personnelService';

const PersonnelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employe, setEmploye] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les détails de l'employé
  useEffect(() => {
    const loadEmploye = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await personnelService.getEmployes();
        const foundEmploye = data.find(e => e.id === parseInt(id));
        
        if (foundEmploye) {
          setEmploye(foundEmploye);
        } else {
          setError('Employé non trouvé');
        }
      } catch (err) {
        setError('Erreur lors du chargement des détails');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadEmploye();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      try {
        await personnelService.supprimerEmploye(parseInt(id));
        navigate('/personnel');
      } catch (err) {
        setError('Erreur lors de la suppression');
        console.error(err);
      }
    }
  };

  // Affichage du chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-4">
              <Loader className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-gray-600">Chargement des détails...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Affichage d'erreur
  if (error || !employe) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-4 text-center">
              <AlertTriangle className="w-12 h-12 text-red-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur</h3>
                <p className="text-gray-600 mb-4">{error || 'Impossible de charger les détails de l\'employé'}</p>
                <button
                  onClick={() => navigate('/personnel')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Retour à la liste
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Formatage de la date d'embauche
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <Link
            to="/personnel"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la liste du personnel
          </Link>

          <div className="flex justify-between items-start gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {employe.prenom} {employe.nom}
              </h1>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {employe.poste}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${employe.statut === 'actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {employe.statut === 'actif' ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Actif
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 mr-1" />
                      Inactif
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                to={`/personnel/edit/${employe.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Modifier
              </Link>
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-red-700 hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          </div>
        </div>

        {/* Grille d'informations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Colonne de gauche */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                    Informations personnelles
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nom complet</p>
                      <p className="mt-1">{employe.prenom} {employe.nom}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <a href={`mailto:${employe.email}`} className="text-blue-600 hover:underline">
                          {employe.email || 'Non renseigné'}
                        </a>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Téléphone</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {employe.telephone || 'Non renseigné'}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Adresse</p>
                      <div className="mt-1 flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span>{employe.adresse || 'Non renseignée'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Colonne de droite */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                    Informations professionnelles
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Poste</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        {employe.poste}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date d'embauche</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(employe.dateEmbauche)}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Horaires</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {employe.horaires || 'Non spécifié'}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Salaire</p>
                      <div className="mt-1">
                        {employe.salaire ? (
                          <span className="font-medium">{employe.salaire.toLocaleString()} €</span>
                        ) : (
                          'Non spécifié'
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section notes (optionnelle) */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Notes et observations
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                {employe.notes ? (
                  <p className="text-gray-700 whitespace-pre-line">{employe.notes}</p>
                ) : (
                  <p className="text-gray-500 italic">Aucune note pour le moment</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonnelDetails;
