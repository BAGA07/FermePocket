import { useState, useEffect } from "react";
import { X, AlertTriangle, CheckCircle, Info, Clock } from "lucide-react";
import { useNotifications } from "./NotificationProvider";

export default function NotificationToast() {
    const [toasts, setToasts] = useState([]);
    const { notifications } = useNotifications();

    // Fonction pour ajouter un toast
    const addToast = (notification) => {
        const toast = {
            id: `toast-${Date.now()}`,
            ...notification,
            timestamp: new Date().toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        setToasts(prev => [...prev, toast]);

        // Auto-suppression après 5 secondes
        setTimeout(() => {
            removeToast(toast.id);
        }, 5000);
    };

    // Fonction pour supprimer un toast
    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    // Surveiller les nouvelles notifications et créer des toasts automatiquement
    useEffect(() => {
        if (notifications.length > 0) {
            // Prendre la notification la plus récente
            const latestNotification = notifications[0];

            // Vérifier si c'est une notification importante (priorité haute ou type alerte)
            if (latestNotification.priority === 'high' || latestNotification.type === 'alert') {
                // Éviter les doublons
                const toastExists = toasts.some(toast => toast.id === latestNotification.id);
                if (!toastExists) {
                    addToast(latestNotification);
                }
            }
        }
    }, [notifications]);

    // Styles dynamiques pour les toasts
    const getToastStyles = (type, priority) => {
        let baseStyles = "bg-white border-l-4 shadow-lg rounded-lg p-4 flex items-start gap-3 max-w-sm w-full";

        switch (type) {
            case "alert":
                return `${baseStyles} border-red-500 bg-red-50`;
            case "success":
                return `${baseStyles} border-green-500 bg-green-50`;
            case "info":
                return `${baseStyles} border-blue-500 bg-blue-50`;
            case "activity":
                return `${baseStyles} border-purple-500 bg-purple-50`;
            default:
                return `${baseStyles} border-gray-500 bg-gray-50`;
        }
    };

    // Icône dynamique
    const getIcon = (type) => {
        switch (type) {
            case "alert": return <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />;
            case "success": return <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />;
            case "info": return <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />;
            case "activity": return <Clock className="w-5 h-5 text-purple-500 flex-shrink-0" />;
            default: return <Info className="w-5 h-5 text-gray-500 flex-shrink-0" />;
        }
    };

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-sm w-full md:max-w-md">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`${getToastStyles(toast.type, toast.priority)} animate-slide-in`}
                >
                    {getIcon(toast.type)}

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-sm text-gray-900">
                                {toast.title}
                            </h4>
                            <span className="text-xs text-gray-500">
                                {toast.timestamp}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {toast.message}
                        </p>
                    </div>

                    <button
                        onClick={() => removeToast(toast.id)}
                        className="p-1 hover:bg-gray-200 rounded flex-shrink-0"
                    >
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>
            ))}


        </div>
    );
}