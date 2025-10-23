import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useIsFetching } from "@tanstack/react-query";

// Configurações da barra
NProgress.configure({
  showSpinner: false, // tira o spinner
  speed: 500,         // velocidade da animação
  trickleSpeed: 200,  // velocidade da "carga"
});

export default function TopLoader() {
  const isFetching = useIsFetching(); // 🔥 detecta se tem query ativa

  useEffect(() => {
    if (isFetching) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [isFetching]);

  return null; // não renderiza nada, só controla a barra
}
