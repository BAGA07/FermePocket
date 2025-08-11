import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

export default function StocksDashboard() {
  // 📊 Données d'évolution mensuelle
  const evolutionStock = [
    { mois: "Jan", quantite: 800 },
    { mois: "Fév", quantite: 950 },
    { mois: "Mar", quantite: 700 },
    { mois: "Avr", quantite: 1100 },
    { mois: "Mai", quantite: 900 },
    { mois: "Juin", quantite: 1000 },
  ];

  // 🥗 Données répartition par produit
  const repartitionProduits = [
    { name: "Maïs", value: 500 },
    { name: "Aliment poulet", value: 300 },
    { name: "Médicaments", value: 50 },
    { name: "Autres", value: 150 },
  ];

  const COLORS = ["#16a34a", "#22c55e", "#86efac", "#bbf7d0"];

  // ⚠️ Détection stocks faibles
  const alertes = repartitionProduits.filter(p => p.value < 100);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tableau de bord - Stocks</h1>

      {/* Graphiques */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Évolution des stocks */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Évolution mensuelle du stock</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={evolutionStock}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="quantite" stroke="#16a34a" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Répartition par produit */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Répartition par type de produit</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={repartitionProduits}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {repartitionProduits.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Alertes stocks faibles */}
      <div className="mt-6 bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4 text-red-600">⚠️ Alertes de stock faible</h2>
        {alertes.length === 0 ? (
          <p className="text-gray-500">Aucune alerte, tout est OK ✅</p>
        ) : (
          <ul className="space-y-2">
            {alertes.map((p, i) => (
              <li key={i} className="flex justify-between bg-red-50 p-2 rounded">
                <span>{p.name}</span>
                <span className="font-bold">{p.value}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
