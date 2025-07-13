import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState } from "react"

type Props = {
  mensagemInicial: string
  onConfirm: (data: {
    mensagem: string
    arquivos?: File[]
    codigoRastreio?: string
  }) => void
  statusDestino: "finalizado" | "enviado" | string
  emailCliente?: string
}

export function ConfirmarEnvioDialog({
  mensagemInicial,
  onConfirm,
  statusDestino,
  emailCliente,
}: Props) {
  const [open, setOpen] = useState(false)
  const [mensagem, setMensagem] = useState(mensagemInicial)
  const [arquivos, setArquivos] = useState<File[]>([])
  const [codigoRastreio, setCodigoRastreio] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setArquivos(Array.from(e.target.files))
    }
  }

  const handleConfirm = () => {
    onConfirm({
      mensagem,
      arquivos,
      codigoRastreio: statusDestino === "enviado" ? codigoRastreio : undefined,
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant="outline">
          Enviar Email
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Enviar mensagem para o cliente</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {emailCliente ? `Email para: ${emailCliente}` : "Deseja continuar com o envio?"}
          </p>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label>Editar Email</Label>
            <Textarea
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              className="min-h-[140px]"
            />
          </div>

          {statusDestino === "finalizado" && (
            <div>
              <Label>Anexar imagens</Label>
              <Input type="file" multiple accept="image/*" onChange={handleFileChange} />
            </div>
          )}

          {statusDestino === "enviado" && (
            <>
              <div>
                <Label>Código de Rastreio</Label>
                <Input
                  value={codigoRastreio}
                  onChange={(e) => setCodigoRastreio(e.target.value)}
                  placeholder="EX123456789BR"
                />
              </div>
              <div>
                <Label>Anexar Nota Fiscal (PDF)</Label>
                <Input type="file" accept=".pdf" multiple onChange={handleFileChange} />
              </div>
            </>
          )}

          <div>
            <Label>WhatsApp</Label>
            <Textarea
              disabled
              placeholder="(em breve)"
              className="min-h-[100px] text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>Enviar e Continuar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
