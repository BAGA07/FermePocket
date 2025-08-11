import api from './axios';

/**
 * Service API pour la gestion des lots de couveuse
 */
export const lotService = {
  // Récupérer tous les lots
  getAll: async () => {
    try {
      const response = await api.get('/lots-couveuses');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des lots:', error);
      throw error;
    }
  },

  // Créer un nouveau lot
  create: async (lotData) => {
    try {
      const response = await api.post('/lots-couveuses', lotData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du lot:', error);
      throw error;
    }
  },

  // Récupérer un lot par ID
  getById: async (id) => {
    try {
      const response = await api.get(`/lots-couveuses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du lot:', error);
      throw error;
    }
  },

  // Mettre à jour un lot
  update: async (id, lotData) => {
    try {
      const response = await api.put(`/lots-couveuses/${id}`, lotData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du lot:', error);
      throw error;
    }
  },

  // Supprimer un lot
  delete: async (id) => {
    try {
      const response = await api.delete(`/lots-couveuses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression du lot:', error);
      throw error;
    }
  },

  // Récupérer les couveuses disponibles
  getCouveusesList: async () => {
    try {
      const response = await api.get('/couveuses');
      // L'API des couveuses retourne directement un tableau, pas un objet avec status
      return {
        status: 'success',
        data: response.data
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des couveuses:', error);
      throw error;
    }
  }
};

export default lotService;
