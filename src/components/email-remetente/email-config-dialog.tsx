// src/components/email-config-dialog.tsx
"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock, Save } from "lucide-react"

import { toast } from "sonner"
import api from "@/services/api"

export function EmailConfigDialog() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [hasPassword, setHasPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Buscar configuração ao abrir o dialog
  useEffect(() => {
    if (open) {
      setLoading(true)
      api.get("/email-config", { withCredentials: true })
        .then(res => {
          setEmail(res.data.email || "")
          setHasPassword(!!res.data.hasPassword)
          setPassword("")
        })
        .catch(() => toast.error("Erro ao carregar configuração de e-mail"))
        .finally(() => setLoading(false))
    }
  }, [open])

  const salvarConfig = async () => {
    if (!email) {
      toast.error("Por favor, informe um e-mail")
      return
    }
    
    if (!hasPassword && !password) {
      toast.error("Por favor, informe uma senha")
      return
    }

    try {
      setLoading(true)
      await api.post("/email-config", { email, password }, { withCredentials: true })
      toast.success("Configuração de e-mail salva com sucesso!")
      setOpen(false)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erro ao salvar configuração")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>

       <DialogTrigger asChild>
      <Button 
        variant="outline" 
        className="bg-[#1C2237] text-white border border-purple-600/30 hover:bg-[#2A3249]"
      >
        <Mail className="mr-2 h-4 w-4" />
        Configurar Email
      </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1C2237] text-white border p-4 border-purple-600/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Configuração de Email
          </DialogTitle>
          <DialogDescription className="text-purple-300">
            Configure o email remetente para envio de notificações
          </DialogDescription>
        </DialogHeader>

        <Card className="bg-[#11172D] border border-purple-600/30">
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-purple-300">
                Email Remetente
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@gmail.com"
                  className="bg-[#0A0F1F] border-purple-600/30 text-white pl-9"
                  disabled={loading}
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-purple-300">
                Senha do Aplicativo
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={hasPassword ? "••••••••" : "Digite a senha do app"}
                  className="bg-[#0A0F1F] border-purple-600/30 text-white pl-9 pr-10"
                  disabled={loading}
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-xs text-purple-400">
                {hasPassword 
                  ? "Senha já configurada. Digite uma nova senha apenas se deseja alterá-la." 
                  : "Use a senha de aplicativo do Gmail ou equivalente para outros provedores."
                }
              </p>
            </div>

            <Button 
              onClick={salvarConfig} 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </div>
              ) : (
                <div className="flex items-center">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Configuração
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}