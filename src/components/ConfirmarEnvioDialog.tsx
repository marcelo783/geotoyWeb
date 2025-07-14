// ConfirmarEnvioDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

type Status = "novo" | "producao" | "finalizado" | "enviado";

type Props = {
  ordemId: string;
  emailCliente?: string;
  statusDestino: Status;
  cliente: string;
  produto: string;
  onConfirmado: () => void;
};

const mensagensDefault: Record<Status, string> = {
  novo: "Recebemos seu pedido e ele será processado em breve.",
  producao: "Seu pedido está em produção.",
  finalizado: "Seu pedido foi finalizado com sucesso.",
  enviado: "Seu pedido foi enviado. Em breve você receberá os detalhes de rastreio.",
};

export function ConfirmarEnvioDialog({
  ordemId,
  emailCliente,
  statusDestino,
  cliente,
  produto,
  onConfirmado,
}: Props) {
  const [open, setOpen] = useState(true);
  const [mensagem, setMensagem] = useState(
    `Olá ${cliente},\n\n${mensagensDefault[statusDestino]}\n\nProduto: ${produto}`
  );
  const [arquivos, setArquivos] = useState<File[]>([]);
  const [codigoRastreio, setCodigoRastreio] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setArquivos(Array.from(e.target.files));
    }
  };

  const handleEnviar = async () => {
    const formData = new FormData();
    formData.append("mensagem", mensagem);
    formData.append("status", statusDestino);
    formData.append("email", emailCliente || "");

    if (statusDestino === "enviado" && codigoRastreio) {
      formData.append("codigoRastreamento", codigoRastreio);
    }

    arquivos.forEach((file) => {
      formData.append("arquivos", file); // campo correto!
    });

    try {
      setEnviando(true);
      const res = await axios.post(
        `http://localhost:3000/orders/${ordemId}/enviar-email`,
        formData
        // ⚠️ Não defina manualmente 'Content-Type' aqui!
      );
      console.log("📦 Resposta do backend:", res.data);
      toast.success("Email enviado com sucesso!");
      onConfirmado();
      setOpen(false);
    } catch (err: any) {
      console.error("❌ Falha ao enviar:", err);
      toast.error("Erro ao enviar email");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Enviar mensagem para o cliente</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {emailCliente
              ? `Email para: ${emailCliente}`
              : "Deseja continuar com o envio?"}
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
              <Input
                type="file"
                name="arquivos"
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />
            </div>
          )}

          {statusDestino === "enviado" && (
            <>
              <div>
                <Label>Código de Rastreio</Label>
                <Input
                  value={codigoRastreio}
                  onChange={(e) => setCodigoRastreio(e.target.value)}
                />
              </div>
              <div>
                <Label>Anexar Nota Fiscal (PDF)</Label>
                <Input
                  type="file"
                  name="arquivos"
                  accept=".pdf"
                  multiple
                  onChange={handleFileChange}
                />
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
          <Button onClick={handleEnviar} disabled={enviando}>
            {enviando ? "Enviando..." : "Enviar e Continuar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
