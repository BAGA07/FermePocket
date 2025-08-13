import { useState, useEffect, useCallback } from 'react';
import stocksService from '../../../services/stocksService';

export const useStocks = () => {
  const [stocks, setStocks] = useState([]);
  const [mouvements, setMouvements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [selectedMouvement, setSelectedMouvement] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMouvementFormOpen, setIsMouvementFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('stocks');

  // Charger les données
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [stocksData, mouvementsData] = await Promise.all([
        stocksService.getStocks(),
        stocksService.getMouvements()
      ]);
      
      setStocks(stocksData);
      setMouvements(mouvementsData);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError('Impossible de charger les données. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les données au montage
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Gestion des stocks
  const handleCreateStock = async (stockData) => {
    try {
      setLoading(true);
      await stocksService.createStock(stockData);
      await loadData();
      setIsFormOpen(false);
    } catch (err) {
      console.error('Erreur lors de la création du stock:', err);
      throw new Error('Échec de la création du stock');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (id, stockData) => {
    try {
      setLoading(true);
      await stocksService.updateStock(id, stockData);
      await loadData();
      setIsFormOpen(false);
      setSelectedStock(null);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du stock:', err);
      throw new Error('Échec de la mise à jour du stock');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStock = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce stock ?')) {
      return;
    }
    
    try {
      setLoading(true);
      await stocksService.deleteStock(id);
      await loadData();
    } catch (err) {
      console.error('Erreur lors de la suppression du stock:', err);
      throw new Error('Échec de la suppression du stock');
    } finally {
      setLoading(false);
    }
  };

  // Gestion des mouvements
  const handleCreateMouvement = async (mouvementData) => {
    try {
      setLoading(true);
      await stocksService.createMouvementStock(mouvementData);
      await loadData();
      setIsMouvementFormOpen(false);
    } catch (err) {
      console.error('Erreur lors de la création du mouvement:', err);
      throw new Error('Échec de la création du mouvement');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMouvement = async (id, mouvementData) => {
    try {
      setLoading(true);
      await stocksService.updateMouvementStock(id, mouvementData);
      await loadData();
      setIsMouvementFormOpen(false);
      setSelectedMouvement(null);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du mouvement:', err);
      throw new Error('Échec de la mise à jour du mouvement');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMouvement = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce mouvement ?')) {
      return;
    }
    
    try {
      setLoading(true);
      await stocksService.deleteMouvementStock(id);
      await loadData();
    } catch (err) {
      console.error('Erreur lors de la suppression du mouvement:', err);
      throw new Error('Échec de la suppression du mouvement');
    } finally {
      setLoading(false);
    }
  };

  // Gestion des formulaires
  const openStockForm = (stock = null) => {
    setSelectedStock(stock);
    setIsFormOpen(true);
  };

  const closeStockForm = () => {
    setIsFormOpen(false);
    setSelectedStock(null);
  };

  const openMouvementForm = (mouvement = null) => {
    setSelectedMouvement(mouvement);
    setIsMouvementFormOpen(true);
  };

  const closeMouvementForm = () => {
    setIsMouvementFormOpen(false);
    setSelectedMouvement(null);
  };

  return {
    // État
    stocks,
    mouvements,
    loading,
    error,
    selectedStock,
    selectedMouvement,
    isFormOpen,
    isMouvementFormOpen,
    activeTab,
    
    // Setters
    setActiveTab,
    
    // Actions
    loadData,
    
    // Gestion des stocks
    handleCreateStock,
    handleUpdateStock,
    handleDeleteStock,
    
    // Gestion des mouvements
    handleCreateMouvement,
    handleUpdateMouvement,
    handleDeleteMouvement,
    
    // Gestion des formulaires
    openStockForm,
    closeStockForm,
    openMouvementForm,
    closeMouvementForm
  };
};

export default useStocks;
