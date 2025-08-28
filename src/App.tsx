// src/App.tsx
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/layout";
import OrdensPage from "./pages/ordens/ordens";
import DashboardPage from "./pages/dashboard/dashboard";
import LoginPage from "./pages/login/login";
import { Toaster } from "sonner";
import LoginForm from "./components/login-form";
import AvaliacaoPage from "./pages/feedback/AvaliacaoPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* ROTAS COM LAYOUT */}
          <Route
            path="/"
            element={<Layout />}
          >
            <Route index element={<Navigate to="/ordens" />} />
            <Route path="ordens" element={<OrdensPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
             
          </Route>

          {/* ROTAS SEM LAYOUT */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginForm />} />
          <Route path="avaliacao" element={<AvaliacaoPage />} />
        </Routes>
      </BrowserRouter>

      <Toaster richColors position="top-right" />
    </>
  );
}

export default App;
