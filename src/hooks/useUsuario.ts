import { useEffect, useState } from "react";
import axios from "axios";
import type { Usuario } from "@/types/user";
 // ajuste caminho

export function useUsuario(): { usuario: Usuario | null; fetchUsuario: () => Promise<void> } {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const fetchUsuario = async () => {
    try {
      const res = await axios.get<Usuario>("http://localhost:3000/auth/me", {
        withCredentials: true,
      });
      setUsuario(res.data);
    } catch {
      setUsuario(null);
    }
  };

  useEffect(() => {
    fetchUsuario();
  }, []);

  return { usuario, fetchUsuario };
}
