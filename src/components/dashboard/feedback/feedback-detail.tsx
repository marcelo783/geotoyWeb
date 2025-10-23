// components/dashboard/feedback/feedback-detail.tsx
import { Star, Calendar, User, Package, Mail, Phone, DollarSign, Truck, Palette, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";

interface FeedbackDetailProps {
  feedback: any;
  onClose: () => void;
}

export default function FeedbackDetail({ feedback, onClose }: FeedbackDetailProps) {
  const [imagemZoom, setImagemZoom] = useState<string | null>(null)

  const renderStars = (nota: number) => {
    return (
      <div className="flex items-center  gap-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < nota ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
              }`}
            />
          ))}
        </div>
        <span className="text-md font-medium">
          {["Ruim", "Regular", "Bom", "Muito Bom", "Ótimo"][nota - 1]}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informações do Cliente */}
        <div className="bg-[#11172D] p-4 rounded-lg border border-purple-600/30">
          <h3 className="text-lg font-semibold mb-4 text-purple-300">Informações do Cliente</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm text-purple-300">Cliente</p>
                <p className="font-semibold">{feedback.order.cliente}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm text-purple-300">Email</p>
                <p className="font-semibold">{feedback.order.email || "N/A"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm text-purple-300">Telefone</p>
                <p className="font-semibold">{feedback.order.telefone || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Informações do Pedido */}
        <div className="bg-[#11172D] p-4 rounded-lg border border-purple-600/30">
          <h3 className="text-lg font-semibold mb-4 text-purple-300">Informações do Pedido</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm text-purple-300">Produto</p>
                <p className="font-semibold">{feedback.order.produto}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Palette className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm text-purple-300">Pintor</p>
                <p className="font-semibold">{feedback.order.pintor || "Não atribuído"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm text-purple-300">Data do Feedback</p>
                <p className="font-semibold">
                  {new Date(feedback.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Informações Financeiras */}
      <div className="bg-[#11172D] p-4 rounded-lg border border-purple-600/30">
        <h3 className="text-lg font-semibold mb-4 text-purple-300">Informações Financeiras</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-purple-400" />
            <div>
              <p className="text-sm text-purple-300">Valor Unitário</p>
              <p className="font-semibold">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(feedback.order.valorUnitario || 0)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-purple-400" />
            <div>
              <p className="text-sm text-purple-300">Frete</p>
              <p className="font-semibold">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(feedback.order.frete || 0)}
              </p>
            </div>
          </div>

          
 <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-purple-400" />
            <div>
              <p className="text-sm text-purple-300">Valor Total</p>
              <p className="font-semibold">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(feedback.order.valorTotal || 0)}
              </p>
            </div>
          </div>
          
         
        </div>
      </div>

      {/* Observações */}
      {feedback.order.observacao && feedback.order.observacao.length > 0 && (
        <div className="bg-[#11172D] p-4 rounded-lg border border-purple-600/30">
          <h3 className="text-lg font-semibold mb-4 text-purple-300">Observações</h3>
          <ul className="list-disc list-inside space-y-1">
            {feedback.order.observacao.map((obs: string, index: number) => (
              <li key={index} className="text-sm">{obs}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Avaliações */}
      <div className="bg-[#11172D] p-4 rounded-lg border border-purple-600/30">
        <h3 className="text-lg font-semibold mb-4 text-purple-300">Avaliações</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-purple-300 mb-2">Atendimento</p>
            {renderStars(feedback.atendimento)}
          </div>
          
          <div>
            <p className="text-sm text-purple-300 mb-2">Tempo de Entrega</p>
            {renderStars(feedback.tempoEntrega)}
          </div>
          
          <div>
            <p className="text-sm text-purple-300 mb-2">Qualidade do Material</p>
            {renderStars(feedback.qualidadeMaterial)}
          </div>
        </div>
      </div>

      {/* Comentário */}
      <div className="bg-[#11172D] p-4 rounded-lg border border-purple-600/30">
        <h3 className="text-lg font-semibold mb-3 text-purple-300">Comentário do Cliente</h3>
        <div className="bg-[#0A0F1F] p-4 rounded-lg">
          <p className="text-white">{feedback.comentario}</p>
        </div>
      </div>

     {/* Imagens */}
      {(feedback.order.imagem || feedback.order.imagens) && (
        <div className="bg-[#11172D] p-4 rounded-lg border border-purple-600/30">
          <h3 className="text-lg font-semibold mb-4 text-purple-300">Imagens do Pedido</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Caso tenha apenas 1 imagem */}
            {feedback.order.imagem && (
              <div className="relative group">
                <img
                  src={feedback.order.imagem}
                  alt="Imagem do pedido"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button
                    onClick={() => setImagemZoom(feedback.order.imagem)}
                    className="bg-purple-600 hover:bg-purple-700"
                    size="sm"
                  >
                    Ampliar
                  </Button>
                </div>
              </div>
            )}

            {/* Caso tenha múltiplas imagens */}
            {feedback.order.imagens &&
              feedback.order.imagens.map((img: string, index: number) => (
                <div key={index} className="relative group">
                  <img
                    src={img}
                    alt={`Imagem do pedido ${index + 1}`}
                    className="w-50 h-50 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-transparent bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button
                      onClick={() => setImagemZoom(img)}
                      className="bg-purple-600 hover:bg-purple-700"
                      size="sm"
                    >
                      Ampliar
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Botão de fechar geral */}
      <div className="flex justify-end mt-4">
        <Button onClick={onClose} className="bg-purple-600 hover:bg-purple-700">
          Fechar
        </Button>
      </div>

      {/* Dialog de zoom da imagem */}
      {imagemZoom && (
        <Dialog open={!!imagemZoom} onOpenChange={() => setImagemZoom(null)}>
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
  );
}