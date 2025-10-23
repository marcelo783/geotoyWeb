import {
  LayoutDashboard,
  Menu,
  Package,
  Settings,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import logo from "../../../public/Camada 1.png";
import { Link } from "react-router-dom";
import { EmailConfigDialog } from "../email-remetente/email-config-dialog";

const navItems = [
  { label: "Ordens", icon: Package, href: "/ordens" },
  // { label: "Enviados", icon: Send, href: "/enviados" },
  // { label: "Feedback", icon: MessageCircleMore, href: "/feedback" },
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  {
    label: "Configuração",
    icon: Settings,
    href: "/configuracao",
    children: [{ label: "Email Remetente", href: "/configuracao/email" }],
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside
      className={`h-screen bg-muted/40 border-none transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      } flex flex-col`}
    >
      {/* Cabeçalho fixo */}
      <div
        className={`
          h-16 flex items-center justify-between px-4
          bg-[#0F172A]
          shadow-sm
          shadow-fuchsia-400
          z-10
          sticky top-0
          ${!collapsed ? "border-b border-purple-800" : ""}
        `}
      >
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
        {navItems.map(({ label, icon: Icon, href, children }) => {
          const isOpen = openMenus[label] || false;

          if (children) {
            return (
              <div key={label}>
                <button
                  onClick={() => toggleMenu(label)}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-muted hover:text-foreground transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    {!collapsed && <span>{label}</span>}
                  </div>
                  {!collapsed &&
                    (isOpen ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    ))}
                </button>

                {/* Submenu */}
                {isOpen && !collapsed && (
                  <div className="ml-8 mt-1 space-y-1">
                    {children.map((child) => {
  if (child.label === "Email Remetente") {
    return <EmailConfigDialog key={child.label} />;
  }
  return (
    <Link
      key={child.href}
      to={child.href}
      className="block px-3 py-1 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-md"
    >
      {child.label}
    </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
             <Link
    key={href}
    to={href}
    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-muted hover:text-foreground transition-colors"
  >
    <Icon className="w-4 h-4" />
    {!collapsed && <span>{label}</span>}
  </Link>
          );
        })}
      </nav>
    </aside>
  );
}
