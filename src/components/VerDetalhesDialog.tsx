import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { X } from "lucide-react";

type Props = {
  ordem: {
    id: string;
    produto: string;
    cliente: string;
    email?: string;
    telefone?: string;
    endereco?: string;
    observacao?: string[];
    pintor?: string;
    frete?: number;
    valorUnitario?: number;
    valorTotal?: number;
    imagem?: string;
    imagens?: string[];
    previsaoEntrega?: string;
  };
};

export function VerDetalhesDialog({ ordem }: Props) {
  const [form, setForm] = useState({
    ...ordem,
    observacaoTexto: ordem.observacao?.join("\n") || "",
    mensagemEmail: `Olá ${ordem.cliente},\n\nSeu pedido foi atualizado para o status correspondente.\nObrigado por comprar conosco!`,
  });

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);

  const [imagemZoom, setImagemZoom] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const payload = {
        cliente: form.cliente,
        email: form.email,
        telefone: form.telefone,
        endereco: form.endereco,
        observacao: form.observacaoTexto.split("\n"),
        frete: Number(form.frete),
        pintor: form.pintor,
        valorUnitario: Number(form.valorUnitario),
        previsaoEntrega: form.previsaoEntrega,
        mensagemEmail: form.mensagemEmail,
      };

      await axios.patch(`http://localhost:3000/orders/${ordem.id}`, payload);
      toast.success("Ordem atualizada com sucesso");
    } catch (err) {
      toast.error("Erro ao atualizar a ordem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" variant="outline">
          Ver detalhes
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-6xl w-full h-[85vh] p-0 border-none bg-black/50 backdrop-blur-sm text-amber-50">
        <div className="flex h-full">
          {/* Área esquerda */}
          <div className="w-2/3 flex flex-col h-full p-4 ">
            <div className="flex-1 min-h-0">
              <div className="pb-40">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold mb-4">
                    Editar Ordem: {ordem.produto}
                  </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  <div>
                    <Label htmlFor="cliente">Cliente</Label>
                    <Input
                      id="cliente"
                      name="cliente"
                      value={form.cliente}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      name="telefone"
                      value={form.telefone}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      name="endereco"
                      value={form.endereco}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="frete">Frete</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">R$</span>
                      <Input
                        id="frete"
                        name="frete"
                        type="number"
                        step="0.01"
                        value={form.frete}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="valorUnitario">Valor Unitário</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">R$</span>
                      <Input
                        id="valorUnitario"
                        name="valorUnitario"
                        type="number"
                        step="0.01"
                        value={form.valorUnitario}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="previsaoEntrega">Previsão de Entrega</Label>
                    <Input
                      id="previsaoEntrega"
                      name="previsaoEntrega"
                      type="date"
                      value={form.previsaoEntrega?.split("T")[0] || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-col justify-end pt-5">
                    <span className="text-sm text-muted-foreground">
                      Valor Total:
                    </span>
                    <span className="font-medium">
                      {formatCurrency(
                        (Number(form.frete) || 0) +
                          (Number(form.valorUnitario) || 0)
                      )}
                    </span>
                  </div>

                  {/* 🔽 Metade inferior: Responsável pela pintura */}

                  <div className="md:col-span-1">
                    <Label htmlFor="observacaoTexto">Observações</Label>
                    <Textarea
                      id="observacaoTexto"
                      name="observacaoTexto"
                      value={form.observacaoTexto}
                      onChange={handleChange}
                      className="min-h-[50px] max-h-[100px] overflow-y-auto"
                    />
                  </div>

                  {/* Botões de ação */}
                  <div className="h-1/2  mt-4 pt-4 ">
                    <h4 className="text-lg font-semibold mb-2">
                      Responsável pela pintura
                    </h4>
                    <div className=" flex justify-start gap-15 ">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="pintor"
                          value="Geraldo"
                          checked={form.pintor === "Geraldo"}
                          onChange={(e) =>
                            setForm({ ...form, pintor: e.target.value })
                          }
                          className="accent-[var(--primary)]"
                        />
                        <span>Geraldo</span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="pintor"
                          value="Juliano"
                          checked={form.pintor === "Juliano"}
                          onChange={(e) =>
                            setForm({ ...form, pintor: e.target.value })
                          }
                          className="accent-[var(--primary)]"
                        />
                        <span>Juliano</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Área direita: Imagens anexadas */}
          <div className="w-1/3 h-full p-6  flex flex-col">
            {/* 🔼 Metade superior: Imagens */}
            <div className="h-1/2 overflow-y-auto pr-2">
              <h3 className="text-lg font-semibold mb-2">Imagens Anexadas</h3>

              {ordem.imagens && ordem.imagens.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {ordem.imagens.map((url, index) => (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <div
                          className="relative group cursor-pointer"
                          onClick={() => setImagemZoom(url)}
                        >
                          <img
                            src={url}
                            alt={`imagem-${index}`}
                            className="w-28 h-28 object-cover border rounded hover:ring-2 hover:ring-primary"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Clique para ampliar</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhuma imagem anexada.
                </p>
              )}
            </div>

            {/* Observações + botões lado a lado */}
            <div className="md:col-span-1 flex items-end justify-between pt-6 gap-2">
              {/* ALERT DIALOG DE CONFIRMAÇÃO */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Apagar Ordem</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Tem certeza que deseja apagar?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. A ordem será
                      permanentemente removida do sistema.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={async () => {
                        try {
                          await axios.delete(
                            `http://localhost:3000/orders/${ordem.id}`
                          );
                          toast.success("Ordem apagada com sucesso");
                          setOpen(false); // fecha o Dialog principal
                        } catch (err) {
                          toast.error("Erro ao apagar ordem");
                          console.error("Erro ao deletar:", err);
                        }
                      }}
                    >
                      Confirmar Exclusão
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button onClick={handleUpdate} disabled={loading}>
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>

            {imagemZoom && (
              <Dialog
                open={!!imagemZoom}
                onOpenChange={() => setImagemZoom(null)}
              >
                <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-transparent border-none shadow-none flex items-center justify-center overflow-hidden">
                  {/* Botão de Fechar */}
                  <DialogClose asChild>
                    <button
                      aria-label="Fechar"
                      className="absolute top-4 right-4 bg-white text-[var(--primary)] p-2 rounded-full shadow hover:bg-muted transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </DialogClose>

                  {/* Imagem */}
                  <img
                    src={imagemZoom}
                    alt="Zoom"
                    className="max-w-full max-h-[80vh] object-contain"
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
