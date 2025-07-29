import { useEffect, useState, type JSX } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";
import { VerDetalhesDialog } from "@/components/VerDetalhesDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency, formatDate } from "@/utils/format";
import { ConfirmarEnvioDialog } from "@/components/ConfirmarEnvioDialog";
import { Plus, Clock, PackageCheck, Send } from "lucide-react";
import { toast } from "sonner";

type Order = {
  _id: string;
  cliente: string;
  produto: string;
  email?: string;
  endereco?: string;
  observacao?: string[];
  telefone?: string;
  valorUnitario?: number;
  valorTotal?: number;
  frete?: number;
  imagem?: string;
  imagens?: string[];
  previsaoEntrega?: string;
  status: "novo" | "producao" | "finalizado" | "enviado";
};

// Função para obter as classes de cor baseadas no status
const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'novo':
      return {
        bg: 'bg-blue-500/20',
        border: 'border-blue-400',
        text: 'text-blue-100'
      };
    case 'producao':
      return {
        bg: 'bg-yellow-500/20',
        border: 'border-yellow-400',
        text: 'text-yellow-100'
      };
    case 'finalizado':
      return {
        bg: 'bg-green-500/20',
        border: 'border-green-400',
        text: 'text-green-100'
      };
    case 'enviado':
      return {
        bg: 'bg-purple-500/20',
        border: 'border-purple-400',
        text: 'text-purple-100'
      };
    default:
      return {
        bg: 'bg-gray-500/20',
        border: 'border-gray-400',
        text: 'text-gray-100'
      };
  }
};

const statusColumns: Record<
  string,
  { title: string; icon: JSX.Element; color: string }
> = {
  novo: {
    title: "Novo Pedido",
    icon: <Plus className="w-4 h-4 text-blue-500" />,
    color: "bg-blue-500/10 border border-blue-300",
  },
  producao: {
    title: "Em Produção",
    icon: <Clock className="w-4 h-4 text-yellow-500" />,
    color: "bg-yellow-500/10 border border-yellow-300",
  },
  finalizado: {
    title: "Finalizado",
    icon: <PackageCheck className="w-4 h-4 text-green-500" />,
    color: "bg-green-500/10 border border-green-300",
  },
  enviado: {
    title: "Enviado",
    icon: <Send className="w-4 h-4 text-purple-500" />,
    color: "bg-purple-500/10 border border-purple-300",
  },
};

export default function OrdensPage() {
  const [ordens, setOrdens] = useState<Order[]>([]);
  const [ordemMovida, setOrdemMovida] = useState<Order | null>(null);
  const [statusDestino, setStatusDestino] = useState<
    "novo" | "producao" | "finalizado" | "enviado" | null
  >(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:3000/orders").then((res) => {
      setOrdens(res.data);
    });
  }, []);

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const ordem = ordens.find((o) => o._id === draggableId);
    if (!ordem) return;

    setOrdemMovida(ordem);
    setStatusDestino(destination.droppableId);
    setShowDialog(true);
  };

  const handleConfirmacao = async (data: {
  mensagem: string
  arquivos?: File[]
  codigoRastreio?: string
}) => {
  if (!ordemMovida || !statusDestino) return

  const formData = new FormData()
  formData.append("mensagem", data.mensagem)
  formData.append("status", statusDestino)
  formData.append("email", ordemMovida.email || "")

  if (data.codigoRastreio) {
    formData.append("codigoRastreamento", data.codigoRastreio)
  }

  data.arquivos?.forEach((file) => {
    formData.append("arquivos", file)
  })

  try {
    await axios.post(
      `http://localhost:3000/orders/${ordemMovida._id}/enviar-email`,
      formData
    )

    await axios.patch(
      `http://localhost:3000/orders/${ordemMovida._id}`,
      { status: statusDestino }
    )

    setOrdens((prev) =>
      prev.map((o) =>
        o._id === ordemMovida._id
          ? { ...o, status: statusDestino }
          : o
      )
    )

    setShowDialog(false)
    setOrdemMovida(null)
    setStatusDestino(null)
  } catch (err: any) {
    console.error(err.response?.data || err)
    toast.error("Erro ao enviar dados")
  }
}

  return (
    <div className="p-4 ">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(statusColumns).map(
            ([statusKey, { title, icon, color }]) => {
              const ordensDaColuna = ordens.filter(
                (o) => o.status === statusKey
              );
              return (
                <Droppable droppableId={statusKey} key={statusKey}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`rounded-xl p-4 flex flex-col transition-colors ${color}`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          {icon}
                          <h2 className="text-base font-semibold text-white">{title}</h2>
                        </div>
                        <span className="text-xs bg-black/20 px-2 py-1 rounded text-white">
                          {ordensDaColuna.length} pedidos
                        </span>
                      </div>

                      <ScrollArea className="max-h-[calc(100vh-180px)] pr-2">
                        <div className="space-y-3">
                          {ordensDaColuna.map((ordem, index) => {
                            const statusColor = getStatusColor(ordem.status);
                            
                            return (
                              <Draggable
                                draggableId={ordem._id}
                                index={index}
                                key={ordem._id}
                              >
                                {(drag) => (
                                  <div
                                    ref={drag.innerRef}
                                    {...drag.draggableProps}
                                    {...drag.dragHandleProps}
                                  >
                                    <Card className={`shadow-lg border rounded-md hover:shadow-xl transition ${statusColor.bg} ${statusColor.border}`}>
                                      <CardContent className="p-4 space-y-3">
                                        <div className="text-sm">
                                          <span className={`block text-xs ${statusColor.text}`}>
                                            #{ordem._id.slice(-6)}
                                          </span>
                                          <span className="font-medium text-white truncate block">
                                            {ordem.cliente}
                                          </span>
                                        </div>

                                        <p className={`text-base font-semibold ${statusColor.text} line-clamp-2 min-h-[2.5rem]`}>
                                          {ordem.produto}
                                        </p>

                                        {ordem.imagem && (
                                          <img
                                            src={ordem.imagem}
                                            alt="Imagem"
                                            className="w-full h-32 object-contain rounded border border-white/10 bg-black/20"
                                          />
                                        )}

                                        <div className={`flex justify-between text-xs ${statusColor.text}`}>
                                          <span>
                                            {formatDate(
                                              ordem.previsaoEntrega?.split("T")[0]
                                            )}
                                          </span>
                                          <span>
                                            {formatCurrency(ordem.valorUnitario)}
                                          </span>
                                        </div>

                                        <VerDetalhesDialog ordem={ordem} />
                                      </CardContent>
                                    </Card>
                                  </div>
                                )}
                              </Draggable>
                            )
                          })}
                          {provided.placeholder}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </Droppable>
              );
            }
          )}
        </div>
      </DragDropContext>

      {showDialog && ordemMovida && statusDestino && (
        <ConfirmarEnvioDialog
          ordemId={ordemMovida._id}
          cliente={ordemMovida.cliente}
          produto={ordemMovida.produto}
          emailCliente={ordemMovida.email}
          statusDestino={statusDestino}
          onConfirmado={handleConfirmacao}
          onCancelado={() => {
            setShowDialog(false);
            setOrdemMovida(null);
            setStatusDestino(null);
          }}
        />
      )}
    </div>
  );
}