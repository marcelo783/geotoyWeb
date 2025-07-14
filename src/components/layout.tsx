// src/components/Layout.tsx
import { CriarPedidoDialog } from "./CriarPedidoDialog"
import { Sidebar } from "./ui/sidebar"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar lateral */}
      <Sidebar />

      {/* Área principal */}
      <div className="flex flex-col flex-1">
        {/* Header fixo */}
        <header className="h-16 border-b px-6 flex items-center bg-white shadow-sm z-10">
          <h1 className="text-xl font-semibold text-gray-800">
            Gerenciamento de Pedidos
          </h1>
          <CriarPedidoDialog/>
        </header>

        {/* Conteúdo principal abaixo do header */}
        <main className="flex-1 overflow-y-auto bg-muted/50">
          {children}
        </main>
      </div>
    </div>
  )
}
