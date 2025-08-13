import { X } from "lucide-react";

export function ModalAjouterLot({ 
  showAddLot, 
  setShowAddLot, 
  nouveauLot, 
  setNouveauLot, 
  handleAjouterLot, 
  loading 
}) {
  if (!showAddLot) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Ajouter un nouveau lot</h3>
          <button
            onClick={() => setShowAddLot(false)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleAjouterLot} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du lot
            </label>
            <input
              type="text"
              value={nouveauLot.nom_lot}
              onChange={(e) => setNouveauLot({ ...nouveauLot, nom_lot: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Lot Poules Pondeuses 2024"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de volaille
            </label>
            <select
              value={nouveauLot.type_volaille}
              onChange={(e) => setNouveauLot({ ...nouveauLot, type_volaille: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="chair">Chair</option>
              <option value="pondeuse">Pondeuse</option>
              <option value="reproducteur">Reproducteur</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantité
            </label>
            <input
              type="number"
              value={nouveauLot.quantite}
              onChange={(e) => setNouveauLot({ ...nouveauLot, quantite: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: 100"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date d'arrivée
            </label>
            <input
              type="date"
              value={nouveauLot.date_arrivee}
              onChange={(e) => setNouveauLot({ ...nouveauLot, date_arrivee: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Origine
            </label>
            <input
              type="text"
              value={nouveauLot.origine}
              onChange={(e) => setNouveauLot({ ...nouveauLot, origine: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Ferme Martin"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowAddLot(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ModalAjouterVaccination({ 
  showAddVaccination, 
  setShowAddVaccination, 
  nouvelleVaccination, 
  setNouvelleVaccination, 
  handleAjouterVaccination, 
  loading, 
  lots 
}) {
  if (!showAddVaccination) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Ajouter une vaccination</h3>
          <button
            onClick={() => setShowAddVaccination(false)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleAjouterVaccination} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lot de volailles
            </label>
            <select
              value={nouvelleVaccination.lot_volaille_id}
              onChange={(e) => setNouvelleVaccination({ ...nouvelleVaccination, lot_volaille_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Sélectionner un lot</option>
              {lots.map((lot) => (
                <option key={lot.id} value={lot.id}>
                  {lot.nom_lot} ({lot.quantite} volailles)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vaccin
            </label>
            <input
              type="text"
              value={nouvelleVaccination.vaccin}
              onChange={(e) => setNouvelleVaccination({ ...nouvelleVaccination, vaccin: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Newcastle, Bronchite infectieuse"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de vaccination
            </label>
            <input
              type="date"
              value={nouvelleVaccination.date_vaccination}
              onChange={(e) => setNouvelleVaccination({ ...nouvelleVaccination, date_vaccination: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dose
            </label>
            <input
              type="text"
              value={nouvelleVaccination.dose}
              onChange={(e) => setNouvelleVaccination({ ...nouvelleVaccination, dose: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: 0.5ml par volaille"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observations
            </label>
            <textarea
              value={nouvelleVaccination.observations}
              onChange={(e) => setNouvelleVaccination({ ...nouvelleVaccination, observations: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Observations sur la vaccination..."
              rows="3"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowAddVaccination(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
