import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

const StockForm = ({ initialData = null, onSubmit, onCancel, loading = false, error = null }) => {
  const [formData, setFormData] = useState({
    nom_aliment: '',
    type_aliment: 'granules',
    quantite_actuelle: '',
    seuil_alerte: '',
    unite: 'kg',
    prix_unitaire: '',
    fournisseur: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        nom_aliment: initialData.nom_aliment || '',
        type_aliment: initialData.type_aliment || 'granules',
        quantite_actuelle: initialData.quantite_actuelle?.toString() || '',
        seuil_alerte: initialData.seuil_alerte?.toString() || '',
        unite: initialData.unite || 'kg',
        prix_unitaire: initialData.prix_unitaire?.toString() || '',
        fournisseur: initialData.fournisseur || ''
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.nom_aliment.trim()) newErrors.nom_aliment = 'Le nom est requis';
    if (!formData.quantite_actuelle || isNaN(parseFloat(formData.quantite_actuelle))) {
      newErrors.quantite_actuelle = 'Quantité invalide';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const dataToSubmit = {
        ...formData,
        quantite_actuelle: parseFloat(formData.quantite_actuelle),
        seuil_alerte: formData.seuil_alerte ? parseFloat(formData.seuil_alerte) : null,
        prix_unitaire: formData.prix_unitaire ? parseFloat(formData.prix_unitaire) : null
      };
      onSubmit(dataToSubmit);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Nom de l'aliment <span className="text-red-500">*</span>
          </label>
          <input
            name="nom_aliment"
            value={formData.nom_aliment}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm ${
              errors.nom_aliment ? 'border-red-300' : ''
            }`}
          />
          {errors.nom_aliment && (
            <p className="mt-1 text-sm text-red-600">{errors.nom_aliment}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            name="type_aliment"
            value={formData.type_aliment}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="granules">Granulés</option>
            <option value="farine">Farine</option>
            <option value="medicament">Médicament</option>
            <option value="complement">Complément</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Unité</label>
          <select
            name="unite"
            value={formData.unite}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="l">L</option>
            <option value="ml">mL</option>
            <option value="unite">Unité</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quantité <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="quantite_actuelle"
            step="0.01"
            min="0"
            value={formData.quantite_actuelle}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm ${
              errors.quantite_actuelle ? 'border-red-300' : ''
            }`}
          />
          {errors.quantite_actuelle && (
            <p className="mt-1 text-sm text-red-600">{errors.quantite_actuelle}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Seuil d'alerte
          </label>
          <input
            type="number"
            name="seuil_alerte"
            step="0.01"
            min="0"
            value={formData.seuil_alerte}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            Alerte quand le stock est inférieur
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Prix unitaire
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              name="prix_unitaire"
              step="0.01"
              min="0"
              value={formData.prix_unitaire}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 pr-12 sm:text-sm"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">FCFA</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fournisseur
          </label>
          <input
            type="text"
            name="fournisseur"
            value={formData.fournisseur}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="-ml-1 mr-2 h-4 w-4" />
              Enregistrer
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default StockForm;
