// src/components/MobileNav.jsx
import { NavLink } from "react-router-dom";
import { Home, Box, BarChart2, Settings } from "lucide-react"; // Icônes

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg flex justify-around py-2 md:hidden z-50">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center text-xs ${isActive ? "text-green-600" : "text-gray-500"}`
        }
      >
        <Home size={20} />
        Accueil
      </NavLink>

      <NavLink
        to="/stocks"
        className={({ isActive }) =>
          `flex flex-col items-center text-xs ${isActive ? "text-green-600" : "text-gray-500"}`
        }
      >
        <Box size={20} />
        Stocks
      </NavLink>

      <NavLink
        to="/rapports"
        className={({ isActive }) =>
          `flex flex-col items-center text-xs ${isActive ? "text-green-600" : "text-gray-500"}`
        }
      >
        <BarChart2 size={20} />
        Rapports
      </NavLink>

      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `flex flex-col items-center text-xs ${isActive ? "text-green-600" : "text-gray-500"}`
        }
      >
        <Settings size={20} />
        Réglages
      </NavLink>
    </nav>
  );
}
