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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

import { Dialog as PreviewDialog, DialogContent as PreviewDialogContent } from "@/components/ui/dialog";
import {
  ImagePlus,
  StickyNote,
  Trash2,
  X,
  BadgeDollarSign,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function CriarPedidoDialog() {
  const [open, setOpen] = useState(false);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [dados, setDados] = useState<any>(null);
  const [imagemZoom, setImagemZoom] = useState<string | null>(null);

  const [form, setForm] = useState<any>({
    imagens: [],
    imagemPreviaUrls: [],
  });

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
      setForm((prev: any) => ({
        ...prev,
        ...res.data,
        observacaoTexto: res.data.observacao?.join("\n") || "",
      }));
      toast.success("Dados extraídos com sucesso!");
    } catch {
      toast.error("Erro ao extrair dados do PDF");
    } finally {
      setCarregando(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev: any) => {
      const updated = { ...prev, [name]: value };
      if (name === "frete" || name === "valorUnitario") {
        const frete = parseFloat(name === "frete" ? value : updated.frete || 0);
        const valor = parseFloat(
          name === "valorUnitario" ? value : updated.valorUnitario || 0
        );
        updated.valorTotal = frete + valor;
      }
      return updated;
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setForm((prev: any) => ({
      ...prev,
      imagens: [...prev.imagens, ...files],
      imagemPreviaUrls: [
        ...prev.imagemPreviaUrls,
        ...files.map((f) => URL.createObjectURL(f)),
      ],
    }));
  };

  const handleImageDelete = (index: number) => {
    setForm((prev: any) => ({
      ...prev,
      imagens: prev.imagens.filter((_, i) => i !== index),
      imagemPreviaUrls: prev.imagemPreviaUrls.filter((_, i) => i !== index),
    }));
  };

  const criarPedido = async () => {
    if (enviando) return;
    setEnviando(true);

    try {
      const formData = new FormData();
      [
        "cliente",
        "email",
        "telefone",
        "endereco",
        "produto",
        "previsaoEntrega",
        "frete",
        "valorUnitario",
        "valorTotal",
      ].forEach((key) => formData.append(key, String(form[key])));

      form.observacaoTexto
        .split("\n")
        .forEach((obs: string) => formData.append("observacao", obs));

      form.imagens.forEach((img: File) => {
        formData.append("imagens", img);
      });

      formData.append("status", "novo");

      await axios.post("http://localhost:3000/orders/com-imagem", formData);
      toast.success("Pedido criado com sucesso!");
      setOpen(false);
    } catch {
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

      <DialogContent className="max-w-5xl h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Novo Pedido via PDF</DialogTitle>
        </DialogHeader>

        <div className="flex h-full px-6 gap-6">
          {/* Lado esquerdo: formulário */}
          <ScrollArea className="flex-1 pr-4 pt-4 pb-32">
            {!dados ? (
              <div className="space-y-4">
                <Label>Enviar Ordem de Serviço (PDF)</Label>
                <Input type="file" accept=".pdf" onChange={handleArquivo} />
                <Button
                  onClick={extrairDados}
                  disabled={!arquivo || carregando}
                >
                  {carregando ? "Carregando..." : "Extrair Dados"}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["cliente", "email", "telefone", "endereco", "produto"].map(
                  (field) => (
                    <div key={field}>
                      <Label className="capitalize">{field}</Label>
                      <Input
                        name={field}
                        value={form[field] || ""}
                        onChange={handleChange}
                      />
                    </div>
                  )
                )}

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
                </div>

                {/* Observações + Valor Total lado a lado */}
                <div className="flex gap-4 md:col-span-2">
                  <div className="flex-1 w-[300px]">
                    <Label className="flex items-center gap-2">
                      <StickyNote className="w-4 h-4 text-muted-foreground" />
                      Observações
                    </Label>
                    <Textarea
                      name="observacaoTexto"
                      value={form.observacaoTexto}
                      onChange={handleChange}
                      className="mt-2 min-h-[130px]"
                    />
                  </div>

                  <div className="w-[200px] flex flex-col justify-between">
                    <div>
                      <Label className="flex items-center gap-2">
                        <BadgeDollarSign className="w-4 h-4 text-muted-foreground" />
                        Valor Total
                      </Label>
                      <Input
                        name="valorTotal"
                        type="number"
                        step="0.01"
                        value={form.valorTotal || ""}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="ghost" onClick={() => setOpen(false)}>
                        <X className="w-4 h-4 mr-1" />
                        Cancelar
                      </Button>
                      <Button onClick={criarPedido} disabled={enviando}>
                        {enviando ? "Criando..." : "Criar Pedido"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>

          {/* Lado direito: imagens */}
          <div className="w-80 pt-4 flex flex-col gap-4 border-l pl-4">
            <div>
              <Label className="flex items-center gap-2">
                <ImagePlus className="w-4 h-4" />
                Anexar imagens do produto
              </Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
            </div>

            {form.imagemPreviaUrls?.length > 0 && (
              <div className="flex flex-wrap gap-4 pt-2">
                {form.imagemPreviaUrls.map((src: string, index: number) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div className="relative group cursor-pointer">
                        <img
                          src={src}
                          alt={`preview-${index}`}
                          className="w-28 h-28 object-cover border rounded hover:ring-2 hover:ring-primary"
                          onClick={() => setImagemZoom(src)}
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute top-0 right-0 text-red-500"
                          onClick={() => handleImageDelete(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Clique para visualizar</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dialog para visualizar imagem em zoom */}
        {/* Dialog de Zoom da imagem */}
        {imagemZoom && (
          <PreviewDialog open onOpenChange={() => setImagemZoom(null)}>
            <PreviewDialogContent className="max-w-3xl flex items-center justify-center">
              <img src={imagemZoom} alt="Zoom" className="max-h-[75vh] object-contain" />
            </PreviewDialogContent>
          </PreviewDialog>
        )}
      </DialogContent>
    </Dialog>
  );
}
