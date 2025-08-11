import { useState } from "react";

export default function Stocks() {
  const [stocks, setStocks] = useState([
    { id: 1, nom: "Maïs", quantite: 500, unite: "kg", valeur: 150000, dateEntree: "2025-07-15" },
    { id: 2, nom: "Aliment poulet", quantite: 300, unite: "kg", valeur: 90000, dateEntree: "2025-07-20" },
    { id: 3, nom: "Médicaments", quantite: 50, unite: "boites", valeur: 45000, dateEntree: "2025-07-28" },
  ]);

  const supprimerStock = (id) => {
    if (confirm("Voulez-vous vraiment supprimer cet élément du stock ?")) {
      setStocks(stocks.filter((item) => item.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestion des stocks</h1>
        <a
          href="/stocks/ajouter"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          + Ajouter un produit
        </a>
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-green-50 text-green-700">
            <tr>
              <th className="px-4 py-3 text-left">Produit</th>
              <th className="px-4 py-3 text-left">Quantité</th>
              <th className="px-4 py-3 text-left">Valeur (FCFA)</th>
              <th className="px-4 py-3 text-left">Date d'entrée</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, index) => (
              <tr
                key={stock.id}
                className={`border-t hover:bg-green-50 transition ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="px-4 py-3">{stock.nom}</td>
                <td className="px-4 py-3">{stock.quantite} {stock.unite}</td>
                <td className="px-4 py-3">{stock.valeur.toLocaleString()}</td>
                <td className="px-4 py-3">{stock.dateEntree}</td>
                <td className="px-4 py-3 flex gap-3">
                  <a href={`/stocks/modifier/${stock.id}`} className="text-blue-600 hover:underline">
                    ✏ Modifier
                  </a>
                  <button
                    onClick={() => supprimerStock(stock.id)}
                    className="text-red-600 hover:underline"
                  >
                    🗑 Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
