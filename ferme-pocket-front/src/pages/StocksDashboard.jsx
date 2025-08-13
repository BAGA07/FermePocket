import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Activity,
  BarChart2,
  RefreshCw,
  Plus,
  ArrowLeft,
  Search,
  TrendingUp,
  AlertTriangle,
  X,
  Calendar,
  DollarSign,
  Truck,
  Clock
} from 'lucide-react';

// Services
import stocksService from '../services/stocksService';

export default function StocksDashboard() {
  const navigate = useNavigate();
  
  // États principaux
  const [stocks, setStocks] = useState([]);
  const [mouvements, setMouvements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  // États pour les modales
  const [showAddStock, setShowAddStock] = useState(false);
  const [showAddMouvement, setShowAddMouvement] = useState(false);
  
  // États pour les formulaires
  const [nouveauStock, setNouveauStock] = useState({
    nom_aliment: '',
    type_aliment: 'granules',
    quantite_actuelle: '',
    unite: 'kg',
    seuil_alerte: '',
    prix_unitaire: '',
    fournisseur: ''
  });

  const [nouveauMouvement, setNouveauMouvement] = useState({
    stock_aliment_id: '',
    type_mouvement: 'entree',
    quantite: '',
    motif: '',
    date_mouvement: new Date().toISOString().split('T')[0]
  });

  // Chargement des données
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [stocksData, mouvementsData] = await Promise.all([
        stocksService.getStocks(),
        stocksService.getMouvements()
      ]);
      
      setStocks(Array.isArray(stocksData) ? stocksData : []);
      setMouvements(Array.isArray(mouvementsData) ? mouvementsData : []);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Actualisation des données
  const refreshData = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Ajouter un stock
  const handleAjouterStock = async (e) => {
    e.preventDefault();
    try {
      const stockData = {
        ...nouveauStock,
        quantite_actuelle: parseFloat(nouveauStock.quantite_actuelle),
        seuil_alerte: parseFloat(nouveauStock.seuil_alerte),
        prix_unitaire: parseFloat(nouveauStock.prix_unitaire)
      };

      await stocksService.createStock(stockData);
      await loadData();

      // Réinitialiser le formulaire
      setNouveauStock({
        nom_aliment: '',
        type_aliment: 'granules',
        quantite_actuelle: '',
        unite: 'kg',
        seuil_alerte: '',
        prix_unitaire: '',
        fournisseur: ''
      });
      setShowAddStock(false);
    } catch (err) {
      console.error('Erreur lors de l\'ajout du stock:', err);
      setError('Erreur lors de l\'ajout du stock');
    }
  };

  // Ajouter un mouvement
  const handleAjouterMouvement = async (e) => {
    e.preventDefault();
    try {
      const mouvementData = {
        ...nouveauMouvement,
        quantite: parseFloat(nouveauMouvement.quantite)
      };

      await stocksService.createMouvement(mouvementData);
      await loadData();

      // Réinitialiser le formulaire
      setNouveauMouvement({
        stock_aliment_id: '',
        type_mouvement: 'entree',
        quantite: '',
        motif: '',
        date_mouvement: new Date().toISOString().split('T')[0]
      });
      setShowAddMouvement(false);
    } catch (err) {
      console.error('Erreur lors de l\'ajout du mouvement:', err);
      setError('Erreur lors de l\'ajout du mouvement');
    }
  };

  // Chargement initial
  useEffect(() => {
    loadData();
  }, []);

  // Données filtrées
  const filteredStocks = stocks.filter(stock =>
    stock.nom_aliment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.type_aliment?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistiques
  const statistiques = {
    totalStocks: stocks.length,
    stocksFaibles: stocks.filter(s => s.quantite_actuelle <= s.seuil_alerte).length,
    totalMouvements: mouvements.length,
    valeurTotale: stocks.reduce((total, stock) => total + (stock.quantite_actuelle * stock.prix_unitaire), 0)
  };

  // Alertes stocks faibles
  const alertes = stocks.filter(stock =>
    stock.quantite_actuelle <= stock.seuil_alerte
  );

  // Mouvements récents (7 derniers jours)
  const mouvementsRecents = mouvements.filter(m => {
    const date = new Date(m.date_mouvement);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }).slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        <span className="ml-2">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord - Stocks</h1>

      {/* Message d'erreur */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Barre d'actions */}
      <div className="mb-6 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-white border rounded hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3 py-2 bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Actualiser
          </button>
        </div>
        
        <div className="flex-1 md:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un stock..."
              className="w-full pl-9 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddMouvement(true)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            <TrendingUp className="w-4 h-4" /> Ajouter mouvement
          </button>
          <button
            onClick={() => setShowAddStock(true)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> Ajouter stock
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Stocks</p>
              <p className="text-2xl font-bold">{statistiques.totalStocks}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Stocks Faibles</p>
              <p className="text-2xl font-bold text-red-600">{statistiques.stocksFaibles}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Mouvements</p>
              <p className="text-2xl font-bold">{statistiques.totalMouvements}</p>
            </div>
            <Activity className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Valeur Totale</p>
              <p className="text-2xl font-bold">{statistiques.valeurTotale.toFixed(2)}€</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Mouvements récents */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Mouvements récents
          </h2>
          {mouvementsRecents.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucun mouvement récent</p>
          ) : (
            <div className="space-y-3">
              {mouvementsRecents.map((mouvement, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      mouvement.type_mouvement === 'entree' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="font-medium">{mouvement.stock_aliment?.nom_aliment}</p>
                      <p className="text-sm text-gray-600">{mouvement.motif}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      mouvement.type_mouvement === 'entree' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {mouvement.type_mouvement === 'entree' ? '+' : '-'}{mouvement.quantite}
                    </p>
                    <p className="text-sm text-gray-600">{new Date(mouvement.date_mouvement).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top des stocks par valeur */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart2 className="w-5 h-5" />
            Top stocks par valeur
          </h2>
          {stocks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucun stock disponible</p>
          ) : (
            <div className="space-y-3">
              {stocks
                .sort((a, b) => (b.quantite_actuelle * b.prix_unitaire) - (a.quantite_actuelle * a.prix_unitaire))
                .slice(0, 5)
                .map((stock, index) => {
                  const valeur = stock.quantite_actuelle * stock.prix_unitaire;
                  const maxValeur = Math.max(...stocks.map(s => s.quantite_actuelle * s.prix_unitaire));
                  const pourcentage = (valeur / maxValeur) * 100;
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{stock.nom_aliment}</span>
                        <span className="text-sm font-bold">{valeur.toFixed(2)}€</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${pourcentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Alertes stocks faibles */}
      {alertes.length > 0 && (
        <div className="mb-6 bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4 text-red-600 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Alertes de stock faible
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {alertes.map((stock, index) => (
              <div key={index} className="flex justify-between items-center bg-red-50 p-3 rounded border-l-4 border-red-500">
                <div>
                  <span className="font-medium">{stock.nom_aliment}</span>
                  <p className="text-sm text-gray-600">{stock.fournisseur}</p>
                </div>
                <div className="text-right">
                  <span className="text-red-600 font-bold">
                    {stock.quantite_actuelle} {stock.unite}
                  </span>
                  <p className="text-sm text-gray-600">Seuil: {stock.seuil_alerte}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Liste des stocks */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Stocks actuels</h2>
        {filteredStocks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Aucun stock trouvé</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Nom</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Quantité</th>
                  <th className="text-left p-2">Prix unitaire</th>
                  <th className="text-left p-2">Valeur</th>
                  <th className="text-left p-2">Fournisseur</th>
                  <th className="text-left p-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                {filteredStocks.map((stock, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{stock.nom_aliment}</td>
                    <td className="p-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {stock.type_aliment}
                      </span>
                    </td>
                    <td className="p-2">{stock.quantite_actuelle} {stock.unite}</td>
                    <td className="p-2">{stock.prix_unitaire}€</td>
                    <td className="p-2 font-bold">{(stock.quantite_actuelle * stock.prix_unitaire).toFixed(2)}€</td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <Truck className="w-4 h-4 text-gray-400" />
                        {stock.fournisseur}
                      </div>
                    </td>
                    <td className="p-2">
                      {stock.quantite_actuelle <= stock.seuil_alerte ? (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                          Stock faible
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                          OK
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Ajouter un stock */}
      {showAddStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddStock(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Ajouter un stock</h3>
              <button onClick={() => setShowAddStock(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAjouterStock} className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Nom de l'aliment</label>
                <input 
                  className="w-full border rounded px-3 py-2" 
                  value={nouveauStock.nom_aliment} 
                  onChange={e => setNouveauStock(s => ({ ...s, nom_aliment: e.target.value }))} 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Type</label>
                  <select 
                    className="w-full border rounded px-3 py-2" 
                    value={nouveauStock.type_aliment} 
                    onChange={e => setNouveauStock(s => ({ ...s, type_aliment: e.target.value }))}
                  >
                    <option value="granules">Granulés</option>
                    <option value="farine">Farine</option>
                    <option value="medicament">Médicament</option>
                    <option value="complement">Complément</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Unité</label>
                  <select 
                    className="w-full border rounded px-3 py-2" 
                    value={nouveauStock.unite} 
                    onChange={e => setNouveauStock(s => ({ ...s, unite: e.target.value }))}
                  >
                    <option value="kg">kg</option>
                    <option value="sac">sac</option>
                    <option value="unite">unité</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm mb-1">Quantité</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="w-full border rounded px-3 py-2" 
                    value={nouveauStock.quantite_actuelle} 
                    onChange={e => setNouveauStock(s => ({ ...s, quantite_actuelle: e.target.value }))} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Seuil alerte</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="w-full border rounded px-3 py-2" 
                    value={nouveauStock.seuil_alerte} 
                    onChange={e => setNouveauStock(s => ({ ...s, seuil_alerte: e.target.value }))} 
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Prix unitaire</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="w-full border rounded px-3 py-2" 
                    value={nouveauStock.prix_unitaire} 
                    onChange={e => setNouveauStock(s => ({ ...s, prix_unitaire: e.target.value }))} 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Fournisseur</label>
                <input 
                  className="w-full border rounded px-3 py-2" 
                  value={nouveauStock.fournisseur} 
                  onChange={e => setNouveauStock(s => ({ ...s, fournisseur: e.target.value }))} 
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddStock(false)} className="px-3 py-2 border rounded">
                  Annuler
                </button>
                <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Ajouter un mouvement */}
      {showAddMouvement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddMouvement(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Ajouter un mouvement</h3>
              <button onClick={() => setShowAddMouvement(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAjouterMouvement} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Stock</label>
                  <select 
                    className="w-full border rounded px-3 py-2" 
                    value={nouveauMouvement.stock_aliment_id} 
                    onChange={e => setNouveauMouvement(m => ({ ...m, stock_aliment_id: e.target.value }))} 
                    required
                  >
                    <option value="">Sélectionner…</option>
                    {stocks.map(s => (
                      <option key={s.id} value={s.id}>{s.nom_aliment}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Type</label>
                  <select 
                    className="w-full border rounded px-3 py-2" 
                    value={nouveauMouvement.type_mouvement} 
                    onChange={e => setNouveauMouvement(m => ({ ...m, type_mouvement: e.target.value }))}
                  >
                    <option value="entree">Entrée</option>
                    <option value="sortie">Sortie</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm mb-1">Quantité</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="w-full border rounded px-3 py-2" 
                    value={nouveauMouvement.quantite} 
                    onChange={e => setNouveauMouvement(m => ({ ...m, quantite: e.target.value }))} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Date</label>
                  <input 
                    type="date" 
                    className="w-full border rounded px-3 py-2" 
                    value={nouveauMouvement.date_mouvement} 
                    onChange={e => setNouveauMouvement(m => ({ ...m, date_mouvement: e.target.value }))} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Motif</label>
                  <input 
                    className="w-full border rounded px-3 py-2" 
                    value={nouveauMouvement.motif} 
                    onChange={e => setNouveauMouvement(m => ({ ...m, motif: e.target.value }))} 
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddMouvement(false)} className="px-3 py-2 border rounded">
                  Annuler
                </button>
                <button type="submit" className="px-3 py-2 bg-emerald-600 text-white rounded">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}