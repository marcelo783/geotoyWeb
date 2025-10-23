import { Navigate, Outlet } from "react-router-dom";
import { useUsuario } from "@/hooks/useUsuario";

export function PrivateRoute() {
  const { usuario, loading } = useUsuario();

  if (loading) {
    return <div className="text-center p-4">Carregando...</div>;
  }

  if (usuario === null) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
