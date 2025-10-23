import { useState, type JSX } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";
import { VerDetalhesDialog } from "@/components/VerDetalhesDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency, formatDate } from "@/utils/format";
import { ConfirmarEnvioDialog } from "@/components/ConfirmarEnvioDialog";
import { Plus, Clock, PackageCheck, Send, MessageCircle } from "lucide-react"; // 🆕 import do ícone de feedback
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

type Order = {
  id: string;
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
  status: "novo" | "producao" | "finalizado" | "enviado" | "feedback"; // 🆕 adiciona feedback
  urgente: boolean;
};

// Função para obter as classes de cor baseadas no status
const getStatusColor = (status: Order["status"]) => {
  switch (status) {
    case "novo":
      return {
        bg: "bg-blue-500/20",
        border: "border-blue-400",
        text: "text-blue-100",
      };
    case "producao":
      return {
        bg: "bg-yellow-500/20",
        border: "border-yellow-400",
        text: "text-yellow-100",
      };
    case "finalizado":
      return {
        bg: "bg-green-500/20",
        border: "border-green-400",
        text: "text-green-100",
      };
    case "enviado":
      return {
        bg: "bg-purple-500/20",
        border: "border-purple-400",
        text: "text-purple-100",
      };
    case "feedback": // 🆕 cor exclusiva para feedback
      return {
        bg: "bg-pink-500/20",
        border: "border-pink-400",
        text: "text-pink-100",
      };
    default:
      return {
        bg: "bg-gray-500/20",
        border: "border-gray-400",
        text: "text-gray-100",
      };
  }
};

