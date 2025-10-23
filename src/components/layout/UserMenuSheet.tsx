import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { Eye, EyeOff, Save, User, Mail, Lock} from "lucide-react";
import { useUsuario } from "@/hooks/useUsuario";
import { Input } from "../ui/input";
import { toast } from "sonner";

import { Skeleton } from "../ui/skeleton";
import api from "@/services/api";

export function UserMenuSheet() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  //const usuario = useUsuario();
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });
  const [showSenha, setShowSenha] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { usuario, fetchUsuario } = useUsuario();

  useEffect(() => {
    if (usuario) {
      setForm({
        nome: usuario.nome,
        email: usuario.email,
        senha: "",
      });
      setIsLoading(false);
    }
  }, [usuario]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

const handleSalvar = async () => {
  try {
    setIsSaving(true);

    await api.patch("/users/update", form, {
    
    });

    toast.success("Perfil atualizado com sucesso!");

    await fetchUsuario();
    console.log("Usuário atualizado:", usuario) // ✅ Atualiza os dados no frontend
    setIsSheetOpen(false);
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Erro ao atualizar perfil");
  } finally { 
    setIsSaving(false);
  }
};

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          className="p-0 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 hover:scale-105 transition-transform"
          aria-label="Abrir menu do usuário"
        >
          <Avatar className="cursor-pointer border-2 border-purple-500/80 shadow-md hover:border-purple-300 transition-colors">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium">
              {usuario?.nome?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </SheetTrigger>

      <SheetContent 
        side="right" 
        className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] border-l border-purple-900/50 text-white p-0"
      >
        <div className="flex flex-col  h-full">
          <SheetHeader className="border-b border-purple-900/50">
            <div className="flex justify-between items-center px-6">
              <SheetTitle className="text-xl text-primary-foreground font-bold flex items-center gap-2">
                <User size={20} />
                Editar Perfil
              </SheetTitle>
              
            </div>
          </SheetHeader>
          
          <div className="flex flex-col gap-6 p-6 flex-1 overflow-y-auto">
            {/* Seção de informações do usuário no topo */}
            <div className="flex items-center gap-4 pb-4 border-b border-purple-900/50">
              <Avatar className="w-12 h-12 border-2 border-purple-500">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                  {usuario?.nome?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{usuario?.nome || "Usuário"}</h3>
                <p className="text-sm text-purple-300">{usuario?.email}</p>
              </div>
            </div>

            {/* Campos do formulário */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-300 flex items-center gap-2">
                  <User size={14} />
                  Nome
                </label>
                {isLoading ? (
                  <Skeleton className="w-full h-10 bg-slate-700/50" />
                ) : (
                  <Input
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    className="bg-slate-800/50 border border-purple-600/50 text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 rounded-lg"
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-300 flex items-center gap-2">
                  <Mail size={14} />
                  Email
                </label>
                {isLoading ? (
                  <Skeleton className="w-full h-10 bg-slate-700/50" />
                ) : (
                  <Input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="bg-slate-800/50 border border-purple-600/50 text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 rounded-lg"
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-300 flex items-center gap-2">
                  <Lock size={14} />
                  Senha
                </label>
                {isLoading ? (
                  <Skeleton className="w-full h-10 bg-slate-700/50" />
                ) : (
                  <div className="relative">
                    <Input
                      name="senha"
                      type={showSenha ? "text" : "password"}
                      value={form.senha}
                      onChange={handleChange}
                      className="bg-slate-800/50 border border-purple-600/50 text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 rounded-lg pr-10"
                      placeholder="Nova senha"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-white transition-colors"
                      onClick={() => setShowSenha((prev) => !prev)}
                      aria-label={showSenha ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                )}
                <p className="text-xs text-purple-400/80 mt-1">
                  Deixe em branco para manter a senha atual
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-purple-900/50">
            <Button 
              onClick={handleSalvar} 
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg py-2 px-4 transition-all duration-200 shadow-lg shadow-purple-500/20 disabled:opacity-70"
            >
              {isSaving ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </span>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}