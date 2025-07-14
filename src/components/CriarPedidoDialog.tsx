import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export function CriarPedidoDialog() {
  const [open, setOpen] = useState(false);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [dados, setDados] = useState<any>(null);

  const [form, setForm] = useState<any>({});

  const handleArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setArquivo(file || null);
  };

  const extrairDados = async () => {
    if (!arquivo) return;
    const formData = new FormData();
    formData.append("file", arquivo);

    setCarregando(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/orders/upload",
        formData
      );
      setDados(res.data);
      setForm({
        ...res.data,
        observacaoTexto: res.data.observacao?.join("\n") || "",
      });
      toast.success("Dados extraídos com sucesso!");
    } catch (err) {
      toast.error("Erro ao extrair dados do PDF");
    } finally {
      setCarregando(false);
    }
  };

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setForm((prev: any) => {
    const updated = { ...prev, [name]: value };

    // Atualiza automaticamente valorTotal
    if (name === "frete" || name === "valorUnitario") {
      const frete = parseFloat(name === "frete" ? value : updated.frete || 0);
      const valor = parseFloat(name === "valorUnitario" ? value : updated.valorUnitario || 0);
      updated.valorTotal = frete + valor;
    }

    return updated;
  });
};

  const [enviando, setEnviando] = useState(false);

const criarPedido = async () => {
  if (enviando) return; // impede múltiplas chamadas
  setEnviando(true);

  try {
    const payload = {
      cliente: form.cliente,
      email: form.email,
      telefone: form.telefone,
      endereco: form.endereco,
      observacao: form.observacaoTexto.split("\n"),
      frete: Number(form.frete),
      valorUnitario: Number(form.valorUnitario),
      valorTotal: Number(form.valorTotal),
      previsaoEntrega: form.previsaoEntrega,
      imagem: form.imagem,
      produto: form.produto,
      status: "novo",
    };

    await axios.post("http://localhost:3000/orders", payload);
    toast.success("Pedido criado com sucesso!");
    setOpen(false);
  } catch (err) {
    toast.error("Erro ao criar pedido");
  } finally {
    setEnviando(false);
  }
};


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Novo Pedido</Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Pedido via PDF</DialogTitle>
        </DialogHeader>

        {!dados ? (
          <div className="space-y-4">
            <Label>Enviar Ordem de Serviço (PDF)</Label>
            <Input type="file" accept=".pdf" onChange={handleArquivo} />
            <Button onClick={extrairDados} disabled={!arquivo || carregando}>
              {carregando ? "Carregando..." : "Extrair Dados"}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div>
              <Label>Cliente</Label>
              <Input
                name="cliente"
                value={form.cliente || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                name="email"
                value={form.email || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Telefone</Label>
              <Input
                name="telefone"
                value={form.telefone || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Endereço</Label>
              <Input
                name="endereco"
                value={form.endereco || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Produto</Label>
              <Input
                name="produto"
                value={form.produto || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Previsão de Entrega</Label>
              <Input
                type="date"
                name="previsaoEntrega"
                value={form.previsaoEntrega?.split("T")[0] || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Frete</Label>
              <Input
                name="frete"
                type="number"
                step="0.01"
                value={form.frete || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Valor Unitário</Label>
              <Input
                name="valorUnitario"
                type="number"
                step="0.01"
                value={form.valorUnitario || ""}
                onChange={handleChange}
              />

              <div>
                <Label>Valor Total</Label>
                <Input
                  name="valorTotal"
                  type="number"
                  step="0.01"
                  value={form.valorTotal || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <Label>Observações</Label>
              <Textarea
                name="observacaoTexto"
                value={form.observacaoTexto}
                onChange={handleChange}
              />
            </div>

            <div className="col-span-2 flex justify-end gap-2 pt-4">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
             <Button onClick={criarPedido} disabled={enviando}>
  {enviando ? "Criando..." : "Criar Novo Pedido"}
</Button>

            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
