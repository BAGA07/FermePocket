// src/api/stocks.js
import api from './axios';

export const stocksService = {
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

  // Obtenir un stock d'aliment par ID
  getStockAlimentById: async (id) => {
    try {
      const response = await api.get(`/stocks-aliments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du stock ${id}:`, error);
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

  // Mettre à jour un stock d'aliment
  updateStockAliment: async (id, data) => {
    try {
      const response = await api.put(`/stocks-aliments/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du stock ${id}:`, error);
      throw error;
    }
  },

  // Supprimer un stock d'aliment
  deleteStockAliment: async (id) => {
    try {
      const response = await api.delete(`/stocks-aliments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression du stock ${id}:`, error);
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

  // Obtenir les mouvements d'un stock spécifique
  getMouvementsByStock: async (stockId) => {
    try {
      const response = await api.get(`/mouvements-stock?stock_aliment_id=${stockId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des mouvements du stock ${stockId}:`, error);
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

  // Mettre à jour un mouvement de stock
  updateMouvementStock: async (id, data) => {
    try {
      const response = await api.put(`/mouvements-stock/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du mouvement ${id}:`, error);
      throw error;
    }
  },

  // Supprimer un mouvement de stock
  deleteMouvementStock: async (id) => {
    try {
      const response = await api.delete(`/mouvements-stock/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression du mouvement ${id}:`, error);
      throw error;
    }
  },

  // ===========================
  // FONCTIONS UTILITAIRES
  // ===========================

  // Obtenir le dashboard des stocks
  getStocksDashboard: async () => {
    try {
      const [stocksData, mouvementsData] = await Promise.all([
        stocksService.getAllStocksAliments(),
        stocksService.getAllMouvementsStock()
      ]);

      // Calculer les statistiques
      const totalStocks = Array.isArray(stocksData) ? stocksData.length : 0;
      const stocksFaibles = Array.isArray(stocksData) 
        ? stocksData.filter(stock => stock.quantite_actuelle <= stock.seuil_alerte).length 
        : 0;
      const totalMouvements = Array.isArray(mouvementsData) ? mouvementsData.length : 0;
      const mouvementsRecents = Array.isArray(mouvementsData)
        ? mouvementsData.filter(mouvement => {
            const dateMouvement = new Date(mouvement.date_mouvement);
            const maintenant = new Date();
            const diffJours = (maintenant - dateMouvement) / (1000 * 60 * 60 * 24);
            return diffJours <= 7;
          }).length
        : 0;

      return {
        stocks: stocksData,
        mouvements: mouvementsData,
        statistiques: {
          totalStocks,
          stocksFaibles,
          totalMouvements,
          mouvementsRecents
        }
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du dashboard des stocks:', error);
      throw error;
    }
  },

  // Effectuer une entrée de stock
  entreeStock: async (stockId, quantite, motif = 'Réapprovisionnement') => {
    try {
      const mouvementData = {
        stock_aliment_id: stockId,
        type_mouvement: 'entree',
        quantite: quantite,
        motif: motif,
        date_mouvement: new Date().toISOString().split('T')[0]
      };

      return await stocksService.createMouvementStock(mouvementData);
    } catch (error) {
      console.error('Erreur lors de l\'entrée de stock:', error);
      throw error;
    }
  },

  // Effectuer une sortie de stock
  sortieStock: async (stockId, quantite, motif = 'Consommation') => {
    try {
      const mouvementData = {
        stock_aliment_id: stockId,
        type_mouvement: 'sortie',
        quantite: quantite,
        motif: motif,
        date_mouvement: new Date().toISOString().split('T')[0]
      };

      return await stocksService.createMouvementStock(mouvementData);
    } catch (error) {
      console.error('Erreur lors de la sortie de stock:', error);
      throw error;
    }
  }
};

export default stocksService;
