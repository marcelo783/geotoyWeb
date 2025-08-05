
import { CriarPedidoDialog } from "../CriarPedidoDialog";
import { UserMenuSheet } from "./UserMenuSheet";

export function Header() {
  return ( 
    <header className="h-16 px-6 flex items-center justify-between bg-[#11172d] shadow-sm     /* Intensidade maior */
   shadow-fuchsia-400">
      <h1 className="text-xl font-semibold text-white">
        Gerenciamento de Pedidos
      </h1>
      
      <div className="flex items-center gap-14">
        <CriarPedidoDialog />
        <UserMenuSheet />
      </div>
    </header>
  );
}