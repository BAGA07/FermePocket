import { Clock, User, Activity, CheckCircle, AlertCircle, Info } from "lucide-react";

export default function RecentActivity() {
    const activities = [
        {
            id: 1,
            type: "success",
            title: "Nouveau lot ajouté en couveuse",
            description: "Lot #4 de 150 œufs de poules pondeuses",
            time: "Il y a 2 heures",
            user: "Jean Dupont",
            icon: <CheckCircle className="w-4 h-4" />
        },
        {
            id: 2,
            type: "warning",
            title: "Alerte température couveuse A",
            description: "Température descendue à 36.8°C",
            time: "Il y a 4 heures",
            user: "Système",
            icon: <AlertCircle className="w-4 h-4" />
        },
        {
            id: 3,
            type: "info",
            title: "Vaccination planifiée",
            description: "Lot #2 vacciné contre la maladie de Newcastle",
            time: "Il y a 6 heures",
            user: "Marie Martin",
            icon: <Info className="w-4 h-4" />
        },
        {
            id: 4,
            type: "success",
            title: "Vente enregistrée",
            description: "50 poulets vendus à 15€/kg",
            time: "Il y a 8 heures",
            user: "Pierre Durand",
            icon: <CheckCircle className="w-4 h-4" />
        },
        {
            id: 5,
            type: "info",
            title: "Commande aliments",
            description: "500kg de maïs commandés chez Fournisseur ABC",
            time: "Il y a 12 heures",
            user: "Système",
            icon: <Info className="w-4 h-4" />
        },
        {
            id: 6,
            type: "success",
            title: "Éclosion réussie",
            description: "Lot #1 : 142 poussins sur 150 œufs (94.7%)",
            time: "Il y a 1 jour",
            user: "Système",
            icon: <CheckCircle className="w-4 h-4" />
        }
    ];

    const getTypeStyles = (type) => {
        switch (type) {
            case "success":
                return {
                    bg: "bg-green-50",
                    border: "border-green-200",
                    text: "text-green-800",
                    icon: "text-green-600"
                };
            case "warning":
                return {
                    bg: "bg-yellow-50",
                    border: "border-yellow-200",
                    text: "text-yellow-800",
                    icon: "text-yellow-600"
                };
            case "info":
                return {
                    bg: "bg-blue-50",
                    border: "border-blue-200",
                    text: "text-blue-800",
                    icon: "text-blue-600"
                };
            default:
                return {
                    bg: "bg-gray-50",
                    border: "border-gray-200",
                    text: "text-gray-800",
                    icon: "text-gray-600"
                };
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-semibold">Activités récentes</h4>
                <div className="ml-auto">
                    <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                        Voir tout
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {activities.map((activity) => {
                    const styles = getTypeStyles(activity.type);
                    return (
                        <div
                            key={activity.id}
                            className={`${styles.bg} ${styles.border} border-l-4 p-4 rounded-lg hover:shadow-md transition-shadow duration-200`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`${styles.icon} mt-1`}>
                                    {activity.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h5 className={`font-medium text-sm ${styles.text}`}>
                                            {activity.title}
                                        </h5>
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {activity.time}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {activity.description}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <User className="w-3 h-3" />
                                        <span>{activity.user}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="text-center">
                    <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                        Charger plus d'activités
                    </button>
                </div>
            </div>
        </div>
    );
} 