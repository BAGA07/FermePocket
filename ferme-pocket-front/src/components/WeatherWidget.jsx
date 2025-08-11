import { useState, useEffect } from "react";
import { Sun, Cloud, CloudRain, Thermometer, Droplets, Wind, RefreshCw, MapPin, AlertTriangle, Info, CheckCircle } from "lucide-react";

export default function WeatherWidget() {
    const [weatherData, setWeatherData] = useState({
        current: {
            temp: 0,
            condition: "Chargement...",
            icon: <Cloud className="w-8 h-8 text-gray-400" />,
            humidity: 0,
            wind: 0,
            feelsLike: 0
        },
        forecast: [],
        location: "Ferme de la Vallée",
        lastUpdate: null,
        isLoading: false
    });

    const [advice, setAdvice] = useState({
        type: "info",
        message: "Chargement des conseils...",
        icon: <Info className="w-4 h-4" />
    });

    // Charger les données météo
    const loadWeatherData = async () => {
        setWeatherData(prev => ({ ...prev, isLoading: true }));

        try {
            // Simulation d'un appel API météo
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Données météo simulées avec variations
            const mockWeatherData = {
                current: {
                    temp: Math.floor(Math.random() * 25) + 10, // 10-35°C
                    condition: getRandomCondition(),
                    icon: getWeatherIcon(getRandomCondition()),
                    humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
                    wind: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
                    feelsLike: Math.floor(Math.random() * 25) + 10
                },
                forecast: generateForecast(),
                location: "Ferme de la Vallée",
                lastUpdate: new Date(),
                isLoading: false
            };

            setWeatherData(mockWeatherData);
            updateWeatherAdvice(mockWeatherData.current);

        } catch (error) {
            console.error('Erreur lors du chargement météo:', error);
            setWeatherData(prev => ({ ...prev, isLoading: false }));
        }
    };

    // Générer des prévisions réalistes
    const generateForecast = () => {
        const days = ['Demain', 'Mercredi', 'Jeudi', 'Vendredi'];
        const conditions = ['Ensoleillé', 'Nuageux', 'Partiellement nuageux', 'Pluvieux', 'Orageux'];

        return days.map((day, index) => ({
            day,
            temp: Math.floor(Math.random() * 20) + 15, // 15-35°C
            condition: conditions[Math.floor(Math.random() * conditions.length)],
            icon: getWeatherIcon(conditions[Math.floor(Math.random() * conditions.length)]),
            humidity: Math.floor(Math.random() * 40) + 40,
            wind: Math.floor(Math.random() * 20) + 5
        }));
    };

    // Obtenir une condition météo aléatoire
    const getRandomCondition = () => {
        const conditions = ['Ensoleillé', 'Nuageux', 'Partiellement nuageux', 'Pluvieux', 'Orageux'];
        return conditions[Math.floor(Math.random() * conditions.length)];
    };

    // Obtenir l'icône météo appropriée
    const getWeatherIcon = (condition) => {
        switch (condition) {
            case 'Ensoleillé':
                return <Sun className="w-8 h-8 text-yellow-500" />;
            case 'Nuageux':
                return <Cloud className="w-8 h-8 text-gray-400" />;
            case 'Partiellement nuageux':
                return <Cloud className="w-8 h-8 text-blue-400" />;
            case 'Pluvieux':
                return <CloudRain className="w-8 h-8 text-blue-600" />;
            case 'Orageux':
                return <CloudRain className="w-8 h-8 text-purple-600" />;
            default:
                return <Sun className="w-8 h-8 text-yellow-500" />;
        }
    };

    // Mettre à jour les conseils météo
    const updateWeatherAdvice = (current) => {
        const { temp, humidity, wind } = current;

        if (temp > 30) {
            setAdvice({
                type: "warning",
                message: "Température élevée - Surveiller l'hydratation des animaux et la ventilation des couveuses",
                icon: <AlertTriangle className="w-4 h-4" />
            });
        } else if (temp < 10) {
            setAdvice({
                type: "info",
                message: "Température basse - Vérifier le chauffage des couveuses et l'isolation",
                icon: <Info className="w-4 h-4" />
            });
        } else if (humidity > 80) {
            setAdvice({
                type: "warning",
                message: "Humidité élevée - Aérer les bâtiments et surveiller les couveuses",
                icon: <AlertTriangle className="w-4 h-4" />
            });
        } else if (wind > 20) {
            setAdvice({
                type: "info",
                message: "Vent fort - Sécuriser les équipements extérieurs",
                icon: <Info className="w-4 h-4" />
            });
        } else {
            setAdvice({
                type: "success",
                message: "Conditions optimales pour l'élevage et les couveuses",
                icon: <CheckCircle className="w-4 h-4" />
            });
        }
    };

    // Charger les données au montage et toutes les 10 minutes
    useEffect(() => {
        loadWeatherData();
        const interval = setInterval(loadWeatherData, 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // Fonction pour rafraîchir manuellement
    const handleRefresh = () => {
        loadWeatherData();
    };

    // Formater la date de dernière mise à jour
    const formatLastUpdate = (date) => {
        if (!date) return "Jamais";
        const now = new Date();
        const diff = Math.floor((now - date) / 1000 / 60); // différence en minutes

        if (diff < 1) return "À l'instant";
        if (diff < 60) return `Il y a ${diff} min`;
        if (diff < 1440) return `Il y a ${Math.floor(diff / 60)}h`;
        return `Il y a ${Math.floor(diff / 1440)}j`;
    };

    // Obtenir la couleur de l'icône de conseil
    const getAdviceColor = (type) => {
        switch (type) {
            case "warning": return "text-yellow-400";
            case "info": return "text-blue-400";
            case "success": return "text-green-400";
            default: return "text-blue-400";
        }
    };

    return (
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <h4 className="text-lg font-semibold">Météo de la ferme</h4>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={weatherData.isLoading}
                    className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors disabled:opacity-50"
                    title="Actualiser la météo"
                >
                    <RefreshCw className={`w-4 h-4 ${weatherData.isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Localisation et mise à jour */}
            <div className="text-sm opacity-90 mb-4">
                <div>{weatherData.location}</div>
                <div>Mise à jour: {formatLastUpdate(weatherData.lastUpdate)}</div>
            </div>

            {/* Conditions actuelles */}
            <div className="flex items-center gap-4 mb-6">
                <div className="text-6xl">
                    {weatherData.current.icon}
                </div>
                <div>
                    <div className="text-3xl font-bold">{weatherData.current.temp}°C</div>
                    <div className="text-blue-100">{weatherData.current.condition}</div>
                    <div className="text-sm opacity-80">Ressenti: {weatherData.current.feelsLike}°C</div>
                </div>
            </div>

            {/* Détails météo */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 bg-white bg-opacity-20 p-2 rounded-lg">
                    <Droplets className="w-4 h-4 opacity-80" />
                    <span className="text-sm">{weatherData.current.humidity}%</span>
                </div>
                <div className="flex items-center gap-2 bg-white bg-opacity-20 p-2 rounded-lg">
                    <Wind className="w-4 h-4 opacity-80" />
                    <span className="text-sm">{weatherData.current.wind} km/h</span>
                </div>
            </div>

            {/* Prévisions */}
            {weatherData.forecast.length > 0 && (
                <div className="space-y-2 mb-4">
                    <div className="text-sm font-medium opacity-90 mb-2">Prévisions 4 jours</div>
                    {weatherData.forecast.map((day, index) => (
                        <div key={index} className="flex items-center justify-between text-sm bg-white bg-opacity-10 p-2 rounded-lg">
                            <span>{day.day}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{day.icon}</span>
                                <span>{day.temp}°C</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Conseil pour la ferme */}
            <div className={`mt-4 p-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30`}>
                <div className="flex items-center gap-2 text-sm">
                    <span className={getAdviceColor(advice.type)}>
                        {advice.icon}
                    </span>
                    <span className="opacity-90">{advice.message}</span>
                </div>
            </div>
        </div>
    );
} 