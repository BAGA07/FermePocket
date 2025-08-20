import { useState, useEffect } from "react";
import { Users, Package, DollarSign, ShoppingCart, Calendar, CheckCircle, RefreshCw, EggFried, EggFriedIcon, Egg } from "lucide-react";
import WelcomeHeader from "../components/WelcomeHeader";
import CardDataStats from "../components/CardDataStats";
import CouveuseCard from "../components/CouveuseCard";
import CouveuseAlertWidget from "../components/CouveuseAlertWidget";
import QuickMetrics from "../components/QuickMetrics";
import WeatherWidget from "../components/WeatherWidget";
import ChartOne from "../components/ChartOne";
import ChartTwo from "../components/ChartTwo";
import couveuseService from "@/api/couveuse";

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  /* // recupérer les données du dashboard
  const data = couveuseService.getDashboardData(); */
  const [dashboardData, setDashboardData] = useState({
    users: { total: 0, growth: 0, trend: 'up' },
    products: { total: 100, growth: 0, trend: 'up' },
    sales: { total: 0, growth: 0, trend: 'up' },
    orders: { total: 0, growth: 0, trend: 'up' },
    performance: { sales: 0, survival: 0, incubator: 0 },
    upcoming: []
  });

  // Simuler le chargement des données
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockData = {
        users: { total: 2350, growth: 2.59, trend: 'up' },
        products: { total: 1890, growth: 1.85, trend: 'up' },
        sales: { total: 45600, growth: 3.2, trend: 'up' },
        orders: { total: 156, growth: -0.8, trend: 'down' },
        performance: { sales: 85, survival: 92, incubator: 78 },
        upcoming: [
          {
            id: 1,
            type: 'eclosion',
            title: 'Éclosion lot #2',
            description: 'Couveuse A',
            date: 'Dans 2 jours',
            priority: 'high',
            color: 'blue'
          },
          {
            id: 2,
            type: 'vaccination',
            title: 'Vaccination lot #1',
            description: 'Poulets chair',
            date: 'Demain',
            priority: 'medium',
            color: 'green'
          },
          {
            id: 3,
            type: 'commande',
            title: 'Commande aliments',
            description: 'Fournisseur ABC',
            date: 'Cette semaine',
            priority: 'low',
            color: 'purple'
          }
        ]
      };

      setDashboardData(mockData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les données au montage et toutes les 5 minutes
  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Mettre à jour l'heure en temps réel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fonction pour rafraîchir manuellement
  const handleRefresh = () => {
    loadDashboardData();
  };

  // Fonction pour marquer une échéance comme terminée
  const markUpcomingAsDone = (id) => {
    setDashboardData(prev => ({
      ...prev,
      upcoming: prev.upcoming.filter(item => item.id !== id)
    }));
  };

  // Fonction pour obtenir la couleur de la tendance
  const getTrendColor = (trend) => {
    return trend === 'up' ? 'green' : 'red';
  };

  // Fonction pour formater les nombres
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* En-tête de bienvenue */}
      <WelcomeHeader />
{/* Cartes de statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardDataStats
          title="Total Volailles"
          total={formatNumber(dashboardData.users.total)}
          rate={`${dashboardData.users.growth}%`}
          levelUp={dashboardData.users.trend === 'up'}
          icon={<EggFriedIcon />}
          trend={dashboardData.users.trend}
          color={getTrendColor(dashboardData.users.trend)}
        />
        <CardDataStats
          title="Total Oeufs En Incubation"
          total={formatNumber(dashboardData.products.total)}
          rate={`${dashboardData.products.growth}%`}
          levelUp={dashboardData.products.trend === 'up'}
          icon={<Egg />}
          trend={dashboardData.products.trend}
          color={getTrendColor(dashboardData.products.trend)}
        />
        <CardDataStats
          title="Total Ventes (€)"
          total={formatNumber(dashboardData.sales.total)}
          rate={`${dashboardData.sales.growth}%`}
          levelUp={dashboardData.sales.trend === 'up'}
          icon={<DollarSign />}
          trend={dashboardData.sales.trend}
          color={getTrendColor(dashboardData.sales.trend)}
        />
        <CardDataStats
          title="Total Commandes"
          total={formatNumber(dashboardData.orders.total)}
          rate={`${dashboardData.orders.growth}%`}
          levelUp={dashboardData.orders.trend === 'up'}
          icon={<ShoppingCart />}
          trend={dashboardData.orders.trend}
          color={getTrendColor(dashboardData.orders.trend)}
        />
      </div>
      {/* Métriques rapides */}
      {/* <QuickMetrics /> */}

      {/* Bouton de rafraîchissement */}
      <div className="flex justify-end">
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Chargement...' : 'Rafraîchir'}
        </button>
      </div>

      

      {/* Carte des couveuses */}
      <CouveuseCard />

      {/* Widget d'alertes des couveuses */}
      <CouveuseAlertWidget />

      {/* Section principale avec graphiques et météo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphiques généraux */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <ChartOne />
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <ChartTwo />
          </div>
        </div>

        {/* Météo et informations */}
        <div className="space-y-6">
          <WeatherWidget />

          {/* Prochaines échéances */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-blue-500" />
                <h4 className="text-lg font-semibold">Prochaines échéances</h4>
              </div>
              <span className="text-sm text-gray-500">
                {dashboardData.upcoming.length} échéance{dashboardData.upcoming.length > 1 ? 's' : ''}
              </span>
            </div>

            {dashboardData.upcoming.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.upcoming.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 bg-${item.color}-50 rounded-lg border-l-4 border-${item.color}-500`}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold text-${item.color}-600`}>
                        {item.date}
                      </span>
                      <button
                        onClick={() => markUpcomingAsDone(item.id)}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        title="Marquer comme terminé"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                <p>Aucune échéance en cours</p>
                <p className="text-sm">Toutes les tâches sont à jour !</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Résumé des performances */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <h4 className="text-lg font-semibold">Performance du mois</h4>
          </div>
          <span className="text-sm text-gray-500">
            Mise à jour: {currentTime.toLocaleTimeString('fr-FR')}
          </span>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Objectif ventes</span>
              <span className="font-medium">{dashboardData.performance.sales}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${dashboardData.performance.sales}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Taux de survie</span>
              <span className="font-medium">{dashboardData.performance.survival}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${dashboardData.performance.survival}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Efficacité couveuse</span>
              <span className="font-medium">{dashboardData.performance.incubator}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${dashboardData.performance.incubator}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
