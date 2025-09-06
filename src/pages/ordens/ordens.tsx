import { useEffect, useState, type JSX } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";
import { VerDetalhesDialog } from "@/components/VerDetalhesDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency, formatDate } from "@/utils/format";
import { ConfirmarEnvioDialog } from "@/components/ConfirmarEnvioDialog";
import { Plus, Clock, PackageCheck, Send, MessageCircle } from "lucide-react"; // 🆕 import do ícone de feedback
import { toast } from "sonner";
import Cookies from "js-cookie";

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

export default function OrdensPage() {
  const [ordens, setOrdens] = useState<Order[]>([]);
  const [ordemMovida, setOrdemMovida] = useState<Order | null>(null);
  const [statusDestino, setStatusDestino] = useState<
    "novo" | "producao" | "finalizado" | "enviado" | "feedback" | null // 🆕 inclui feedback
  >(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/orders", { withCredentials: true })
      .then((res) => {
        setOrdens(res.data);
      });
  }, []);

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const ordem = ordens.find((o) => o.id === draggableId);
    if (!ordem) return;

    setOrdemMovida(ordem);
    setStatusDestino(destination.droppableId as Order["status"]); // 🆕 garante que pode ser feedback
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
      // 1) Sempre dispara e-mail
      await axios.post(
        `http://localhost:3000/orders/${ordemMovida.id}/enviar-email`,
        formData,
        { withCredentials: true }
      );

      // 2) Se for enviado → usa o PATCH especial
      if (statusDestino === "enviado") {
        await axios.patch(
          `http://localhost:3000/orders/${ordemMovida.id}/enviar`,
          { codigoRastreamento: data.codigoRastreio },
          { withCredentials: true }
        );
      } else {
        // Caso contrário → patch genérico
        await axios.patch(
          `http://localhost:3000/orders/${ordemMovida.id}`,
          { status: statusDestino },
          { withCredentials: true }
        );
      }

      // 3) Atualiza estado local
      setOrdens((prev) =>
        prev.map((o) =>
          o.id === ordemMovida.id ? { ...o, status: statusDestino } : o
        )
      );

      toast.success(
        `Pedido #${ordemMovida.id.slice(
          -6
        )} movido para "${statusDestino}" com sucesso!`,
        {
          icon: "🚀",
          duration: 5000,
        }
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
      {" "}
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
                          {ordensDaColuna.map((ordem, index) => {
                            const statusColor = getStatusColor(ordem.status);
                            const primeiraImagem = ordem.imagens?.[0];

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
                                          {/* {ordem.urgente &&
                                            ordem.status !== "enviado" &&
                                            ordem.status !== "feedback" && (
                                              <div className="flex items-center gap-1 mb-1 bg-red-500/30 border border-red-400/70 rounded-full px-3 py-1 w-fit animate-pulse">
                                                <svg
                                                  className="w-4 h-4 text-red-100 flex-shrink-0"
                                                  fill="currentColor"
                                                  viewBox="0 0 20 20"
                                                >
                                                  <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                                                    clipRule="evenodd"
                                                  />
                                                </svg>
                                                <span className="text-red-100 text-xs font-bold tracking-wide">
                                                  URGÊNCIA
                                                </span>
                                              </div>
                                            )} */}

                                          {/* Contador de dias - só mostra se não for enviado/feedback */}
                                          {ordem.previsaoEntrega &&
                                            ordem.status !== "enviado" &&
                                            ordem.status !== "feedback" && (
                                              <div
                                                className={`flex items-center gap-1 ${
                                                  ordem.urgente
                                                    ? "bg-red-500/20 px-2 py-1 rounded-lg border border-red-400/50"
                                                    : ""
                                                }`}
                                              >
                                                <svg
                                                  className={`w-3 h-3 flex-shrink-0 ${
                                                    ordem.urgente
                                                      ? "text-red-300"
                                                      : calcularDiasRestantes(
                                                          ordem.previsaoEntrega
                                                        ) <= 3
                                                      ? "text-red-400"
                                                      : calcularDiasRestantes(
                                                          ordem.previsaoEntrega
                                                        ) <= 7
                                                      ? "text-yellow-400"
                                                      : "text-green-400"
                                                  }`}
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
                                                  className={`text-xs font-semibold ${
                                                    ordem.urgente
                                                      ? "text-red-300"
                                                      : calcularDiasRestantes(
                                                          ordem.previsaoEntrega
                                                        ) <= 3
                                                      ? "text-red-400"
                                                      : calcularDiasRestantes(
                                                          ordem.previsaoEntrega
                                                        ) <= 7
                                                      ? "text-yellow-400"
                                                      : "text-green-400"
                                                  }`}
                                                >
                                                  {ordem.urgente
                                                    ? "URGÊNCIA - "
                                                    : ""}
                                                  {calcularDiasRestantes(
                                                    ordem.previsaoEntrega
                                                  ) > 0
                                                    ? `${calcularDiasRestantes(
                                                        ordem.previsaoEntrega
                                                      )} DIAS RESTANTE!`
                                                    : "ENTREGA ATRASADA!"}
                                                </span>
                                              </div>
                                            )}

                                          {/* Status de entregue para pedidos enviados ou com feedback */}
                                          {(ordem.status === "enviado" ||
                                            ordem.status === "feedback") && (
                                            <div className="flex items-center gap-1 text-green-400">
                                              <svg
                                                className="w-3 h-3 flex-shrink-0"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                              >
                                                <path
                                                  fillRule="evenodd"
                                                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                                  clipRule="evenodd"
                                                />
                                              </svg>
                                              <span className="text-xs font-semibold">
                                                ENTREGUE
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
