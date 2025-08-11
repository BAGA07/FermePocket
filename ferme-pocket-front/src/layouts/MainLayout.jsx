// src/layouts/MainLayout.jsx
import { useState } from "react";
import MobileNav from "../components/MobileNav";
import { NavLink, useNavigate } from "react-router-dom";
import NotificationButton from "../components/NotificationButton";
import NotificationToast from "../components/NotificationToast";

export default function MainLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Supprimer les données d'auth
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // 2. Fermer le menu
    setMenuOpen(false);

    // 3. Rediriger vers la page de login
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation PC */}
      <header className="hidden md:flex bg-white shadow p-4 items-center justify-between">
        {/* Logo */}
        <h1 className="text-lg font-bold text-green-700">FermePocket</h1>

        {/* Menu de navigation */}
        <nav className="flex gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-green-600 font-semibold" : "text-gray-600"
            }
          >
            Tableau de bord
          </NavLink>
          <NavLink
            to="/stocks"
            className={({ isActive }) =>
              isActive ? "text-green-600 font-semibold" : "text-gray-600"
            }
          >
            Stocks
          </NavLink>
          <NavLink
            to="/couveuse"
            className={({ isActive }) =>
              isActive ? "text-green-600 font-semibold" : "text-gray-600"
            }
          >
            Couveuses
          </NavLink>
          <NavLink
            to="/rapports"
            className={({ isActive }) =>
              isActive ? "text-green-600 font-semibold" : "text-gray-600"
            }
          >
            Rapports
          </NavLink>
        </nav>

        {/* Icône de notification */}
        <NotificationButton variant="desktop" />

        {/* Profil + Menu déroulant */}
        <div className="relative">
          {/* Avatar cliquable */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none"
          >
            <img
              src="https://ui-avatars.com/api/?name=AB&background=16a34a&color=fff"
              alt="Profil"
              className="w-10 h-10 rounded-full border-2 border-green-600"
            />
          </button>

          {/* Menu déroulant */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border p-2">
              <NavLink
                to="/profil"
                className="block px-4 py-2 text-gray-700 hover:bg-green-50 rounded"
                onClick={() => setMenuOpen(false)}
              >
                Mon profil
              </NavLink>
              <NavLink
                to="/parametres"
                className="block px-4 py-2 text-gray-700 hover:bg-green-50 rounded"
                onClick={() => setMenuOpen(false)}
              >
                Paramètres
              </NavLink>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded"
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Contenu */}
      <main className="flex-1 p-4">{children}</main>

      {/* Navigation mobile */}
      <MobileNav onLogout={handleLogout} />

      {/* Notifications toast */}
      <NotificationToast />
    </div>
  );
}
