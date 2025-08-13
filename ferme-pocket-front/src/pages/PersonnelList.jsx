import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  Phone, 
  Briefcase,
  CheckCircle,
  XCircle,
  Loader,
  AlertTriangle
} from 'lucide-react';
import personnelService from '../services/personnelService';

const PersonnelList = () => {
  const navigate = useNavigate();
  const [employes, setEmployes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chargement des données
  useEffect(() => {
    loadEmployes();
  }, []);

  const loadEmployes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await personnelService.getEmployes();
      
      // Trier automatiquement par nom de famille
      const employesTries = data.sort((a, b) => a.nom.localeCompare(b.nom));
      setEmployes(employesTries);
    } catch (err) {
      setError('Erreur lors du chargement de la liste du personnel');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = () => {
    navigate('/personnel/create');
  };

  // Affichage du loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-4">
              <Loader className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-gray-600">Chargement du personnel...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Affichage de l'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-4 text-center">
              <AlertTriangle className="w-12 h-12 text-red-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={loadEmployes}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Personnel</h1>
                <p className="text-gray-600 mt-1">Gestion de l'équipe</p>
              </div>
            </div>
            <button
              onClick={handleAddMember}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <UserPlus className="w-5 h-5" />
              Ajouter un membre
            </button>
          </div>

          {/* Compteur total d'employés */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total des employés</p>
                <p className="text-2xl font-bold text-gray-900">{employes.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Liste du personnel en cartes */}
        {employes.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun employé</h3>
            <p className="text-gray-600 mb-6">Commencez par ajouter votre premier membre d'équipe</p>
            <button
              onClick={handleAddMember}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              Ajouter un membre
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employes.map((employe) => (
              <div
                key={employe.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200 transform hover:-translate-y-1"
              >
                {/* Avatar et nom */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md">
                    {employe.prenom?.[0]}{employe.nom?.[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {employe.prenom} {employe.nom}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 text-sm">{employe.poste}</span>
                    </div>
                  </div>
                </div>

                {/* Informations */}
                <div className="space-y-3">
                  {/* Téléphone */}
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{employe.telephone || 'Non renseigné'}</span>
                  </div>

                  {/* Statut */}
                  <div className="flex items-center gap-3">
                    {employe.statut === 'actif' ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-green-700 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">
                          Actif
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span className="text-red-700 text-sm font-medium bg-red-50 px-2 py-1 rounded-full">
                          Inactif
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions (optionnel) */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                    Voir détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonnelList;
