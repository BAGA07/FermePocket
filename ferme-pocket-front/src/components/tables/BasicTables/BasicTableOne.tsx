import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";
import { RefreshCw, Plus } from "lucide-react";

interface Order {
    id: number;
    user: {
        image: string;
        name: string;
        role: string;
    };
    projectName: string;
    team: {
        images: string[];
    };
    status: string;
    budget: string;
}

export default function BasicTableOne() {
    const [tableData, setTableData] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>("all");

    // Charger les données de manière dynamique
    const loadTableData = async () => {
        setIsLoading(true);
        try {
            // Simulation d'un appel API
            await new Promise(resolve => setTimeout(resolve, 800));

            // Données mockées avec variations
            const mockData: Order[] = [
                {
                    id: 1,
                    user: {
                        image: "/images/user/user-17.jpg",
                        name: "Lindsey Curtis",
                        role: "Web Designer",
                    },
                    projectName: "Agency Website",
                    team: {
                        images: [
                            "/images/user/user-22.jpg",
                            "/images/user/user-23.jpg",
                            "/images/user/user-24.jpg",
                        ],
                    },
                    budget: `${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 9)}K`,
                    status: "Active",
                },
                {
                    id: 2,
                    user: {
                        image: "/images/user/user-18.jpg",
                        name: "Kaiya George",
                        role: "Project Manager",
                    },
                    projectName: "Technology Platform",
                    team: {
                        images: ["/images/user/user-25.jpg", "/images/user/user-26.jpg"],
                    },
                    budget: `${Math.floor(Math.random() * 30) + 15}.${Math.floor(Math.random() * 9)}K`,
                    status: "Pending",
                },
                {
                    id: 3,
                    user: {
                        image: "/images/user/user-17.jpg",
                        name: "Zain Geidt",
                        role: "Content Writer",
                    },
                    projectName: "Blog Platform",
                    team: {
                        images: ["/images/user/user-27.jpg"],
                    },
                    budget: `${Math.floor(Math.random() * 15) + 8}.${Math.floor(Math.random() * 9)}K`,
                    status: "Active",
                },
                {
                    id: 4,
                    user: {
                        image: "/images/user/user-20.jpg",
                        name: "Abram Schleifer",
                        role: "Digital Marketer",
                    },
                    projectName: "Social Media Campaign",
                    team: {
                        images: [
                            "/images/user/user-28.jpg",
                            "/images/user/user-29.jpg",
                            "/images/user/user-30.jpg",
                        ],
                    },
                    budget: `${Math.floor(Math.random() * 8) + 1}.${Math.floor(Math.random() * 9)}K`,
                    status: "Canceled",
                },
                {
                    id: 5,
                    user: {
                        image: "/images/user/user-21.jpg",
                        name: "Carla George",
                        role: "Front-end Developer",
                    },
                    projectName: "E-commerce Website",
                    team: {
                        images: [
                            "/images/user/user-31.jpg",
                            "/images/user/user-32.jpg",
                            "/images/user/user-33.jpg",
                        ],
                    },
                    budget: `${Math.floor(Math.random() * 8) + 3}.${Math.floor(Math.random() * 9)}K`,
                    status: "Active",
                }
            ];

            setTableData(mockData);
            setLastUpdate(new Date());
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Charger les données au montage et toutes les 3 minutes
    useEffect(() => {
        loadTableData();
        const interval = setInterval(loadTableData, 3 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // Fonction pour rafraîchir manuellement
    const handleRefresh = () => {
        loadTableData();
    };

    // Filtrer les données selon le statut
    const filteredData = filterStatus === "all"
        ? tableData
        : tableData.filter(item => item.status.toLowerCase() === filterStatus.toLowerCase());

    // Obtenir la couleur du badge selon le statut
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "active": return "bg-green-100 text-green-800 border-green-200";
            case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "canceled": return "bg-red-100 text-red-800 border-red-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    // Formater la date de dernière mise à jour
    const formatLastUpdate = (date: Date | null) => {
        if (!date) return "Jamais";
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
        if (diff < 1) return "À l'instant";
        if (diff < 60) return `Il y a ${diff} min`;
        if (diff < 1440) return `Il y a ${Math.floor(diff / 60)}h`;
        return `Il y a ${Math.floor(diff / 1440)}j`;
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            {/* Header avec contrôles */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/[0.05]">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Projets Récents
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Mise à jour: {formatLastUpdate(lastUpdate)}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Filtre par statut */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="active">Actifs</option>
                        <option value="pending">En attente</option>
                        <option value="canceled">Annulés</option>
                    </select>

                    {/* Bouton d'ajout */}
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Plus className="w-4 h-4" />
                        Nouveau projet
                    </button>

                    {/* Bouton de rafraîchissement */}
                    <button
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Actualiser les données"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="max-w-full overflow-x-auto">
                <Table>
                    {/* Table Header */}
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Utilisateur
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Nom du Projet
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Équipe
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Statut
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Budget
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    {/* Table Body */}
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="px-5 py-8 text-center text-gray-500">
                                    <div className="flex items-center justify-center gap-2">
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                        Chargement des données...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="px-5 py-8 text-center text-gray-500">
                                    Aucun projet trouvé
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((order) => (
                                <TableRow key={order.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                                    <TableCell className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={order.user.image}
                                                alt={order.user.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {order.user.name}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {order.user.role}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4">
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {order.projectName}
                                        </p>
                                    </TableCell>
                                    <TableCell className="px-5 py-4">
                                        <div className="flex -space-x-2">
                                            {order.team.images.map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={image}
                                                    alt={`Team member ${index + 1}`}
                                                    className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 object-cover"
                                                />
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4">
                                        <Badge className={getStatusColor(order.status)}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-5 py-4">
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {order.budget}
                                        </p>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}