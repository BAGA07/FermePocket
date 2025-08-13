// src/components/MobileNav.jsx
import { NavLink } from "react-router-dom";
import { Home, Box, BarChart2, Settings, Egg, DollarSign } from "lucide-react";

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg flex justify-around py-2 md:hidden z-50">
      <NavLink to="/" className={({ isActive }) => isActive ? "flex flex-col items-center text-green-600" : "flex flex-col items-center text-gray-500"}>
        <Home size={20} />
        <span className="text-xs">Accueil</span>
      </NavLink>

      <NavLink to="/stocks" className={({ isActive }) => isActive ? "flex flex-col items-center text-green-600" : "flex flex-col items-center text-gray-500"}>
        <Box size={20} />
        <span className="text-xs">Stocks</span>
      </NavLink>

      <NavLink to="/finances" className={({ isActive }) => isActive ? "flex flex-col items-center text-green-600" : "flex flex-col items-center text-gray-500"}>
        <DollarSign size={20} />
        <span className="text-xs">Finances</span>
      </NavLink>

      {/* Icône des couveuses */}
      <NavLink to="/couveuse/dashboard" className={({ isActive }) => isActive ? "flex flex-col items-center text-green-600" : "flex flex-col items-center text-gray-500"}>
        <Egg size={20} />
        <span className="text-xs">Couveuses</span>
      </NavLink>

      <NavLink to="/rapports" className={({ isActive }) => isActive ? "flex flex-col items-center text-green-600" : "flex flex-col items-center text-gray-500"}>
        <BarChart2 size={20} />
        <span className="text-xs">Rapports</span>
      </NavLink>

      <NavLink to="/settings" className={({ isActive }) => isActive ? "flex flex-col items-center text-green-600" : "flex flex-col items-center text-gray-500"}>
        <Settings size={20} />
        <span className="text-xs">Réglages</span>
      </NavLink>
    </nav>
  );
}
