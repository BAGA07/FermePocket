import { useState, useEffect } from "react";
import { X, Bell, AlertTriangle, CheckCircle, Info, Clock, User, Filter, Search } from "lucide-react";

export default function MobileNotificationDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Données simulées des notifications
    useEffect(() => {
        const mockNotifications = [
            // Alertes
            {
                id: 1,
                type: "alert",
                priority: "high",
                title: "Stock maïs faible",
                message: "Il ne reste que 50kg de maïs en stock. Commande recommandée immédiatement.",
                time: "Il y a 2 heures",
                user: "Système",
                read: false,
                icon: <AlertTriangle className="w-5 h-5" />
            },
            {
                id: 2,
                type: "alert",
                priority: "high",
                title: "Vaccination en retard",
                message: "Vaccination du lot #3 en retard de 2 jours. Risque sanitaire élevé.",
                time: "Il y a 4 heures",
                user: "Système",
                read: false,
                icon: <AlertTriangle className="w-5 h-5" />
            },
            {
                id: 3,
                type: "alert",
                priority: "medium",
                title: "Nouveau lot prêt",
                message: "Nouveau lot prêt pour incubation. Vérifier la température de la couveuse.",
                time: "Il y a 6 heures",
                user: "Système",
                read: false,
                icon: <Info className="w-5 h-5" />
            },
            // Activités récentes
            {
                id: 4,
                type: "activity",
                priority: "low",
                title: "Nouveau lot ajouté",
                message: "Lot #4 de 150 œufs de poules pondeuses ajouté en couveuse A",
                time: "Il y a 2 heures",
                user: "Jean Dupont",
                read: true,
                icon: <CheckCircle className="w-5 h-5" />
            },
            {
                id: 5,
                type: "activity",
                priority: "low",
                title: "Alerte température",
                message: "Température couveuse A descendue à 36.8°C. Système de chauffage activé.",
                time: "Il y a 4 heures",
                user: "Système",
                read: true,
                icon: <Info className="w-5 h-5" />
            },
            {
                id: 6,
                type: "activity",
                priority: "low",
                title: "Vaccination planifiée",
                message: "Lot #2 vacciné contre la maladie de Newcastle. Prochaine vaccination dans 2 semaines.",
                time: "Il y a 6 heures",
                user: "Marie Martin",
                read: true,
                icon: <CheckCircle className="w-5 h-5" />
            },
            {
                id: 7,
                type: "activity",
                priority: "low",
                title: "Vente enregistrée",
                message: "50 poulets de chair vendus à 15€/kg. Total: 750€",
                time: "Il y a 8 heures",
                user: "Pierre Durand",
                read: true,
                icon: <CheckCircle className="w-5 h-5" />
            },
            {
                id: 8,
                type: "activity",
                priority: "low",
                title: "Commande aliments",
                message: "500kg de maïs commandés chez Fournisseur ABC. Livraison prévue demain.",
                time: "Il y a 12 heures",
                user: "Système",
                read: true,
                icon: <Info className="w-5 h-5" />
            }
        ];

        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter(n => !n.read).length);
    }, []);

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    const getFilteredNotifications = () => {
        let filtered = notifications;

        // Filtrer par type
        if (activeTab === "alerts") {
            filtered = filtered.filter(n => n.type === "alert");
        } else if (activeTab === "activities") {
            filtered = filtered.filter(n => n.type === "activity");
        } else if (activeTab === "unread") {
            filtered = filtered.filter(n => !n.read);
        }

        // Filtrer par recherche
        if (searchQuery) {
            filtered = filtered.filter(n =>
                n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                n.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                n.user.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "high": return "border-red-500 bg-red-50";
            case "medium": return "border-orange-500 bg-orange-50";
            case "low": return "border-blue-500 bg-blue-50";
            default: return "border-gray-500 bg-gray-50";
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case "alert": return "text-red-600";
            case "activity": return "text-blue-600";
            default: return "text-gray-600";
        }
    };

    const filteredNotifications = getFilteredNotifications();

    return (
        <>
            {/* Bouton pour ouvrir le drawer mobile */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                aria-label="Notifications"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Drawer mobile plein écran */}
            {isOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black bg-opacity-50"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="absolute inset-0 bg-white flex flex-col">
                        {/* En-tête */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center gap-3">
                                <Bell className="w-6 h-6 text-gray-600" />
                                <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
                                {unreadCount > 0 && (
                                    <span className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded-full font-medium">
                                        {unreadCount} non lues
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Barre de recherche */}
                        <div className="p-4 border-b border-gray-200">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher dans les notifications..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Onglets */}
                        <div className="flex border-b border-gray-200 bg-white">
                            <button
                                onClick={() => setActiveTab("all")}
                                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200 ${activeTab === "all"
                                        ? "text-blue-600 border-b-2 border-blue-600"
                                        : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                Toutes ({notifications.length})
                            </button>
                            <button
                                onClick={() => setActiveTab("alerts")}
                                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200 ${activeTab === "alerts"
                                        ? "text-red-600 border-b-2 border-red-600"
                                        : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                Alertes ({notifications.filter(n => n.type === "alert").length})
                            </button>
                            <button
                                onClick={() => setActiveTab("activities")}
                                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200 ${activeTab === "activities"
                                        ? "text-blue-600 border-b-2 border-blue-600"
                                        : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                Activités ({notifications.filter(n => n.type === "activity").length})
                            </button>
                            <button
                                onClick={() => setActiveTab("unread")}
                                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200 ${activeTab === "unread"
                                        ? "text-orange-600 border-b-2 border-orange-600"
                                        : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                Non lues ({unreadCount})
                            </button>
                        </div>

                        {/* Actions */}
                        {unreadCount > 0 && (
                            <div className="p-4 border-b border-gray-200 bg-blue-50">
                                <button
                                    onClick={markAllAsRead}
                                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Marquer toutes comme lues
                                </button>
                            </div>
                        )}

                        {/* Liste des notifications */}
                        <div className="flex-1 overflow-y-auto">
                            {filteredNotifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                    <p className="text-lg font-medium mb-2">Aucune notification</p>
                                    <p className="text-sm">Aucune notification ne correspond à vos critères</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {filteredNotifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${!notification.read ? 'bg-blue-50' : ''
                                                }`}
                                            onClick={() => markAsRead(notification.id)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`mt-1 ${getTypeColor(notification.type)}`}>
                                                    {notification.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <h4 className={`font-medium text-base ${!notification.read ? 'text-gray-900' : 'text-gray-700'
                                                            }`}>
                                                            {notification.title}
                                                        </h4>
                                                        <span className="text-xs text-gray-500 flex items-center gap-1 ml-2">
                                                            <Clock className="w-3 h-3" />
                                                            {notification.time}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                                            <User className="w-3 h-3" />
                                                            <span>{notification.user}</span>
                                                        </div>
                                                        {!notification.read && (
                                                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
} 