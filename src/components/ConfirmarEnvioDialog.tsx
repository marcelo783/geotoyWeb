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
import {
  Mail,
  Image as ImageIcon,
  FileText,
  Truck,
  MessageCircle,
  Trash2,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useEffect, useState } from "react";
import axios from "axios";

type Status = "novo" | "producao" | "finalizado" | "enviado" | "feedback";

type Props = {
  ordemId: string;
  emailCliente?: string;
  statusDestino: Status;
  cliente: string;
  produto: string;
  onConfirmado: (data: {
    mensagem: string;
    arquivos?: File[]; // envia tudo aqui
    codigoRastreio?: string;
  }) => void;
  onCancelado: () => void;
};



export function ConfirmarEnvioDialog({
  emailCliente,
  statusDestino,
  onConfirmado,
  onCancelado,
}: Props) {
 
  const [mensagem, setMensagem] = useState('');

  const [loadingMensagem, setLoadingMensagem] = useState(true);
  const [arquivosImagens, setArquivosImagens] = useState<File[]>([]);
  const [arquivosPDF, setArquivosPDF] = useState<File[]>([]);
  const [codigoRastreio, setCodigoRastreio] = useState("");
 const [, setImagemZoom] = useState<string | null>(null);


    const [mostrarLoading, setMostrarLoading] = useState(false);

useEffect(() => {
  setLoadingMensagem(true);
  axios
    .get(`http://localhost:3000/orders/mensagens/${statusDestino}`,{
       withCredentials: true,
    })
     
    .then((res) => {
      setMensagem(res.data.mensagem); // backend retorna { assunto, mensagem, gifUrl }
    })
    
    .catch((err) => {
      console.error("Erro ao buscar mensagem:", err);
      setMensagem(""); // fallback vazio
    })
    .finally(() => setLoadingMensagem(false));
    
}, [statusDestino]);


  const handleSubmit = () => {
    setMostrarLoading(true);
    onConfirmado({
      mensagem,
      arquivos: [...arquivosImagens, ...arquivosPDF],
      codigoRastreio,
      
    });
  };

  

  return (

    <>

    <Dialog open onOpenChange={onCancelado}>
      <DialogContent className="max-w-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-500" />
            Enviar mensagem para o cliente
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {emailCliente
              ? `Email para: ${emailCliente}`
              : "Deseja continuar com o envio?"}
          </p>
        </DialogHeader>

        {/* Conteúdo com Scroll */}
        <div className="space-y-5 max-h-[400px] overflow-y-auto pr-1 mt-4">
          <div>
            <Label className="flex items-center gap-2 text-sm font-medium mb-1">
              <Mail className="w-4 h-4 text-muted-foreground" />
              Mensagem de Email
            </Label>
            <Textarea
             value={loadingMensagem ? "Carregando mensagem..." : mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              className="min-h-[140px]"
            />
          </div>

          {/* Upload de Imagens */}
          {statusDestino === "finalizado" && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <ImageIcon className="w-4 h-4 text-muted-foreground" />
                Anexar Imagens
              </Label>

              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    const novas = Array.from(e.target.files);
                    setArquivosImagens((prev) => [...prev, ...novas]);
                  }
                }}
              />

              {arquivosImagens.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {arquivosImagens.map((file, index) => {
                    const src = URL.createObjectURL(file);
                    return (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <div className="relative group cursor-pointer">
                            <img
                              src={src}
                              alt={`preview-${index}`}
                              className="w-16 h-16 object-cover rounded shadow border hover:ring-2 hover:ring-primary transition"
                              onClick={() => setImagemZoom(src)}
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="absolute top-0 right-0 text-red-500"
                              onClick={() => {
                                setArquivosImagens((prev) =>
                                  prev.filter((_, i) => i !== index)
                                );
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{file.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Upload de PDF */}
          {statusDestino === "enviado" && (
            <>
              <div>
                <Label className="flex items-center gap-2 text-sm font-medium mb-1">
                  <Truck className="w-4 h-4 text-muted-foreground" />
                  Código de Rastreio
                </Label>
                <Input
                  value={codigoRastreio}
                  onChange={(e) => setCodigoRastreio(e.target.value)}
                />
              </div>
              <div>
                <Label className="flex items-center gap-2 text-sm font-medium mb-1">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  Nota Fiscal (PDF)
                </Label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      const novas = Array.from(e.target.files);
                      setArquivosImagens((prev) => [...prev, ...novas]);
                    }
                  }}
                />

                <Input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      const novas = Array.from(e.target.files);
                      setArquivosPDF((prev) => [...prev, ...novas]);
                    }
                  }}
                />
              </div>
            </>
          )}

          {/* WhatsApp Placeholder */}
          <div>
            <Label className="flex items-center gap-2 text-sm font-medium mb-1">
              <MessageCircle className="w-4 h-4 text-muted-foreground" />
              WhatsApp
            </Label>
            <Textarea
              disabled
              placeholder="(em breve)"
              className="min-h-[100px] text-muted-foreground cursor-not-allowed"
            />
          </div>
        </div>

        {/* Botões fixos */}
        <div className="flex justify-end gap-2 pt-6 border-t mt-6">
          <Button variant="ghost" onClick={onCancelado}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Enviar e Continuar</Button>
        </div>
      </DialogContent>
    </Dialog>

    {mostrarLoading && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100]">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-t-yellow-400 border-blue-200 mb-6"></div>
            <p className="text-white text-xl font-bold text-center">
              Por favor, aguarde enquanto processamos seu pedido.
            </p>
          </div>
        </div>
      )}

    </>
  );
}
