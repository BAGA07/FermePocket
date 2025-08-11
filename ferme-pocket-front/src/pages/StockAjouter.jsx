import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function StockAjouter() {
  const navigate = useNavigate();
  const [nom, setNom] = useState("");
  const [quantite, setQuantite] = useState("");
  const [unite, setUnite] = useState("kg");
  const [valeur, setValeur] = useState("");
  const [dateEntree, setDateEntree] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Produit ajouté au stock avec succès !");
    navigate("/stocks");
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Ajouter un produit au stock</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-6 space-y-5"
      >
        <div>
          <label className="block mb-1 font-medium">Nom du produit</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="Ex: Maïs"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Quantité</label>
          <input
            type="number"
            value={quantite}
            onChange={(e) => setQuantite(e.target.value)}
            className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Unité</label>
          <select
            value={unite}
            onChange={(e) => setUnite(e.target.value)}
            className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="kg">Kg</option>
            <option value="boites">Boîtes</option>
            <option value="litres">Litres</option>
            <option value="unités">Unités</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Valeur (FCFA)</label>
          <input
            type="number"
            value={valeur}
            onChange={(e) => setValeur(e.target.value)}
            className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Date d'entrée</label>
          <input
            type="date"
            value={dateEntree}
            onChange={(e) => setDateEntree(e.target.value)}
            className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
        >
          💾 Enregistrer
        </button>
      </form>
    </div>
  );
}
