import { useState, useMemo, useCallback } from 'react';
import {
  Edit,
  Trash2,
  Plus,
  Search,
  ArrowUpDown,
  Filter,
  AlertCircle,
  Loader2,
  ChevronDown,
  X,
  BarChart2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

// Composant d'animation pour les éléments de la liste
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3
    }
  })
};

const StockItem = ({ stock, onEdit, onDelete, index }) => {
  const isStockLow = stock.quantite_actuelle <= stock.seuil_alerte;
  const stockPercentage = Math.min(100, (stock.quantite_actuelle / (stock.quantite_max || stock.quantite_actuelle * 2)) * 100);

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      custom={index % 10} // Pour l'animation en cascade
      layout
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900 truncate">{stock.nom_aliment}</h4>
              <div className="text-xs text-gray-400 flex items-center">
                <BarChart2 size={14} className="mr-1" />
                {format(parseISO(stock.updated_at), 'dd/MM/yyyy', { locale: fr })}
              </div>
            </div>

            {stock.description && (
              <div className="mt-1 text-sm text-gray-600 line-clamp-2">{stock.description}</div>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {stock.type_aliment}
              </span>

              <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full flex items-center ${isStockLow
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-green-800'
                }`}>
                {stock.quantite_actuelle} {stock.unite}
                {stock.seuil_alerte && (
                  <span className="ml-1 text-xs opacity-75">
                    (seuil: {stock.seuil_alerte} {stock.unite})
                  </span>
                )}
              </span>

              {stock.prix_unitaire && (
                <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                  {parseFloat(stock.prix_unitaire).toFixed(2)} €/{stock.unite}
                </span>
              )}

              {isStockLow && (
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-full flex items-center gap-1">
                  <AlertTriangle size={12} />
                  Stock faible
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(stock);
              }}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              aria-label="Modifier"
              title="Modifier le stock"
            >
              <Edit className="w-4 h-4" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Êtes-vous sûr de vouloir supprimer le stock "${stock.nom_aliment}" ?`)) {
                  onDelete(stock.id);
                }
              }}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              aria-label="Supprimer"
              title="Supprimer le stock"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${isStockLow
                  ? 'bg-red-500'
                  : stock.quantite_actuelle > (stock.quantite_max * 0.7)
                    ? 'bg-green-500'
                    : 'bg-blue-500'
                }`}
              style={{ width: `${stockPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0 {stock.unite}</span>
            <span>{stock.quantite_max ? `${stock.quantite_max} ${stock.unite}` : 'Illimité'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StockList = ({
  stocks = [],
  onAdd,
  onEdit,
  onDelete,
  loading = false,
  error = null
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: 'tous',
    statut: 'tous',
    sortBy: 'quantite',
    sortOrder: 'asc',
    fournisseur: 'tous',
    unite: 'toutes'
  });

  // Extraire les filtres uniques pour les options
  const filterOptions = useMemo(() => {
    const types = new Set();
    const fournisseurs = new Set();
    const unites = new Set();

    stocks.forEach(stock => {
      if (stock.type_aliment) types.add(stock.type_aliment);
      if (stock.fournisseur) fournisseurs.add(stock.fournisseur);
      if (stock.unite) unites.add(stock.unite);
    });

    return {
      types: Array.from(types).sort(),
      fournisseurs: Array.from(fournisseurs).sort(),
      unites: Array.from(unites).sort()
    };
  }, [stocks]);

  const filteredStocks = useMemo(() => {
    return stocks.filter(stock => {
      // Filtre par recherche
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        stock.nom_aliment?.toLowerCase().includes(searchLower) ||
        stock.description?.toLowerCase().includes(searchLower) ||
        stock.reference?.toLowerCase().includes(searchLower) ||
        stock.fournisseur?.toLowerCase().includes(searchLower);

      // Filtres avancés
      const matchesType = filters.type === 'tous' || stock.type_aliment === filters.type;
      const matchesStatus = filters.statut === 'tous' ||
        (filters.statut === 'faible' && stock.quantite_actuelle <= stock.seuil_alerte) ||
        (filters.statut === 'normal' && stock.quantite_actuelle > stock.seuil_alerte);

      const matchesFournisseur = filters.fournisseur === 'tous' || stock.fournisseur === filters.fournisseur;
      const matchesUnite = filters.unite === 'toutes' || stock.unite === filters.unite;

      return matchesSearch && matchesType && matchesStatus && matchesFournisseur && matchesUnite;
    }).sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case 'nom':
          comparison = a.nom_aliment.localeCompare(b.nom_aliment);
          break;
        case 'quantite':
          comparison = a.quantite_actuelle - b.quantite_actuelle;
          break;
        case 'type':
          comparison = a.type_aliment.localeCompare(b.type_aliment);
          break;
        case 'date':
          comparison = new Date(a.updated_at) - new Date(b.updated_at);
          break;
        case 'seuil':
          comparison = (a.quantite_actuelle / a.seuil_alerte) - (b.quantite_actuelle / b.seuil_alerte);
          break;
        default:
          comparison = 0;
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [stocks, searchTerm, filters]);

  const handleSort = (field) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  const resetFilters = () => {
    setFilters({
      type: 'tous',
      statut: 'tous',
      sortBy: 'quantite',
      sortOrder: 'asc',
      fournisseur: 'tous',
      unite: 'toutes'
    });
    setSearchTerm('');
  };

  const activeFilterCount = [
    filters.type !== 'tous',
    filters.statut !== 'tous',
    searchTerm.length > 0
  ].filter(Boolean).length;

  // État de chargement amélioré
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
        </div>
        <p className="text-gray-600">Chargement des stocks en cours...</p>
        <p className="text-sm text-gray-400">Veuillez patienter</p>
      </div>
    );
  }

  // Gestion des erreurs améliorée
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg shadow-sm"
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-6 w-6 text-red-400" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-red-800">Erreur lors du chargement des stocks</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error.message || 'Une erreur inattendue est survenue'}</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // État vide
  if (!loading && stocks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 px-4 sm:px-6 lg:px-8"
      >
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M20 7l-8-4.5L4 7m16 0l-8 4.5M4 7v9.5l8 4.5m0-14l8 4.5M4 16.5l8 4.5 8-4.5m0-9.5v9.5"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun stock disponible</h3>
        <p className="mt-1 text-sm text-gray-500">Commencez par ajouter un nouveau stock.</p>
        <div className="mt-6">
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="-ml-1 mr-2 h-4 w-4" />
            Ajouter un stock
          </button>
        </div>
      </motion.div>
    );
  }

  // En-têtes de tri
  const renderHeader = () => (
    <div className="bg-gray-50 px-4 py-2 rounded-md hidden sm:grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
      <button
        className="col-span-5 flex items-center hover:text-gray-700"
        onClick={() => setFilters({
          ...filters,
          sortBy: 'nom',
          sortOrder: filters.sortBy === 'nom' && filters.sortOrder === 'asc' ? 'desc' : 'asc'
        })}
      >
        Nom
        <ArrowUpDown className="ml-1 h-3 w-3" />
      </button>
      <div className="col-span-2">Type</div>
      <button
        className="col-span-2 flex items-center hover:text-gray-700"
        onClick={() => setFilters({
          ...filters,
          sortBy: 'quantite',
          sortOrder: filters.sortBy === 'quantite' && filters.sortOrder === 'asc' ? 'desc' : 'asc'
        })}
      >
        Quantité
        <ArrowUpDown className="ml-1 h-3 w-3" />
      </button>
      <div className="col-span-2">Statut</div>
      <div className="col-span-1">Actions</div>
    </div>
  );

  return (
    <div className="space-y-4">
      {renderHeader()}

      {/* Liste des stocks */}
      <div className="space-y-2">
        {filteredStocks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">Aucun stock trouvé</p>
            <button
              onClick={onAdd}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              Ajouter un stock
            </button>
          </div>
        ) : (
          filteredStocks.map((stock, index) => (
            <StockItem
              key={stock.id}
              stock={stock}
              onEdit={onEdit}
              onDelete={onDelete}
              index={index}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default StockList;
