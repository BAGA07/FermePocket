import { useState, useEffect } from "react";
import { AlertTriangle, Thermometer, Droplets, Clock, Eye, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function CouveuseAlertWidget() {
    const [alerts, setAlerts] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);

    // Simuler des alertes de couveuse
    useEffect(() => {
        const mockAlerts = [
            {
                id: 1,
                type: "temperature",
                severity: "high",
                couveuse: "Couveuse A",
                lot: "Lot #1",
                message: "Température descendue à 36.8°C",
                timestamp: new Date(Date.now() - 5 * 60 * 1000),
                value: "36.8°C",
                threshold: "37.0°C"
            },
            {
                id: 2,
                type: "humidity",
                severity: "medium",
                couveuse: "Couveuse B",
                lot: "Lot #2",
                message: "Humidité élevée: 75%",
                timestamp: new Date(Date.now() - 15 * 60 * 1000),
                value: "75%",
                threshold: "70%"
            },
            {
                id: 3,
                type: "maintenance",
                severity: "low",
                couveuse: "Couveuse C",
                lot: "Lot #3",
                message: "Maintenance préventive requise",
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                value: "Maintenance",
                threshold: "30 jours"
            }
        ];

        setAlerts(mockAlerts);
    }, []);

    const getAlertIcon = (type) => {
        switch (type) {
            case "temperature": return <Thermometer className="w-4 h-4" />;
            case "humidity": return <Droplets className="w-4 h-4" />;
            case "maintenance": return <Clock className="w-4 h-4" />;
            default: return <AlertTriangle className="w-4 h-4" />;
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case "high": return "bg-red-100 text-red-800 border-red-200";
            case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "low": return "bg-blue-100 text-blue-800 border-blue-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getSeverityText = (severity) => {
        switch (severity) {
            case "high": return "Critique";
            case "medium": return "Attention";
            case "low": return "Info";
            default: return "Normal";
        }
    };

    const formatTimestamp = (timestamp) => {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));

        if (minutes < 1) return "À l'instant";
        if (minutes < 60) return `Il y a ${minutes} min`;
        return `Il y a ${hours}h`;
    };

    const criticalAlerts = alerts.filter(alert => alert.severity === "high");
    const hasCriticalAlerts = criticalAlerts.length > 0;

    if (alerts.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Alertes Couveuses</h3>
                        <p className="text-sm text-gray-500">Aucune alerte active</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* En-tête */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${hasCriticalAlerts ? 'bg-red-100' : 'bg-yellow-100'}`}>
                            <AlertTriangle className={`w-5 h-5 ${hasCriticalAlerts ? 'text-red-600' : 'text-yellow-600'}`} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Alertes Couveuses</h3>
                            <p className="text-sm text-gray-500">
                                {hasCriticalAlerts ? `${criticalAlerts.length} alerte(s) critique(s)` : `${alerts.length} alerte(s) active(s)`}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {hasCriticalAlerts && (
                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                                {criticalAlerts.length} Critique
                            </span>
                        )}
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            {isExpanded ? "Réduire" : "Voir tout"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Liste des alertes */}
            <div className="divide-y divide-gray-200">
                {alerts.slice(0, isExpanded ? alerts.length : 2).map((alert) => (
                    <div key={alert.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                                {getAlertIcon(alert.type)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-medium text-gray-900 text-sm">
                                            {alert.couveuse} - {alert.lot}
                                        </h4>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                                            {getSeverityText(alert.severity)}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {formatTimestamp(alert.timestamp)}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-700 mb-2">
                                    {alert.message}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <span className="font-medium">Valeur:</span>
                                            <span className={alert.severity === "high" ? "text-red-600 font-semibold" : "text-gray-700"}>
                                                {alert.value}
                                            </span>
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="font-medium">Seuil:</span>
                                            <span className="text-gray-700">{alert.threshold}</span>
                                        </span>
                                    </div>

                                    <Link
                                        to={`/couveuse/suivi/${alert.lot.replace('Lot #', '')}`}
                                        className="text-blue-600 hover:text-blue-800 text-xs font-medium hover:underline flex items-center gap-1"
                                    >
                                        <Eye className="w-3 h-3" />
                                        Voir
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Actions */}
            {alerts.length > 2 && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                            {isExpanded ? `${alerts.length} alerte(s) affichée(s)` : `${alerts.length - 2} autre(s) alerte(s)`}
                        </span>
                        <Link
                            to="/couveuse"
                            className="text-green-600 hover:text-green-700 text-sm font-medium hover:underline"
                        >
                            Gérer toutes les alertes →
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
} 