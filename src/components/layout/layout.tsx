// src/components/layout/Layout.tsx
import { Sidebar } from "../ui/sidebar";
import { Header } from "./Header";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      <Sidebar />
      
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}