import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios"; // config axios

export default function AuthForm() {
  const navigate = useNavigate();

  // Form states
  const [isRegister, setIsRegister] = useState(false); // false = login, true = register
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let endpoint = isRegister ? "/register" : "/login";
      let payload = isRegister
        ? { name, email, password, password_confirmation: passwordConfirm }
        : { email, password };

      const res = await axios.post(endpoint, payload);

      if (res.data.status === "success" && res.data.data.token) {
        localStorage.setItem("auth_token", res.data.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.data.user));
        navigate("/");
      } else {
        setError("Réponse inattendue du serveur.");
      }
    } catch (err) {
      console.error("Erreur:", err);
      setError(
        isRegister
          ? "Erreur lors de l'inscription. Vérifiez vos informations."
          : "Email ou mot de passe incorrect."
      );
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
          <p className="text-gray-500">
            {isRegister ? "Créez votre compte" : "Connectez-vous à votre espace"}
          </p>
        </div>

        {/* Erreur */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom complet
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                placeholder="Votre nom"
                required
              />
            </div>
          )}

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

          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                placeholder="********"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading
              ? isRegister
                ? "Inscription..."
                : "Connexion..."
              : isRegister
              ? "S'inscrire"
              : "Se connecter"}
          </button>
        </form>

        {/* Liens */}
        <div className="mt-6 text-center text-sm">
          {isRegister ? (
            <>
              Déjà un compte ?{" "}
              <button
                onClick={() => setIsRegister(false)}
                className="text-indigo-600 hover:underline"
              >
                Se connecter
              </button>
            </>
          ) : (
            <>
              Pas encore de compte ?{" "}
              <button
                onClick={() => setIsRegister(true)}
                className="text-indigo-600 hover:underline"
              >
                S'inscrire
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
