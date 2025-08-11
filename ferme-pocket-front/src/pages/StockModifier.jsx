import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

export default function StockModifier() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [nom, setNom] = useState("Maïs");
  const [quantite, setQuantite] = useState(500);
  const [unite, setUnite] = useState("kg");
  const [valeur, setValeur] = useState(150000);
  const [dateEntree, setDateEntree] = useState("2025-07-15");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Produit modifié avec succès !");
    navigate("/stocks");
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Modifier un produit du stock</h1>
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
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          ✏ Modifier
        </button>
      </form>
    </div>
  );
}
