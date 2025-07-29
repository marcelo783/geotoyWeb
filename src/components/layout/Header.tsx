
import { CriarPedidoDialog } from "../CriarPedidoDialog";
import { UserMenuSheet } from "./UserMenuSheet";

export function Header() {
  return (
    <header className="h-16 px-6 flex items-center justify-between bg-[#11172d] shadow-sm z-10 border-b border-purple-900/50">
      <h1 className="text-xl font-semibold text-white">
        Gerenciamento de Pedidos
      </h1>
      
      <div className="flex items-center gap-4">
        <CriarPedidoDialog />
        <UserMenuSheet />
      </div>
    </header>
  );
}