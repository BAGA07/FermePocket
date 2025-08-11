import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Target, Zap, Clock, CheckCircle, Plus, Package, Syringe, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QuickMetrics() {
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState([]);
    const [lastAction, setLastAction] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Charger les métriques dynamiquement
    useEffect(() => {
        loadMetrics();
        loadLastAction();

        // Mettre à jour toutes les 30 secondes
        const interval = setInterval(loadMetrics, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadMetrics = async () => {
        try {
            // Simulation d'un appel API
            const mockMetrics = [
                {
                    id: 1,
                    label: "Taux de croissance",
                    value: "12.5%",
                    change: "+2.3%",
                    trend: "up",
                    icon: <TrendingUp className="w-4 h-4" />,
                    color: "text-green-600",
                    description: "Croissance mensuelle des ventes"
                },
                {
                    id: 2,
                    label: "Efficacité énergétique",
                    value: "87%",
                    change: "+5%",
                    trend: "up",
                    icon: <Zap className="w-4 h-4" />,
                    color: "text-blue-600",
                    description: "Optimisation des couveuses"
                },
                {
                    id: 3,
                    label: "Objectifs atteints",
                    value: "6/8",
                    change: "75%",
                    trend: "up",
                    icon: <Target className="w-4 h-4" />,
                    color: "text-purple-600",
                    description: "Objectifs du mois"
                },
                {
                    id: 4,
                    label: "Temps de réponse",
                    value: "2.3h",
                    change: "-0.5h",
                    trend: "down",
                    icon: <Clock className="w-4 h-4" />,
                    color: "text-orange-600",
                    description: "Réactivité équipe"
                }
            ];

            setMetrics(mockMetrics);
        } catch (error) {
            console.error('Erreur lors du chargement des métriques:', error);
        }
    };

    const loadLastAction = () => {
        const actions = [
            "Ajout lot couveuse il y a 2h",
            "Commande aliments validée il y a 4h",
            "Vaccination lot #3 terminée il y a 6h",
            "Rapport mensuel généré il y a 1j",
            "Maintenance couveuse B planifiée il y a 2j"
        ];

        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        setLastAction(randomAction);
    };

    const quickActions = [
        {
            label: "Ajouter un lot",
            icon: <Plus className="w-6 h-6" />,
            color: "bg-green-500 hover:bg-green-600",
            action: () => navigate("/couveuse/ajouter"),
            description: "Nouveau lot d'œufs"
        },
        {
            label: "Commander aliments",
            icon: <Package className="w-6 h-6" />,
            color: "bg-blue-500 hover:bg-blue-600",
            action: () => navigate("/stocks/ajouter"),
            description: "Réapprovisionnement"
        },
        {
            label: "Planifier vaccination",
            icon: <Syringe className="w-6 h-6" />,
            color: "bg-purple-500 hover:bg-purple-600",
            action: () => navigate("/elevage"),
            description: "Calendrier vaccinal"
        },
        {
            label: "Générer rapport",
            icon: <BarChart3 className="w-6 h-6" />,
            color: "bg-orange-500 hover:bg-orange-600",
            action: () => navigate("/rapports"),
            description: "Analyse des performances"
        }
    ];

    const handleQuickAction = async (action) => {
        setIsLoading(true);
        try {
            // Simulation d'un délai d'action
            await new Promise(resolve => setTimeout(resolve, 500));
            action();
        } finally {
            setIsLoading(false);
        }
    };

    const getTrendIcon = (trend) => {
        return trend === "up" ?
            <TrendingUp className="w-3 h-3 text-green-600" /> :
            <TrendingDown className="w-3 h-3 text-red-600" />;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Métriques rapides */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-lg font-semibold">Métriques rapides</h4>
                    </div>
                    <button
                        onClick={loadMetrics}
                        disabled={isLoading}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Actualiser les métriques"
                    >
                        <Clock className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {metrics.map((metric) => (
                        <div
                            key={metric.id}
                            className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
                            title={metric.description}
                        >
                            <div className="flex items-center justify-center gap-1 mb-2">
                                <span className={metric.color}>{metric.icon}</span>
                                <span className="text-xs text-gray-500 group-hover:text-gray-700">{metric.label}</span>
                            </div>
                            <div className="text-xl font-bold text-gray-900 mb-1">{metric.value}</div>
                            <div className="flex items-center justify-center gap-1">
                                {getTrendIcon(metric.trend)}
                                <span className={`text-xs font-medium ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                                    {metric.change}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-lg font-semibold">Actions rapides</h4>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {quickActions.length} actions
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {quickActions.map((action, index) => (
                        <button
                            key={index}
                            onClick={() => handleQuickAction(action.action)}
                            disabled={isLoading}
                            className={`${action.color} text-white p-4 rounded-lg text-center transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group`}
                            title={action.description}
                        >
                            <div className="text-white mb-2 group-hover:scale-110 transition-transform">
                                {action.icon}
                            </div>
                            <div className="text-sm font-medium">{action.label}</div>
                        </button>
                    ))}
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Dernière action : {lastAction}</span>
                        <button
                            onClick={loadLastAction}
                            className="ml-auto p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
                            title="Actualiser"
                        >
                            <TrendingUp className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 