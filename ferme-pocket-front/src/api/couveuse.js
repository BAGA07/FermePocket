// src/services/couveuseService.js
import api from './axios';

export const couveuseService = {
  // Initialiser CSRF cookie avant toute requête protégée
  initSanctum: async () => {
    try {
      await api.get('/sanctum/csrf-cookie', { withCredentials: true });
    } catch (error) {
      console.error('Erreur lors de l’initialisation Sanctum:', error);
      throw error;
    }
  },

  // Obtenir toutes les couveuses
  getAll: async () => {
    try {
      // Temporairement désactivé : await couveuseService.initSanctum();
      const response = await api.get('/couveuses');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des couveuses:', error);
      throw error;
    }
  },

  // Obtenir les données du dashboard
  getDashboard: async () => {
    try {
      // Temporairement désactivé : await couveuseService.initSanctum();
      const response = await api.get('/couveuses/dashboard');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du dashboard:', error);
      throw error;
    }
  },

  // Obtenir une couveuse par ID
  getById: async (id) => {
    try {
      // Temporairement désactivé : await couveuseService.initSanctum();
      const response = await api.get(`/couveuses/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la couveuse ${id}:`, error);
      throw error;
    }
  },

  // Créer une nouvelle couveuse
  create: async (data) => {
    try {
      // Temporairement désactivé : await couveuseService.initSanctum();
      const response = await api.post('/couveuses', data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la couveuse:', error);
      throw error;
    }
  },

  // Mettre à jour une couveuse
  update: async (id, data) => {
    try {
      // Temporairement désactivé : await couveuseService.initSanctum();
      const response = await api.put(`/couveuses/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la couveuse ${id}:`, error);
      throw error;
    }
  },

  // Supprimer une couveuse
  delete: async (id) => {
    try {
      // Temporairement désactivé : await couveuseService.initSanctum();
      const response = await api.delete(`/couveuses/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la couveuse ${id}:`, error);
      throw error;
    }
  }
};

export default couveuseService;
