import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import { NotificationProvider } from "./components/NotificationProvider";

import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Stocks from "./pages/Stocks";
import Elevage from "./pages/Elevage";
import Ventes from "./pages/Ventes";
import Depenses from "./pages/Depenses";
import Rapports from "./pages/Rapports";
import Couveuse from "./pages/Couveuse";
import CouveuseAjouter from "./pages/CouveuseAjouter";
import CouveuseDashboard from "./pages/CouveuseDashboard";
import CouveuseSuivi from "./pages/CouveuseSuivi";
import StockAjouter from "./pages/StockAjouter";
import StockModifier from "./pages/StockModifier";
import StocksDashboard from "./pages/StocksDashboard";

function App() {
  return (
    <NotificationProvider>
      <Router>
        <Routes>
          {/* Route publique */}
          <Route path="/login" element={<Login />} />

          {/* Routes privées avec layout */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/elevage"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Elevage />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/ventes"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Ventes />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/depenses"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Depenses />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/rapports"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Rapports />
                </MainLayout>
              </PrivateRoute>
            }
          />

          {/* Module couveuse */}
          <Route
            path="/couveuse"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Couveuse />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/couveuse/ajouter"
            element={
              <PrivateRoute>
                <MainLayout>
                  <CouveuseAjouter />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/couveuse/:id/suivi"
            element={
              <PrivateRoute>
                <MainLayout>
                  <CouveuseSuivi />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/couveuse/dashboard"
            element={
              <PrivateRoute>
                <MainLayout>
                  <CouveuseDashboard />
                </MainLayout>
              </PrivateRoute>
            }
          />

          {/* Stocks */}
          <Route
            path="/stocks"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Stocks />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/stocks/ajouter"
            element={
              <PrivateRoute>
                <MainLayout>
                  <StockAjouter />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/stocks/modifier/:id"
            element={
              <PrivateRoute>
                <MainLayout>
                  <StockModifier />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/stocks/dashboard"
            element={
              <PrivateRoute>
                <MainLayout>
                  <StocksDashboard />
                </MainLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;
