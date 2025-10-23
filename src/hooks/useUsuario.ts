import { useState, useEffect } from "react";
import axios from "axios";
import type { Usuario } from "@/types/user";

export function useUsuario() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUsuario = async () => {
    try {
      const res = await axios.get<Usuario>("http://localhost:3000/auth/me", {
        withCredentials: true,
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
