import api from '../api/axios';

// Service pour la gestion financière (ventes, dépenses, stats)
const financeService = {
  // Ventes
  async getVentes() {
    try {
      const { data } = await api.get('/finances/ventes');
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des ventes:', error);
      // Données de test
      return [
        { id: 1, produit: 'Poulets chair', quantite: 50, prix: 2500, date: '2025-07-10', client: 'Marché central' },
        { id: 2, produit: 'Œufs', quantite: 200, prix: 150, date: '2025-07-12', client: 'Épicerie locale' },
        { id: 3, produit: 'Fientes', quantite: 10, prix: 1000, date: '2025-07-15', client: 'Agriculteur K.' },
      ];
    }
  },

  async addVente(vente) {
    try {
      const { data } = await api.post('/finances/ventes', vente);
      return data;
    } catch (error) {
      console.error("Erreur lors de l'ajout de la vente:", error);
      // Simuler une création côté front
      return { id: Date.now(), ...vente };
    }
  },

  // Dépenses
  async getDepenses() {
    try {
      const { data } = await api.get('/finances/depenses');
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des dépenses:', error);
      // Données de test
      return [
        { id: 1, categorie: 'Aliments', libelle: 'Granulés poules', montant: 125000, date: '2025-07-08', moyen: 'Espèces' },
        { id: 2, categorie: 'Santé', libelle: 'Vaccins', montant: 45000, date: '2025-07-11', moyen: 'Mobile money' },
        { id: 3, categorie: 'Maintenance', libelle: 'Réparation couveuse', montant: 30000, date: '2025-07-13', moyen: 'Virement' },
      ];
    }
  },

  async addDepense(depense) {
    try {
      const { data } = await api.post('/finances/depenses', depense);
      return data;
    } catch (error) {
      console.error("Erreur lors de l'ajout de la dépense:", error);
      // Simuler une création côté front
      return { id: Date.now(), ...depense };
    }
  },

  // Statistiques tableau de bord
  async getStatsDashboard() {
    try {
      const { data } = await api.get('/finances/stats');
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des stats financières:', error);
      // Données de test
      const ventes = 50 * 2500 + 200 * 150 + 10 * 1000; // total simple à partir des ventes mock
      const depenses = 125000 + 45000 + 30000;
      return {
        chiffreAffaires: ventes,
        totalDepenses: depenses,
        benefice: ventes - depenses,
        cashFlow: ventes - depenses,
        recapMois: [
          { mois: 'Mar', ventes: 450000, depenses: 220000 },
          { mois: 'Avr', ventes: 520000, depenses: 260000 },
          { mois: 'Mai', ventes: 610000, depenses: 300000 },
          { mois: 'Jun', ventes: 580000, depenses: 310000 },
          { mois: 'Jul', ventes: ventes, depenses: depenses },
        ],
      };
    }
  },
};

export default financeService;
