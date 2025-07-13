import { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VerDetalhesDialog } from "@/components/VerDetalhesDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency, formatDate, formatPhone } from '@/utils/format';

type Order = {
  _id: string;
  cliente: string;
  produto: string;
  email?: string;
  endereco?: string
  observacao?: string[];
  telefone?: string;
  valorUnitario?: number;
  valorTotal?: number;
  frete?: number;
  imagem?: string;
  previsaoEntrega?: string;
  status: "novo" | "producao" | "finalizado" | "enviado";
};

const statusColumns = {
  novo: "Novo Pedido",
  producao: "Em Produção",
  finalizado: "Finalizado",
  enviado: "Enviado",
};

export default function OrdensPage() {
  const [ordens, setOrdens] = useState<Order[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Buscar ordens existentes
  useEffect(() => {
    axios.get("http://localhost:3000/orders").then((res) => {
      setOrdens(res.data);
    });
  }, []);

  // Atualizar status ao arrastar
  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    setOrdens((prev) =>
      prev.map((ordem) =>
        ordem._id === draggableId
          ? { ...ordem, status: destination.droppableId }
          : ordem
      )
    );

    await axios.patch(`http://localhost:3000/orders/${draggableId}`, {
      status: destination.droppableId,
    });
  };

  // Lidar com seleção do arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Enviar PDF para o backend
  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    setUploading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/orders/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setOrdens((prev) => [...prev, res.data]);
      setSelectedFile(null);
    } catch (e) {
      console.error("Erro ao enviar:", e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4">
      {/* Área de upload */}
      <div className="bg-white p-4 rounded shadow mb-6 space-y-2">
        <h2 className="text-lg font-semibold">Enviar Ordem de Serviço (PDF)</h2>

        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="block text-sm"
        />
        {selectedFile && (
          <div className="text-sm text-muted-foreground space-y-2">
            <p>Arquivo selecionado: {selectedFile.name}</p>
            <div className="flex gap-9">
              <Button
                variant="destructive"
                onClick={() => setSelectedFile(null)}
                disabled={uploading}
              >
                Remover
              </Button>

              <Button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Enviando..." : "Enviar PDF"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Quadro Kanban */}
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
            {/* Título fixo */}
            <h2 className="text-lg font-semibold mb-2">{statusLabel}</h2>

            {/* Scroll apenas nos cards */}
            <ScrollArea className="h-[950px] pr-2">
              <div className="space-y-3">
                {ordens
                  .filter((o) => o.status === statusKey)
                  .map((ordem, index) => (
                    <Draggable
                      draggableId={ordem._id}
                      index={index}
                      key={ordem._id}
                    >
                      {(drag) => (
                        <Card
                          ref={drag.innerRef}
                          {...drag.draggableProps}
                          {...drag.dragHandleProps}
                          className="mb-3"
                        >
                          <CardContent className="p-3 space-y-3">
                            <p className="font-bold text-base">
                              {ordem.produto}
                            </p>

                            {ordem.imagem && (
                              <img
                                src={ordem.imagem}
                                alt="Imagem do produto"
                                className="w-full h-40 object-contain rounded border"
                              />
                            )}

                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>
                                Entrega:{" "}
                                {formatDate(ordem.previsaoEntrega?.split("T")[0])}
                              </span>
                              <span> {formatCurrency(ordem.valorUnitario)}</span>
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
    </div>
    </div>
  );
}
