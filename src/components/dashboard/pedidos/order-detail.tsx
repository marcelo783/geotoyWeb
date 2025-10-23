// components/dashboard/orders/order-detail.tsx
import { Calendar, User, Package, Mail, Phone, DollarSign, Truck, Palette,  X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";

interface OrderDetailProps {
  order: any;
  onClose: () => void;
}

export default function OrderDetail({ order, onClose }: OrderDetailProps) {
  const [imagemZoom, setImagemZoom] = useState<string | null>(null)

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
                <p className="font-semibold">{order.cliente}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm text-purple-300">Email</p>
                <p className="font-semibold">{order.email || "N/A"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm text-purple-300">Telefone</p>
                <p className="font-semibold">{order.telefone || "N/A"}</p>
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
                <p className="font-semibold">{order.produto}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Palette className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm text-purple-300">Pintor</p>
                <p className="font-semibold">{order.pintor || "Não atribuído"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm text-purple-300">Previsão de Entrega</p>
                <p className="font-semibold">
                  {order.previsaoEntrega 
                    ? new Date(order.previsaoEntrega).toLocaleDateString("pt-BR")
                    : "N/A"
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 flex items-center justify-center">
                <span className="text-sm text-purple-400">📦</span>
              </div>
              <div>
                <p className="text-sm text-purple-300">Status</p>
                <p className="font-semibold capitalize">{order.status}</p>
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
                }).format(order.valorUnitario || 0)}
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
                }).format(order.frete || 0)}
              </p>
              {order.tipoFrete && (
                <p className="text-xs text-purple-300 mt-1 uppercase">{order.tipoFrete}</p>
              )}
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
                }).format(order.valorTotal || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Observações */}
      {order.observacao && order.observacao.length > 0 && (
        <div className="bg-[#11172D] p-4 rounded-lg border border-purple-600/30">
          <h3 className="text-lg font-semibold mb-4 text-purple-300">Observações</h3>
          <ul className="list-disc list-inside space-y-1">
            {order.observacao.map((obs: string, index: number) => (
              <li key={index} className="text-sm">{obs}</li>
            ))}
          </ul>
        </div>
      )}

       {/* Imagens */}
      {(order.imagem || order.imagens) && (
        <div className="bg-[#11172D] p-4 rounded-lg border border-purple-600/30">
          <h3 className="text-lg font-semibold mb-4 text-purple-300">Imagens do Pedido</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Caso tenha apenas 1 imagem */}
            {order.imagem && (
              <div className="relative group">
                <img
                  src={order.imagem}
                  alt="Imagem do pedido"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button
                    onClick={() => setImagemZoom(order.imagem)}
                    className="bg-purple-600 hover:bg-purple-700"
                    size="sm"
                  >
                    Ampliar
                  </Button>
                </div>
              </div>
            )}

            {/* Caso tenha múltiplas imagens */}
            {order.imagens &&
              order.imagens.map((img: string, index: number) => (
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

      <div className="flex justify-end">
        <Button 
          onClick={onClose}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Fechar
        </Button>
      </div>
    </div>
  );
}