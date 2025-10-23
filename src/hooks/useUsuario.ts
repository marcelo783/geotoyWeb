import { useState, useEffect } from "react";

import type { Usuario } from "@/types/user";
import api from "@/services/api";

export function useUsuario() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUsuario = async () => {
    try {
      const res = await api.get<Usuario>("/auth/me", {
      
      });
      setUsuario(res.data);
    } catch {
      setUsuario(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuario();
  }, []);

  return { usuario, fetchUsuario, loading };
}
