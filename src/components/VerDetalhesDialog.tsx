import {
  Dialog,
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
import { ScrollArea } from "./ui/scroll-area";



type Props = {
  ordem: {
    _id: string;
    produto: string;
    cliente: string;
    email?: string;
    telefone?: string;
    endereco?: string;
    observacao?: string[];
    frete?: number;
    valorUnitario?: number;
    valorTotal?: number;
    imagem?: string;
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
        valorUnitario: Number(form.valorUnitario),
        previsaoEntrega: form.previsaoEntrega,
        mensagemEmail: form.mensagemEmail,
      };

      await axios.patch(`http://localhost:3000/orders/${ordem._id}`, payload);
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

      <DialogContent className="max-w-6xl w-full h-[85vh] p-0">
        <div className="flex h-full">
          {/* Área esquerda */}
          <div className="w-2/3 flex flex-col h-full p-4 border-r">
            <div className="flex-1 min-h-0">
              <div className="pb-40">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold mb-4">
                    Editar Ordem: {ordem.produto}
                  </DialogTitle>
                </DialogHeader>

                {ordem.imagem && (
                  <img
                    src={ordem.imagem}
                    alt="Imagem do produto"
                    className="w-full h-48 object-contain rounded border mb-4"
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  {/* Observações + botão lado a lado */}
              <div className="md:col-span-1">
                <Label htmlFor="observacaoTexto">Observações</Label>
                <Textarea
                  id="observacaoTexto"
                  name="observacaoTexto"
                  value={form.observacaoTexto}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>
              <div className="md:col-span-1 flex items-end justify-end pt-6">
                <Button onClick={handleUpdate} disabled={loading}>
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
             
            </div>
                </div>
              </div>
            </div>
          </div>

          {/* Área direita: Email, vamos ignonar essa div por enquanto WhatsApp e Nota Fiscal */}
          <div className="w-1/3 p-6 overflow-y-auto max-h-full">
            <ScrollArea className="h-[calc(85vh-72px)] pr-2">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Editar Email</h3>
                  <Textarea
                    name="mensagemEmail"
                    value={form.mensagemEmail}
                    onChange={handleChange}
                    className="min-h-[140px]"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Editar Mensagem WhatsApp</h3>
                  <Textarea
                    disabled
                    placeholder="(em breve)"
                    className="min-h-[100px] text-muted-foreground"
                  />
                </div>

              

                
                
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
