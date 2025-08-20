import { useState, useEffect } from "react";
import { Clock, Calendar, Sun, Moon, Cloud } from "lucide-react";

export default function WelcomeHeader() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [greeting, setGreeting] = useState("");
    const [weatherIcon, setWeatherIcon] = useState(<Sun className="w-6 h-6" />);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        const hour = currentTime.getHours();

        // Définir la salutation selon l'heure
        if (hour < 6) setGreeting("Bonne nuit");
        else if (hour < 12) setGreeting("Bonjour");
        else if (hour < 18) setGreeting("Bon après-midi");
        else setGreeting("Bonsoir");

        // Définir l'icône météo selon l'heure
        if (hour < 6 || hour >= 22) {
            setWeatherIcon(<Moon className="w-6 h-6" />);
        } else if (hour < 12) {
            setWeatherIcon(<Sun className="w-6 h-6" />);
        } else if (hour < 18) {
            setWeatherIcon(<Sun className="w-6 h-6" />);
        } else {
            setWeatherIcon(<Cloud className="w-6 h-6" />);
        }

        return () => clearInterval(timer);
    }, [currentTime]);

    const formatTime = (date) => {
        return date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getGreetingEmoji = () => {
        const hour = currentTime.getHours();
        if (hour < 6) return "🌙";
        if (hour < 12) return "🌅";
        if (hour < 18) return "☀️";
        return "🌆";
    };

    return (
        <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
            {/* Éléments décoratifs en arrière-plan */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full translate-y-12 -translate-x-12"></div>

            <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                {weatherIcon}
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold mb-2">
                                    {greeting} ! {getGreetingEmoji()}
                                </h1>
                                <p className="text-green-100 text-xl font-medium">
                                    Bienvenue sur votre tableau de bord FermePocket
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-green-100">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                <span className="font-medium">{formatDate(currentTime)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                <span className="font-medium">Heure locale</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 lg:mt-0 lg:ml-8">
                        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 text-center">
                            <div className="text-5xl font-mono font-bold mb-2">
                                {formatTime(currentTime)}
                            </div>
                            <div className="text-green-100 text-sm font-medium">
                                Horloge
                            </div>
                        </div>
                    </div>
                </div>

                {/* Barre de progression du jour */}
                <div className="mt-6">
                    <div className="flex items-center justify-between text-sm text-green-100 mb-2">
                        <span>Progression de la journée</span>
                        <span>{Math.round((currentTime.getHours() * 60 + currentTime.getMinutes()) / 14.4)}%</span>
                    </div>
                    <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                        <div
                            className="bg-white h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{
                                width: `${Math.min(100, (currentTime.getHours() * 60 + currentTime.getMinutes()) / 14.4)}%`
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
} 