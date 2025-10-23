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
import { DateFilterProvider } from "./components/dashboard/DateFilter/DateFilterContext";
import { PrivateRoute } from "./components/auth/PrivateRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 🔥 cria o client apenas uma vez
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // não refaz requisições ao trocar de aba
      retry: 1, // tenta só 1 vez se der erro
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <DateFilterProvider>
          <Routes>
            {/* ROTAS PRIVADAS */}
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/ordens" />} />
                <Route path="ordens" element={<OrdensPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
              </Route>
            </Route>

            {/* ROTAS PÚBLICAS */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<LoginForm />} />
            <Route path="/avaliacao" element={<AvaliacaoPage />} />
          </Routes>
        </DateFilterProvider>
      </BrowserRouter>

      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
