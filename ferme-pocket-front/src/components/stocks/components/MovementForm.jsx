import { useState, useEffect } from 'react';
import { X, Save, AlertCircle, ArrowDown, ArrowUp } from 'lucide-react';

const MovementForm = ({ 
  initialData = null, 
  stocks = [],
  onSubmit, 
  onCancel,
  loading = false,
  error = null
}) => {
  const [formData, setFormData] = useState({
    stock_aliment_id: '',
    type_mouvement: 'entree',
    quantite: '',
    date_mouvement: new Date().toISOString().split('T')[0],
    motif: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  // Initialiser le formulaire avec les données existantes en mode édition
  useEffect(() => {
    if (initialData) {
      setFormData({
        stock_aliment_id: initialData.stock_aliment_id?.toString() || '',
        type_mouvement: initialData.type_mouvement || 'entree',
        quantite: initialData.quantite?.toString() || '',
        date_mouvement: initialData.date_mouvement 
          ? new Date(initialData.date_mouvement).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        motif: initialData.motif || '',
        notes: initialData.notes || ''
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.stock_aliment_id) {
      newErrors.stock_aliment_id = 'Veuillez sélectionner un stock';
    }
    
    if (!formData.quantite || isNaN(parseFloat(formData.quantite)) || parseFloat(formData.quantite) <= 0) {
      newErrors.quantite = 'Veuillez entrer une quantité valide';
    }
    
    if (!formData.date_mouvement) {
      newErrors.date_mouvement = 'La date est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const dataToSubmit = {
        ...formData,
        quantite: parseFloat(formData.quantite),
        stock_aliment_id: parseInt(formData.stock_aliment_id)
      };
      onSubmit(dataToSubmit);
    }
  };

  const selectedStock = stocks.find(s => s.id === parseInt(formData.stock_aliment_id));
  const isEntree = formData.type_mouvement === 'entree';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Type de mouvement */}
        <div className="sm:col-span-2">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => handleChange({ target: { name: 'type_mouvement', value: 'entree' } })}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                isEntree 
                  ? 'bg-green-100 text-green-700 border-green-300' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <ArrowDown className="w-4 h-4 mr-2" />
                Entrée de stock
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleChange({ target: { name: 'type_mouvement', value: 'sortie' } })}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
                !isEntree 
                  ? 'bg-red-100 text-red-700 border-red-300' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <ArrowUp className="w-4 h-4 mr-2" />
                Sortie de stock
              </div>
            </button>
          </div>
        </div>

        {/* Sélection du stock */}
        <div className="sm:col-span-2">
          <label htmlFor="stock_aliment_id" className="block text-sm font-medium text-gray-700">
            Stock <span className="text-red-500">*</span>
          </label>
          <select
            id="stock_aliment_id"
            name="stock_aliment_id"
            value={formData.stock_aliment_id}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm ${
              errors.stock_aliment_id ? 'border-red-300' : ''
            }`}
          >
            <option value="">Sélectionner un stock</option>
            {stocks.map(stock => (
              <option key={stock.id} value={stock.id}>
                {stock.nom_aliment} ({stock.type_aliment}) - {stock.quantite_actuelle} {stock.unite}
              </option>
            ))}
          </select>
          {errors.stock_aliment_id && (
            <p className="mt-1 text-sm text-red-600">{errors.stock_aliment_id}</p>
          )}
        </div>

        {/* Quantité */}
        <div>
          <label htmlFor="quantite" className="block text-sm font-medium text-gray-700">
            Quantité <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              name="quantite"
              id="quantite"
              step="0.01"
              min="0.01"
              value={formData.quantite}
              onChange={handleChange}
              className={`block w-full rounded-md border-gray-300 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.quantite ? 'border-red-300' : ''
              }`}
              placeholder="0.00"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">
                {selectedStock?.unite || 'unité'}
              </span>
            </div>
          </div>
          {errors.quantite && (
            <p className="mt-1 text-sm text-red-600">{errors.quantite}</p>
          )}
          {selectedStock && (
            <p className="mt-1 text-xs text-gray-500">
              Stock actuel: {selectedStock.quantite_actuelle} {selectedStock.unite}
              {!isEntree && selectedStock.quantite_actuelle < parseFloat(formData.quantite || 0) && (
                <span className="ml-2 text-red-600 font-medium">
                  Attention: stock insuffisant
                </span>
              )}
            </p>
          )}
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date_mouvement" className="block text-sm font-medium text-gray-700">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="date_mouvement"
            id="date_mouvement"
            value={formData.date_mouvement}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.date_mouvement ? 'border-red-300' : ''
            }`}
          />
          {errors.date_mouvement && (
            <p className="mt-1 text-sm text-red-600">{errors.date_mouvement}</p>
          )}
        </div>

        {/* Motif */}
        <div className="sm:col-span-2">
          <label htmlFor="motif" className="block text-sm font-medium text-gray-700">
            Motif
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="motif"
              id="motif"
              value={formData.motif}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Ex: Livraison fournisseur, Utilisation élevage..."
            />
          </div>
        </div>

        {/* Notes */}
        <div className="sm:col-span-2">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <div className="mt-1">
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Informations complémentaires..."
            />
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={loading}
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
            isEntree ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isEntree ? 'focus:ring-green-500' : 'focus:ring-red-500'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enregistrement...
            </>
          ) : isEntree ? (
            <>
              <ArrowDown className="-ml-1 mr-2 h-4 w-4" />
              Enregistrer l'entrée
            </>
          ) : (
            <>
              <ArrowUp className="-ml-1 mr-2 h-4 w-4" />
              Enregistrer la sortie
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default MovementForm;
