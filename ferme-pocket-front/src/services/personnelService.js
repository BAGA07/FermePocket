import api from '../api/axios';

// Service pour la gestion du personnel
const personnelService = {
  // Récupérer tous les employés
  async getEmployes() {
    try {
      const response = await api.get('http://localhost:8000/api/personnel');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des employés:', error);
      // Données de test en cas d'erreur
      return [
        {
          id: 1,
          nom: 'Dupont',
          prenom: 'Jean',
          poste: 'Responsable d\'élevage',
          telephone: '06 12 34 56 78',
          email: 'jean.dupont@fermepocket.com',
          dateEmbauche: '2023-01-15',
          salaire: 2500,
          statut: 'actif',
          competences: ['Élevage', 'Alimentation', 'Soins vétérinaires'],
          horaires: 'Temps plein',
          adresse: '123 Rue de la Ferme, 75001 Paris'
        },
        {
          id: 2,
          nom: 'Martin',
          prenom: 'Sophie',
          poste: 'Assistante vétérinaire',
          telephone: '06 98 76 54 32',
          email: 'sophie.martin@fermepocket.com',
          dateEmbauche: '2023-03-20',
          salaire: 2200,
          statut: 'actif',
          competences: ['Soins vétérinaires', 'Vaccination', 'Diagnostic'],
          horaires: 'Temps plein',
          adresse: '456 Avenue des Champs, 75002 Paris'
        },
        {
          id: 3,
          nom: 'Durand',
          prenom: 'Pierre',
          poste: 'Ouvrier agricole',
          telephone: '06 55 44 33 22',
          email: 'pierre.durand@fermepocket.com',
          dateEmbauche: '2023-06-10',
          salaire: 1800,
          statut: 'actif',
          competences: ['Nettoyage', 'Alimentation', 'Maintenance'],
          horaires: 'Temps partiel',
          adresse: '789 Rue du Village, 75003 Paris'
        },
        {
          id: 4,
          nom: 'Leroy',
          prenom: 'Marie',
          poste: 'Gestionnaire des stocks',
          telephone: '06 11 22 33 44',
          email: 'marie.leroy@fermepocket.com',
          dateEmbauche: '2022-11-05',
          salaire: 2300,
          statut: 'actif',
          competences: ['Gestion des stocks', 'Logistique', 'Comptabilité'],
          horaires: 'Temps plein',
          adresse: '321 Boulevard Central, 75004 Paris'
        },
        {
          id: 5,
          nom: 'Bernard',
          prenom: 'Luc',
          poste: 'Technicien maintenance',
          telephone: '06 77 88 99 00',
          email: 'luc.bernard@fermepocket.com',
          dateEmbauche: '2023-08-01',
          salaire: 2100,
          statut: 'congé',
          competences: ['Maintenance', 'Électricité', 'Plomberie'],
          horaires: 'Temps plein',
          adresse: '654 Rue de la Technique, 75005 Paris'
        }
      ];
    }
  },

  // Ajouter un nouvel employé
  async ajouterEmploye(employe) {
    try {
      const response = await api.post('/personnel', employe);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'employé:', error);
      throw error;
    }
  },

  // Modifier un employé
  async modifierEmploye(id, employe) {
    try {
      const response = await api.put(`/personnel/${id}`, employe);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la modification de l\'employé:', error);
      throw error;
    }
  },

  // Supprimer un employé
  async supprimerEmploye(id) {
    try {
      await api.delete(`/personnel/${id}`);
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'employé:', error);
      throw error;
    }
  },

  // Récupérer les présences
  async getPresences() {
    try {
      const response = await api.get('/personnel/presences');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des présences:', error);
      // Données de test
      return [
        {
          id: 1,
          employeId: 1,
          date: '2024-01-15',
          heureArrivee: '08:00',
          heureDepart: '17:00',
          statut: 'présent',
          heuresTravaillees: 8
        },
        {
          id: 2,
          employeId: 2,
          date: '2024-01-15',
          heureArrivee: '08:30',
          heureDepart: '17:30',
          statut: 'présent',
          heuresTravaillees: 8
        },
        {
          id: 3,
          employeId: 3,
          date: '2024-01-15',
          heureArrivee: '09:00',
          heureDepart: '13:00',
          statut: 'présent',
          heuresTravaillees: 4
        },
        {
          id: 4,
          employeId: 4,
          date: '2024-01-15',
          heureArrivee: '08:15',
          heureDepart: '17:15',
          statut: 'présent',
          heuresTravaillees: 8
        },
        {
          id: 5,
          employeId: 5,
          date: '2024-01-15',
          statut: 'absent',
          motif: 'Congé maladie',
          heuresTravaillees: 0
        }
      ];
    }
  },

  // Enregistrer une présence
  async enregistrerPresence(presence) {
    try {
      const response = await api.post('/personnel/presences', presence);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la présence:', error);
      throw error;
    }
  },

  // Récupérer les congés
  async getConges() {
    try {
      const response = await api.get('/personnel/conges');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des congés:', error);
      // Données de test
      return [
        {
          id: 1,
          employeId: 5,
          dateDebut: '2024-01-10',
          dateFin: '2024-01-20',
          type: 'maladie',
          statut: 'approuvé',
          motif: 'Grippe',
          joursOuvrables: 8
        },
        {
          id: 2,
          employeId: 2,
          dateDebut: '2024-02-15',
          dateFin: '2024-02-25',
          type: 'vacances',
          statut: 'en_attente',
          motif: 'Vacances d\'hiver',
          joursOuvrables: 7
        }
      ];
    }
  },

  // Demander un congé
  async demanderConge(conge) {
    try {
      const response = await api.post('/personnel/conges', conge);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la demande de congé:', error);
      throw error;
    }
  }
};

export default personnelService;
