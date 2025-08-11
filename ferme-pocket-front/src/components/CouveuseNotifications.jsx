import { useState, useEffect } from "react";
import { AlertTriangle, Thermometer, Droplets, Clock, CheckCircle, Info } from "lucide-react";

export default function CouveuseNotifications() {
    const [notifications, setNotifications] = useState([]);

    // Simuler des notifications de couveuse
    useEffect(() => {
        const mockNotifications = [
            {
                id: 1,
                type: "alert",
                priority: "high",
                title: "Température critique",
                message: "La température de la Couveuse A est descendue à 36.8°C",
                timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
                couveuse: "Couveuse A",
                lot: "Lot #1",
                action: "Vérifier le thermostat"
            },
            {
                id: 2,
                type: "info",
                priority: "medium",
                title: "Mirage prévu",
                message: "Le mirage du Lot #2 est prévu pour demain",
                timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
                couveuse: "Couveuse B",
                lot: "Lot #2",
                action: "Préparer l'équipement"
            },
            {
                id: 3,
                type: "success",
                priority: "low",
                title: "Éclosion réussie",
                message: "Le Lot #3 a atteint un taux d'éclosion de 85%",
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                couveuse: "Couveuse A",
                lot: "Lot #3",
                action: "Nettoyer la couveuse"
            }
        ];

        setNotifications(mockNotifications);
    }, []);

    const getNotificationIcon = (type) => {
        switch (type) {
            case "alert": return <AlertTriangle className="w-5 h-5 text-red-500" />;
            case "success": return <CheckCircle className="w-5 h-5 text-green-500" />;
            case "info": return <Info className="w-5 h-5 text-blue-500" />;
            default: return <Info className="w-5 h-5 text-gray-500" />;
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case "alert": return "border-l-red-500 bg-red-50";
            case "success": return "border-l-green-500 bg-green-50";
            case "info": return "border-l-blue-500 bg-blue-50";
            default: return "border-l-gray-500 bg-gray-50";
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "high": return "bg-red-100 text-red-800";
            case "medium": return "bg-yellow-100 text-yellow-800";
            case "low": return "bg-green-100 text-green-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const formatTimestamp = (timestamp) => {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 1) return "À l'instant";
        if (minutes < 60) return `Il y a ${minutes} min`;
        if (hours < 24) return `Il y a ${hours}h`;
        return `Il y a ${days}j`;
    };

    const handleDismiss = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    const handleAction = (notification) => {
        // Ici, vous pouvez implémenter des actions spécifiques
        console.log("Action pour:", notification);

        // Exemple : rediriger vers la page de suivi
        if (notification.lot) {
            // navigate(`/couveuse/suivi/${notification.lot}`);
        }
    };

    if (notifications.length === 0) {
        return (
            <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-500">Aucune notification pour les couveuses</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`border-l-4 p-4 rounded-r-lg ${getNotificationColor(notification.type)} hover:shadow-md transition-shadow`}
                >
                    <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-gray-900 text-sm">
                                        {notification.title}
                                    </h4>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                                        {notification.priority === "high" ? "Haute" :
                                            notification.priority === "medium" ? "Moyenne" : "Basse"}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleDismiss(notification.id)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    ×
                                </button>
                            </div>

                            <p className="text-sm text-gray-700 mb-2">
                                {notification.message}
                            </p>

                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center gap-4">
                                    {notification.couveuse && (
                                        <span className="flex items-center gap-1">
                                            <Thermometer className="w-3 h-3" />
                                            {notification.couveuse}
                                        </span>
                                    )}
                                    {notification.lot && (
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {notification.lot}
                                        </span>
                                    )}
                                </div>
                                <span>{formatTimestamp(notification.timestamp)}</span>
                            </div>

                            {notification.action && (
                                <button
                                    onClick={() => handleAction(notification)}
                                    className="mt-3 text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline"
                                >
                                    {notification.action} →
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
} 