// src/App.tsx
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/layout";
import OrdensPage from "./pages/ordens";
import { Toaster } from "sonner";
import DashboardPage from "./pages/dashboard";

function App() {
  return (
    <>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/ordens" />} />
            <Route path="/ordens" element={<OrdensPage />} />
            <Route path="/Dashboard" element={<DashboardPage />} />
            {/* Outras páginas no futuro */}
          </Routes>
        </Layout>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </>
  );
}

export default App;
