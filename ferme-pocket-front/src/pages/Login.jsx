import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios"; // notre config axios

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/login", { email, password });

      // L'API retourne les données dans res.data.data
      if (res.data.status === 'success' && res.data.data.token) {
        localStorage.setItem("auth_token", res.data.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.data.user));
        console.log('Token sauvegardé depuis Login:', res.data.data.token);
        
        navigate("/");
      } else {
        setError("Réponse inattendue du serveur.");
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-600">FermePocket</h1>
          <p className="text-gray-500">Connectez-vous à votre espace</p>
        </div>

        {/* Erreur */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Adresse email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="exemple@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="********"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {/* Liens */}
        <div className="mt-6 flex justify-between text-sm">
          <a href="#" className="text-indigo-600 hover:underline">
            Mot de passe oublié ?
          </a>
          <a href="#" className="text-indigo-600 hover:underline">
            S'inscrire
          </a>
        </div>
      </div>
    </div>
  );
}
