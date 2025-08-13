import { useState, useMemo } from 'react';
import { Search, ArrowUpDown, Filter, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const MovementItem = ({ mouvement, onView }) => {
  const isEntree = mouvement.type_mouvement === 'entree';
  
  return (
    <div 
      className="bg-white rounded-lg shadow-sm p-3 mb-2 hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => onView(mouvement)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-full ${isEntree ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {isEntree ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
            </div>
            <h4 className="font-medium text-gray-900 truncate">
              {mouvement.stock_aliment?.nom_aliment || 'Stock inconnu'}
            </h4>
          </div>
          
          <div className="mt-1 text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
            <span className="flex items-center">
              <span className="font-medium mr-1">
                {isEntree ? '+' : '-'}{mouvement.quantite} 
              </span>
              {mouvement.stock_aliment?.unite}
            </span>
            
            {mouvement.motif && (
              <span className="text-gray-500">
                {mouvement.motif}
              </span>
            )}
            
            <span className="text-gray-400">
              {format(new Date(mouvement.date_mouvement), 'PP', { locale: fr })}
            </span>
          </div>
        </div>
        
        <div className={`text-sm font-medium ${isEntree ? 'text-green-600' : 'text-red-600'}`}>
          {isEntree ? 'Entrée' : 'Sortie'}
        </div>
      </div>
    </div>
  );
};

const MovementsList = ({ 
  mouvements = [], 
  stocks = [],
  onAdd, 
  onView,
  loading = false, 
  error = null 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'tous',
    stock: 'tous',
    sortBy: 'date',
    sortOrder: 'desc',
    dateRange: '30days'
  });

  const filteredMovements = useMemo(() => {
    const now = new Date();
    let startDate = new Date();
    
    switch(filters.dateRange) {
      case '7days':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '90days':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'all':
      default:
        startDate = new Date(0); // Date très ancienne
    }

    return mouvements
      .filter(mouvement => {
        const matchesSearch = 
          mouvement.stock_aliment?.nom_aliment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mouvement.motif?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = 
          filters.type === 'tous' || 
          mouvement.type_mouvement === filters.type;
          
        const matchesStock = 
          filters.stock === 'tous' || 
          mouvement.stock_aliment_id === parseInt(filters.stock);
          
        const matchesDate = 
          new Date(mouvement.date_mouvement) >= startDate;
        
        return matchesSearch && matchesType && matchesStock && matchesDate;
      })
      .sort((a, b) => {
        let comparison = 0;
        
        switch(filters.sortBy) {
          case 'date':
            comparison = new Date(a.date_mouvement) - new Date(b.date_mouvement);
            break;
          case 'quantite':
            comparison = a.quantite - b.quantite;
            break;
          case 'nom':
            comparison = a.stock_aliment?.nom_aliment.localeCompare(b.stock_aliment?.nom_aliment || '');
            break;
          default:
            comparison = 0;
        }
        
        return filters.sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [mouvements, searchTerm, filters]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Erreur lors du chargement des mouvements: {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barre de recherche et filtres */}
      <div className="space-y-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Rechercher un mouvement..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={filters.type}
              onChange={(e) => setFilters(f => ({...f, type: e.target.value}))}
            >
              <option value="tous">Tous les types</option>
              <option value="entree">Entrées</option>
              <option value="sortie">Sorties</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={filters.stock}
              onChange={(e) => setFilters(f => ({...f, stock: e.target.value}))}
            >
              <option value="tous">Tous les stocks</option>
              {stocks.map(stock => (
                <option key={stock.id} value={stock.id}>
                  {stock.nom_aliment}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={filters.dateRange}
              onChange={(e) => setFilters(f => ({...f, dateRange: e.target.value}))}
            >
              <option value="7days">7 derniers jours</option>
              <option value="30days">30 derniers jours</option>
              <option value="90days">3 derniers mois</option>
              <option value="all">Toutes les dates</option>
            </select>
          </div>
          
          <button
            onClick={onAdd}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ml-auto"
          >
            <Plus className="-ml-0.5 mr-2 h-4 w-4" />
            Ajouter
          </button>
        </div>
      </div>

      {/* Liste des mouvements */}
      <div className="space-y-2">
        {filteredMovements.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">Aucun mouvement trouvé</p>
            <button
              onClick={onAdd}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              Ajouter un mouvement
            </button>
          </div>
        ) : (
          filteredMovements.map(mouvement => (
            <MovementItem 
              key={mouvement.id}
              mouvement={mouvement}
              onView={onView}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MovementsList;
