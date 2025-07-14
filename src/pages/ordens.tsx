import { useEffect, useState } from "react"
import axios from "axios"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Card, CardContent } from "@/components/ui/card"

import { VerDetalhesDialog } from "@/components/VerDetalhesDialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatCurrency, formatDate } from "@/utils/format"
import { ConfirmarEnvioDialog } from "@/components/ConfirmarEnvioDialog"

type Order = {
  _id: string
  cliente: string
  produto: string
  email?: string
  endereco?: string
  observacao?: string[]
  telefone?: string
  valorUnitario?: number
  valorTotal?: number
  frete?: number
  imagem?: string
  previsaoEntrega?: string
  status: "novo" | "producao" | "finalizado" | "enviado"
}

const statusColumns = {
  novo: "Novo Pedido",
  producao: "Em Produção",
  finalizado: "Finalizado",
  enviado: "Enviado",
}

export default function OrdensPage() {
  const [ordens, setOrdens] = useState<Order[]>([])
  const [ordemMovida, setOrdemMovida] = useState<Order | null>(null)
  const [statusDestino, setStatusDestino] = useState<"novo" | "producao" | "finalizado" | "enviado" | null>(null)
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    axios.get("http://localhost:3000/orders").then((res) => {
      setOrdens(res.data)
    })
  }, [])

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result
    if (!destination || destination.droppableId === source.droppableId) return

    const ordem = ordens.find((o) => o._id === draggableId)
    if (!ordem) return

    setOrdemMovida(ordem)
    setStatusDestino(destination.droppableId)
    setShowDialog(true)
  }

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

    if (data.arquivos) {
      data.arquivos.forEach((file) => {
        formData.append("anexos", file)
      })
    }

    await axios.post(`http://localhost:3000/orders/${ordemMovida._id}/enviar-email`, formData)

    await axios.patch(`http://localhost:3000/orders/${ordemMovida._id}`, {
      status: statusDestino,
    })

    setOrdens((prev) =>
      prev.map((o) =>
        o._id === ordemMovida._id ? { ...o, status: statusDestino } : o
      )
    )

    setShowDialog(false)
    setOrdemMovida(null)
    setStatusDestino(null)
  }

  return (
    <div className="p-4">

      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(statusColumns).map(([statusKey, statusLabel]) => (
            <Droppable droppableId={statusKey} key={statusKey}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-muted p-3 rounded-lg flex flex-col"
                >
                  <h2 className="text-lg font-semibold mb-2">{statusLabel}</h2>
                  <ScrollArea className="h-[950px] pr-2">
                    <div className="space-y-3">
                      {ordens
                        .filter((o) => o.status === statusKey)
                        .map((ordem, index) => (
                          <Draggable draggableId={ordem._id} index={index} key={ordem._id}>
                            {(drag) => (
                              <Card
                                ref={drag.innerRef}
                                {...drag.draggableProps}
                                {...drag.dragHandleProps}
                                className="mb-3"
                              >
                                <CardContent className="p-3 space-y-3">
                                  <p className="font-bold text-base">{ordem.produto}</p>
                                  {ordem.imagem && (
                                    <img
                                      src={ordem.imagem}
                                      alt="Imagem"
                                      className="w-full h-40 object-contain border rounded"
                                    />
                                  )}
                                  <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Entrega: {formatDate(ordem.previsaoEntrega?.split("T")[0])}</span>
                                    <span>{formatCurrency(ordem.valorUnitario)}</span>
                                  </div>
                                  <VerDetalhesDialog ordem={ordem} />
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

     {showDialog && ordemMovida && statusDestino && (
  <ConfirmarEnvioDialog
    ordemId={ordemMovida._id}
    cliente={ordemMovida.cliente}
    produto={ordemMovida.produto}
    emailCliente={ordemMovida.email}
    statusDestino={statusDestino}
    onConfirmado={async () => {
      // Reenvia os dados para o backend após confirmar
      await axios.patch(`http://localhost:3000/orders/${ordemMovida._id}`, {
        status: statusDestino,
      });

      setOrdens((prev) =>
        prev.map((o) =>
          o._id === ordemMovida._id ? { ...o, status: statusDestino } : o
        )
      );

      setShowDialog(false);
      setOrdemMovida(null);
      setStatusDestino(null);
    }}
  />
)}

    </div>
  )
}
