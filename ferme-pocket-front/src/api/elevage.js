// src/api/elevage.js
import api from './axios';

export const elevageService = {
  // ===========================
  // LOTS DE VOLAILLES
  // ===========================
  
  // Obtenir tous les lots de volailles
  getAllLots: async () => {
    try {
      const response = await api.get('/lots-volailles');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des lots de volailles:', error);
      throw error;
    }
  },

  // Obtenir un lot de volailles par ID
  getLotById: async (id) => {
    try {
      const response = await api.get(`/lots-volailles/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du lot ${id}:`, error);
      throw error;
    }
  },

  // Créer un nouveau lot de volailles
  createLot: async (data) => {
    try {
      const response = await api.post('/lots-volailles', data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du lot de volailles:', error);
      throw error;
    }
  },

  // Mettre à jour un lot de volailles
  updateLot: async (id, data) => {
    try {
      const response = await api.put(`/lots-volailles/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du lot ${id}:`, error);
      throw error;
    }
  },

  // Supprimer un lot de volailles
  deleteLot: async (id) => {
    try {
      const response = await api.delete(`/lots-volailles/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression du lot ${id}:`, error);
      throw error;
    }
  },

  // ===========================
  // VACCINATIONS
  // ===========================

  // Obtenir toutes les vaccinations
  getAllVaccinations: async () => {
    try {
      const response = await api.get('/vaccinations');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des vaccinations:', error);
      throw error;
    }
  },

  // Obtenir les vaccinations d'un lot spécifique
  getVaccinationsByLot: async (lotId) => {
    try {
      const response = await api.get(`/vaccinations?lot_volaille_id=${lotId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des vaccinations du lot ${lotId}:`, error);
      throw error;
    }
  },

  // Créer une nouvelle vaccination
  createVaccination: async (data) => {
    try {
      const response = await api.post('/vaccinations', data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la vaccination:', error);
      throw error;
    }
  },

  // Mettre à jour une vaccination
  updateVaccination: async (id, data) => {
    try {
      const response = await api.put(`/vaccinations/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la vaccination ${id}:`, error);
      throw error;
    }
  },

  // Supprimer une vaccination
  deleteVaccination: async (id) => {
    try {
      const response = await api.delete(`/vaccinations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la vaccination ${id}:`, error);
      throw error;
    }
  },

  // ===========================
  // FICHES DE SANTÉ
  // ===========================

  // Obtenir toutes les fiches de santé
  getAllFichesSante: async () => {
    try {
      const response = await api.get('/fiches-sante');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des fiches de santé:', error);
      throw error;
    }
  },

  // Créer une nouvelle fiche de santé
  createFicheSante: async (data) => {
    try {
      const response = await api.post('/fiches-sante', data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la fiche de santé:', error);
      throw error;
    }
  },

  // ===========================
  // STOCKS D'ALIMENTS
  // ===========================

  // Obtenir tous les stocks d'aliments
  getAllStocksAliments: async () => {
    try {
      const response = await api.get('/stocks-aliments');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des stocks d\'aliments:', error);
      throw error;
    }
  },

  // Créer un nouveau stock d'aliment
  createStockAliment: async (data) => {
    try {
      const response = await api.post('/stocks-aliments', data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du stock d\'aliment:', error);
      throw error;
    }
  },

  // ===========================
  // MOUVEMENTS DE STOCK
  // ===========================

  // Obtenir tous les mouvements de stock
  getAllMouvementsStock: async () => {
    try {
      const response = await api.get('/mouvements-stock');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des mouvements de stock:', error);
      throw error;
    }
  },

  // Créer un nouveau mouvement de stock
  createMouvementStock: async (data) => {
    try {
      const response = await api.post('/mouvements-stock', data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du mouvement de stock:', error);
      throw error;
    }
  },

  // ===========================
  // ALERTES
  // ===========================

  // Obtenir toutes les alertes
  getAllAlertes: async () => {
    try {
      const response = await api.get('/alertes');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des alertes:', error);
      throw error;
    }
  },

  // Créer une nouvelle alerte
  createAlerte: async (data) => {
    try {
      const response = await api.post('/alertes', data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'alerte:', error);
      throw error;
    }
  }
};

export default elevageService;
