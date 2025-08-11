import { useState } from "react";
import { Bell, X, AlertTriangle, CheckCircle, Info, Clock, User, Filter, Search } from "lucide-react";
import { useNotifications } from "./NotificationProvider";

export default function NotificationButton({ variant = "desktop" }) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

    const getFilteredNotifications = () => {
        let filtered = notifications;

        if (activeTab !== "all") {
            filtered = filtered.filter(notification => {
                if (activeTab === "alerts") return notification.type === "alert";
                if (activeTab === "activities") return notification.type === "activity";
                if (activeTab === "unread") return !notification.read;
                return true;
            });
        }

        if (searchQuery) {
            filtered = filtered.filter(notification =>
                notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                notification.message.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    };

    const getIcon = (type) => {
        switch (type) {
            case "alert": return <AlertTriangle className="w-5 h-5 text-red-500" />;
            case "success": return <CheckCircle className="w-5 h-5 text-green-500" />;
            case "info": return <Info className="w-5 h-5 text-blue-500" />;
            case "activity": return <Clock className="w-5 h-5 text-purple-500" />;
            default: return <Info className="w-5 h-5 text-gray-500" />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "high": return "border-l-red-500 bg-red-50";
            case "medium": return "border-l-yellow-500 bg-yellow-50";
            case "low": return "border-l-blue-500 bg-blue-50";
            default: return "border-l-gray-500 bg-gray-50";
        }
    };

    if (variant === "mobile") {
        return (
            <>
                {/* Bouton pour ouvrir le drawer mobile */}
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex flex-col items-center text-gray-500 relative"
                >
                    <div className="relative">
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </div>
                    <span className="text-xs">Notifications</span>
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
                            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold">Notifications</h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Barre de recherche */}
                            <div className="p-4 border-b border-gray-200">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher dans les notifications..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Onglets */}
                            <div className="flex border-b border-gray-200">
                                {["all", "alerts", "activities", "unread"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${activeTab === tab
                                                ? "text-green-600 border-b-2 border-green-600"
                                                : "text-gray-500 hover:text-gray-700"
                                            }`}
                                    >
                                        {tab === "all" && "Toutes"}
                                        {tab === "alerts" && "Alertes"}
                                        {tab === "activities" && "Activités"}
                                        {tab === "unread" && "Non lues"}
                                    </button>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="p-4 border-b border-gray-200">
                                <button
                                    onClick={markAllAsRead}
                                    className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Marquer tout comme lu
                                </button>
                            </div>

                            {/* Liste des notifications */}
                            <div className="flex-1 overflow-y-auto p-4">
                                {getFilteredNotifications().length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p>Aucune notification</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {getFilteredNotifications().map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={`p-4 rounded-lg border-l-4 ${getPriorityColor(notification.priority)} ${!notification.read ? "bg-white shadow-sm" : ""
                                                    }`}
                                                onClick={() => !notification.read && markAsRead(notification.id)}
                                            >
                                                <div className="flex items-start gap-3">
                                                    {getIcon(notification.type)}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h4 className="font-medium text-sm text-gray-900">
                                                                {notification.title}
                                                            </h4>
                                                            <span className="text-xs text-gray-500">
                                                                {notification.timestamp}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-2">
                                                            {notification.message}
                                                        </p>
                                                        {notification.user && (
                                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                <User className="w-3 h-3" />
                                                                <span>{notification.user}</span>
                                                            </div>
                                                        )}
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

    // Version desktop
    return (
        <div className="relative">
            {/* Bouton de notification avec badge */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Panneau des notifications */}
            {isOpen && (
                <div className="absolute right-0 top-12 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden">
                    {/* En-tête */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-green-600 hover:text-green-700 font-medium"
                            >
                                Tout marquer comme lu
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-gray-200 rounded"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Liste des notifications */}
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p className="text-sm">Aucune notification</p>
                            </div>
                        ) : (
                            <div className="p-2">
                                {notifications.slice(0, 5).map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-3 rounded-lg border-l-4 ${getPriorityColor(notification.priority)} ${!notification.read ? "bg-white shadow-sm" : ""
                                            } mb-2 cursor-pointer hover:bg-gray-50 transition-colors`}
                                        onClick={() => !notification.read && markAsRead(notification.id)}
                                    >
                                        <div className="flex items-start gap-3">
                                            {getIcon(notification.type)}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-medium text-sm text-gray-900">
                                                        {notification.title}
                                                    </h4>
                                                    <span className="text-xs text-gray-500">
                                                        {notification.timestamp}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pied de page */}
                    {notifications.length > 5 && (
                        <div className="p-3 border-t border-gray-200 bg-gray-50">
                            <button className="w-full text-center text-sm text-green-600 hover:text-green-700 font-medium">
                                Voir toutes les notifications
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Overlay pour fermer sur mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
} 