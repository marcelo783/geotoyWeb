import { LayoutDashboard, Menu, Package, Send, Settings, MessageCircleMore } from "lucide-react"
import { useState } from "react"
import logo from "../../../public/Camada 1.png"


const navItems = [
  { label: "Ordens", icon: Package, href: "/ordens" },
  { label: "Enviados", icon: Send, href: "/enviados" },
  { label: "Feedback", icon: MessageCircleMore, href: "/Feedback" },
  { label: "Dashboard", icon: LayoutDashboard, href: "/Dashboard" },
  { label: "Configuração", icon: Settings, href: "/configuracao" },

]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`h-screen bg-muted/40 border-none transition-all  duration-300 ${
        collapsed ? "w-16" : "w-64"
      } flex flex-col`}
    >
      {/* Cabeçalho fixo */}
<div className={`
  h-16 flex items-center justify-between px-4
  bg-[#0F172A]  /* Azul escuro do sidebar */
  shadow-sm     /* Intensidade maior */
   shadow-fuchsia-400  /* Sombra roxa com transparência */
  z-10          /* Garante elevação */
  sticky top-0  /* Fixa no topo */
  ${!collapsed ? 'border-b border-purple-800' : ''} /* Borda condicional */
`}>
  {!collapsed && (
    <span className="text-lg font-semibold">
      <img className="h-8 w-auto" src={logo} alt="Logo" />
    </span>
  )}
  
  <button
    onClick={() => setCollapsed(!collapsed)}
    className="p-2 rounded-full hover:bg-purple-800/50 ml-auto transition"
  >
    <Menu className="w-5 h-5 text-purple-300" />
  </button>
</div>

      {/* Itens de navegação */}
      <nav className="flex-1 py-4 px-2 space-y-1 bg-gray-900">
        {navItems.map(({ label, icon: Icon, href }) => (
          <a
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-muted hover:text-foreground transition-colors"
          >
            <Icon className="w-4 h-4" />
            {!collapsed && <span>{label}</span>}
          </a>
        ))}
      </nav>
    </aside>
  )
}
