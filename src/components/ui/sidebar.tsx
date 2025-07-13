import { Menu, Package, Send, Settings } from "lucide-react"
import { useState } from "react"

const navItems = [
  { label: "Ordens", icon: Package, href: "/ordens" },
  { label: "Enviados", icon: Send, href: "/enviados" },
  { label: "Configuração", icon: Settings, href: "/configuracao" },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`h-screen bg-muted/40 border-r transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      } flex flex-col`}
    >
      {/* Cabeçalho fixo, sempre visível */}
      <div className="h-16 flex items-center justify-between px-4 border-b">
        {!collapsed && <span className="text-lg font-semibold">Menu</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded hover:bg-accent ml-auto"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Itens de navegação */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map(({ label, icon: Icon, href }) => (
          <a
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Icon className="w-4 h-4" />
            {!collapsed && <span>{label}</span>}
          </a>
        ))}
      </nav>
    </aside>
  )
}
