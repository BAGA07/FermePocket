export default function Ventes() {
  const ventes = [
    { id: 1, produit: "Poulets chair", quantite: 50, prix: 2500, date: "2025-07-10" },
    { id: 2, produit: "Œufs", quantite: 200, prix: 150, date: "2025-07-12" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Suivi des ventes</h1>
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-green-50 text-green-700">
            <tr>
              <th className="px-4 py-3 text-left">Produit</th>
              <th className="px-4 py-3 text-left">Quantité</th>
              <th className="px-4 py-3 text-left">Prix unitaire (FCFA)</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {ventes.map((v, i) => (
              <tr key={v.id} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="px-4 py-3">{v.produit}</td>
                <td className="px-4 py-3">{v.quantite}</td>
                <td className="px-4 py-3">{v.prix.toLocaleString()}</td>
                <td className="px-4 py-3">{v.date}</td>
                <td className="px-4 py-3 font-bold">{(v.quantite * v.prix).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
