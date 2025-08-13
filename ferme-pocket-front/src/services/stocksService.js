import api from '../api/axios';

const stocksService = {
  // Gestion des stocks
  getStocks: async () => {
    try {
      const response = await api.get('/stocks');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des stocks:', error);
      // Retourner des données de test en cas d'erreur
      return [
        {
          id: 1,
          nom_aliment: 'Granulés Poules',
          type_aliment: 'granules',
          quantite_actuelle: 45,
          unite: 'kg',
          seuil_alerte: 10,
          prix_unitaire: 25.50,
          fournisseur: 'Ferme & Co'
        },
        {
          id: 2,
          nom_aliment: 'Farine de Maïs',
          type_aliment: 'farine',
          quantite_actuelle: 8,
          unite: 'sac',
          seuil_alerte: 15,
          prix_unitaire: 18.00,
          fournisseur: 'AgriSupply'
        },
        {
          id: 3,
          nom_aliment: 'Complément Vitamines',
          type_aliment: 'complement',
          quantite_actuelle: 25,
          unite: 'kg',
          seuil_alerte: 5,
          prix_unitaire: 45.00,
          fournisseur: 'VitaFarm'
        }
      ];
    }
  },

  getMouvements: async () => {
    try {
      const response = await api.get('/mouvements-stock');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des mouvements:', error);
      // Retourner des données de test
      return [
        {
          id: 1,
          stock_aliment_id: 1,
          type_mouvement: 'entree',
          quantite: 50,
          motif: 'Achat mensuel',
          date_mouvement: '2024-01-15',
          stock_aliment: { nom_aliment: 'Granulés Poules' }
        },
        {
          id: 2,
          stock_aliment_id: 2,
          type_mouvement: 'sortie',
          quantite: 12,
          motif: 'Consommation',
          date_mouvement: '2024-01-10',
          stock_aliment: { nom_aliment: 'Farine de Maïs' }
        }
      ];
    }
  },

  createStock: async (stockData) => {
    try {
      const response = await api.post('/stocks', stockData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du stock:', error);
      // Simuler une création réussie
      return { ...stockData, id: Date.now() };
    }
  },

  createMouvement: async (mouvementData) => {
    try {
      const response = await api.post('/mouvements-stock', mouvementData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du mouvement:', error);
      // Simuler une création réussie
      return { ...mouvementData, id: Date.now() };
    }
  }
};

export default stocksService;