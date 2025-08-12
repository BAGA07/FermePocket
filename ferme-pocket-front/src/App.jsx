// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import { NotificationProvider } from "./components/NotificationProvider";
import MainLayout from "./layouts/MainLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import Stocks from "./pages/Stocks";
import Elevage from "./pages/Elevage";
import Ventes from "./pages/Ventes";
import Depenses from "./pages/Depenses";
import Rapports from "./pages/Rapports";

// Couveuse
import Couveuse from "./pages/Couveuse";
import CouveuseDashboard from "./pages/CouveuseDashboard";
import CouveuseSuivi from "./pages/CouveuseSuivi";

// Stocks
import StocksDashboard from "./pages/StocksDashboard";

function App() {
  // Routes privées avec layout
  const privateRoutes = [
    { path: "/", element: <Dashboard /> },

    // Élevage & Ventes
    { path: "/elevage", element: <Elevage /> },
    { path: "/ventes", element: <Ventes /> },
    { path: "/depenses", element: <Depenses /> },
    { path: "/rapports", element: <Rapports /> },

    // Couveuse
    { path: "/couveuse/gestion", element: <Couveuse /> },
    //{ path: "/couveuse/ajouter", element: <CouveuseAjouter /> },
    { path: "/couveuse/:id/suivi", element: <CouveuseSuivi /> },
    { path: "/couveuse/dashboard", element: <CouveuseDashboard /> },

    // Stocks
    { path: "/stocks", element: <Stocks /> },
    { path: "/stocks/dashboard", element: <StocksDashboard /> },

    // Personnel
    { path: "/personnel", element: <div>Personnel Page</div> }, // Placeholder for Personnel page
  ];

  return (
    <NotificationProvider>
      <Router>
        <Routes>
          {/* Route publique */}
          <Route path="/login" element={<Login />} />

          {/* Routes privées */}
          {privateRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={
                <PrivateRoute>
                  <MainLayout>{element}</MainLayout>
                </PrivateRoute>
              }
            />
          ))}
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;