// Função para calcular dias restantes
const calcularDiasRestantes = (
  dataPrevisao: string | undefined
): number | null => {
  if (!dataPrevisao) return null;

  const hoje = new Date();
  const dataEntrega = new Date(dataPrevisao);
  const diffTime = dataEntrega.getTime() - hoje.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

const getDisplayInfo = (ordem: Order) => {
  // Se o status for "enviado" ou "feedback", não mostra o contador de dias restantes
  if (ordem.status === "enviado" || ordem.status === "feedback") {
    return { showCounter: false, message: "Entregue", color: "text-green-400" };
  }
  const diasRestantes = calcularDiasRestantes(ordem.previsaoEntrega);
  if (diasRestantes === null) {
    return { showCounter: false, message: null, color: null };
  }
  if (diasRestantes > 0) {
    return {
      showCounter: true,
      message: `${diasRestantes} dias restantes`,
      color: ordem.urgente
        ? "text-red-400"
        : diasRestantes <= 3
        ? "text-red-400"
        : diasRestantes <= 7
        ? "text-yellow-400"
        : "text-green-400",
    };
  } else {
    return {
      showCounter: true,
      message: "ENTREGA ATRASADA!",
      color: "text-red-400",
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
  feedback: {
    // 🆕 nova coluna feedback
    title: "Feedback",
    icon: <MessageCircle className="w-4 h-4 text-pink-500" />,
    color: "bg-pink-500/10 border border-pink-300",
  },
};

const fetchOrdens = async (): Promise<Order[]> => {
  const res = await axios.get<Order[]>("http://localhost:3000/orders", {
    withCredentials: true,
  });
  return res.data;
};

export default function OrdensPage() {
  const [ordemMovida, setOrdemMovida] = useState<Order | null>(null);
  const [statusDestino, setStatusDestino] = useState<Order["status"] | null>(
    null
  );
  const [showDialog, setShowDialog] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: ordens = [],
    isLoading,
    isError,
    isFetching, // 🔥 mostra se está atualizando os dados em background
  } = useQuery({
    queryKey: ["ordens"],
    queryFn: fetchOrdens,
    staleTime: 1000 * 60 * 2, // 2 minutos de cache fresco
    placeholderData: (prev) => prev, // mantém os dados antigos na tela
  });

  // 👉 Tela inicial com Skeleton (somente no 1º carregamento)
  if (isLoading && ordens.length === 0) {
    return (
      <div className="grid grid-cols-4 gap-4 p-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-500">Erro ao carregar ordens</p>;
  }

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const ordem = ordens.find((o: Order) => o.id === draggableId);
    if (!ordem) return;

    setOrdemMovida(ordem);
    setStatusDestino(destination.droppableId as Order["status"]);
    setShowDialog(true);
  };

  const handleConfirmacao = async (data: {
    mensagem: string;
    arquivos?: File[];
    codigoRastreio?: string;
  }) => {
    if (!ordemMovida || !statusDestino) return;

    const formData = new FormData();
    formData.append("mensagem", data.mensagem);
    formData.append("status", statusDestino);
    formData.append("email", ordemMovida.email || "");

    if (data.codigoRastreio) {
      formData.append("codigoRastreamento", data.codigoRastreio);
    }

    data.arquivos?.forEach((file) => {
      formData.append("arquivos", file);
    });

    try {
      await axios.post(
        `http://localhost:3000/orders/${ordemMovida.id}/enviar-email`,
        formData,
        { withCredentials: true }
      );

      if (statusDestino === "enviado") {
        await axios.patch(
          `http://localhost:3000/orders/${ordemMovida.id}/enviar`,
          { codigoRastreamento: data.codigoRastreio },
          { withCredentials: true }
        );
      } else {
        await axios.patch(
          `http://localhost:3000/orders/${ordemMovida.id}`,
          { status: statusDestino },
          { withCredentials: true }
        );
      }

      // 🔥 Atualiza o cache do React Query (ordens em memória)
      queryClient.setQueryData<Order[]>(["ordens"], (old = []) =>
        old.map((o) =>
          o.id === ordemMovida.id ? { ...o, status: statusDestino } : o
        )
      );

      toast.success(
        `Pedido #${ordemMovida.id.slice(
          -6
        )} movido para "${statusDestino}" com sucesso!`,
        { icon: "🚀", duration: 5000 }
      );

      setShowDialog(false);
      setOrdemMovida(null);
      setStatusDestino(null);
    } catch (err: any) {
      console.error(err.response?.data || err);
      toast.error("Erro ao enviar dados");
    }
  };

  return (
    <div className="p-4  overflow-x-auto">
      {isFetching && (
        <div className="h-1 w-full bg-gradient-to-r from-red-500 to-red-700 animate-pulse" />
      )}{" "}
      {/* 🆕 adiciona scroll horizontal */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 min-w-[1200px]">
          {" "}
          {/* 🆕 flex horizontal em vez de grid */}
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
                      className={`rounded-xl p-4 flex flex-col transition-colors w-72 ${color}`} // 🆕 largura fixa
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          {icon}
                          <h2 className="text-base font-semibold text-white">
                            {title}
                          </h2>
                        </div>
                        <span className="text-xs bg-black/20 px-2 py-1 rounded text-white">
                          {ordensDaColuna.length} pedidos
                        </span>
                      </div>

                      <ScrollArea className="max-h-[calc(100vh-180px)] pr-2">
                        <div className="space-y-3">
                          {ordensDaColuna.map((ordem: Order, index: number) => {
                            const statusColor = getStatusColor(ordem.status);
                            const primeiraImagem = ordem.imagens?.[0];
                            const info = getDisplayInfo(ordem);

                            return (
                              <Draggable
                                draggableId={ordem.id}
                                index={index}
                                key={ordem.id}
                              >
                                {(drag) => (
                                  <div
                                    ref={drag.innerRef}
                                    {...drag.draggableProps}
                                    {...drag.dragHandleProps}
                                  >
                                    <Card
                                      className={`shadow-lg border rounded-md hover:shadow-xl transition ${statusColor.bg} ${statusColor.border}`}
                                    >
                                      <CardContent className="p-4 space-y-3">
                                        <div className="text-sm">
                                          {info.message && (
                                            <div className="flex items-center gap-1">
                                              <svg
                                                className="w-3 h-3 flex-shrink-0"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                              >
                                                <path
                                                  fillRule="evenodd"
                                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
                                                  clipRule="evenodd"
                                                />
                                              </svg>
                                              <span
                                                className={`text-xs font-semibold ${info.color}`}
                                              >
                                                {info.message}
                                              </span>
                                            </div>
                                          )}

                                          <span className="font-medium text-white truncate block">
                                            {ordem.cliente}
                                          </span>
                                        </div>

                                        <p
                                          className={`text-base font-semibold ${statusColor.text} line-clamp-2 min-h-[2.5rem]`}
                                        >
                                          {ordem.produto}
                                        </p>

                                        {primeiraImagem && (
                                          <img
                                            src={primeiraImagem}
                                            alt="Imagem"
                                            className="w-full h-32 object-cover rounded border border-white/10 bg-black/20"
                                          />
                                        )}

                                        <div
                                          className={`flex justify-between text-xs ${statusColor.text}`}
                                        >
                                          <span>
                                            {formatDate(
                                              ordem.previsaoEntrega?.split(
                                                "T"
                                              )[0]
                                            )}
                                          </span>
                                          <span>
                                            {formatCurrency(
                                              ordem.valorUnitario
                                            )}
                                          </span>
                                        </div>

                                        <VerDetalhesDialog ordem={ordem} />
                                      </CardContent>
                                    </Card>
                                  </div>
                                )}
                              </Draggable>
                            );
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
          ordemId={ordemMovida.id}
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
