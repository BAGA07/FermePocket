import { createContext, useContext, useState, useEffect, useCallback } from "react";

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
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
                icon: "alert"
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
                icon: "alert"
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
                icon: "info"
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
                icon: "success"
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
                icon: "info"
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
                icon: "success"
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
                icon: "success"
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
                icon: "info"
            }
        ];

        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter(n => !n.read).length);
    }, []);

    const addNotification = useCallback((notification) => {
        const newNotification = {
            ...notification,
            id: Date.now(),
            timestamp: new Date(),
            read: false
        };
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
    }, []);

    const markAsRead = useCallback((id) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => {
            const notification = prev.find(n => n.id === id);
            if (notification && !notification.read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
            return prev.filter(n => n.id !== id);
        });
    }, []);

    const getFilteredNotifications = useCallback((filter = "all", searchQuery = "") => {
        let filtered = notifications;

        // Filtrer par type
        if (filter === "alerts") {
            filtered = filtered.filter(n => n.type === "alert");
        } else if (filter === "activities") {
            filtered = filtered.filter(n => n.type === "activity");
        } else if (filter === "unread") {
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
    }, [notifications]);

    const value = {
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        getFilteredNotifications
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}; 