import { useMemo } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, PieChart as PieChartIcon, AlertTriangle } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const ChartCard = ({ title, icon: Icon, children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
    <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
      <Icon className="w-5 h-5 mr-2 text-blue-600" />
      {title}
    </h3>
    <div className="h-64">
      {children}
    </div>
  </div>
);

const StocksCharts = ({ stocks = [], mouvements = [], loading = false, error = null }) => {
  // Données d'évolution mensuelle
  const evolutionData = useMemo(() => {
    if (loading || error) return [];
    
    // Grouper les mouvements par mois
    const monthlyData = {};
    
    mouvements.forEach(mouvement => {
      const date = new Date(mouvement.date_mouvement);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          mois: date.toLocaleString('fr-FR', { month: 'short', year: '2-digit' }),
          entree: 0,
          sortie: 0,
          solde: 0
        };
      }
      
      if (mouvement.type_mouvement === 'entree') {
        monthlyData[monthYear].entree += parseFloat(mouvement.quantite);
        monthlyData[monthYear].solde += parseFloat(mouvement.quantite);
      } else {
        monthlyData[monthYear].sortie += parseFloat(mouvement.quantite);
        monthlyData[monthYear].solde -= parseFloat(mouvement.quantite);
      }
    });
    
    return Object.values(monthlyData).sort((a, b) => a.mois.localeCompare(b.mois));
  }, [mouvements, loading, error]);

  // Données de répartition
  const repartitionData = useMemo(() => {
    if (loading || error) return [];
    return stocks
      .filter(stock => stock.quantite_actuelle > 0)
      .sort((a, b) => b.quantite_actuelle - a.quantite_actuelle)
      .slice(0, 5)
      .map(stock => ({
        name: stock.nom_aliment,
        value: parseFloat(stock.quantite_actuelle),
        unite: stock.unite
      }));
  }, [stocks, loading, error]);

  // Alertes de stock bas
  const alertes = useMemo(() => {
    if (loading || error) return [];
    return stocks.filter(stock => 
      stock.quantite_actuelle <= (stock.seuil_alerte || 0) && 
      stock.quantite_actuelle > 0
    );
  }, [stocks, loading, error]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="bg-red-50 p-4 rounded-md">
      <p className="text-red-700">Erreur: {error}</p>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Graphique d'évolution */}
      <ChartCard title="Évolution des stocks" icon={TrendingUp}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={evolutionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={v => v.toLocaleString('fr-FR')} width={60} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="entree" name="Entrées" stroke="#10b981" />
            <Line type="monotone" dataKey="sortie" name="Sorties" stroke="#ef4444" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Graphique de répartition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="Répartition des stocks" icon={PieChartIcon}>
          {repartitionData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={repartitionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => 
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {repartitionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Quantité']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Aucune donnée disponible
            </div>
          )}
        </ChartCard>

        {/* Alertes de stock */}
        <ChartCard title="Alertes de stock" icon={AlertTriangle}>
          {alertes.length > 0 ? (
            <div className="space-y-3 p-2 overflow-y-auto h-full">
              {alertes.map((stock, index) => (
                <div key={index} className="bg-red-50 p-3 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-red-800">{stock.nom_aliment}</h4>
                      <p className="text-sm text-red-600">
                        Stock: {stock.quantite_actuelle} {stock.unite} (Seuil: {stock.seuil_alerte} {stock.unite})
                      </p>
                    </div>
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Stock bas
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-green-600 p-4 text-center">
              <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <p className="font-medium">Aucune alerte de stock</p>
              <p className="text-sm text-gray-500 mt-1">Tous les stocks sont à un niveau correct</p>
            </div>
          )}
        </ChartCard>
      </div>
    </div>
  );
};

export default StocksCharts;
