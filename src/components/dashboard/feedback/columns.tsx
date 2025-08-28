// components/dashboard/feedback/columns.tsx
import { ArrowUpDown, MoreHorizontal, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";

export type Feedback = {
  id: string;
  order: {
    id: string;
    produto: string;
    cliente: string;
    email?: string;
    telefone?: string;
  };
  atendimento: number;
  tempoEntrega: number;
  qualidadeMaterial: number;
  comentario: string;
  createdAt: string;
};

// Função para converter nota em texto e estrelas
const renderAvaliacao = (nota: number) => {
  const textos = ["Ruim", "Regular", "Bom", "Muito Bom", "Ótimo"];
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < nota ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
            }`}
          />
        ))}
      </div>
      <span className="text-sm">{textos[nota - 1] || "N/A"}</span>
    </div>
  );
};

export const getColumns = (onViewDetails: (feedback: any) => void): ColumnDef<Feedback>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todos"
        className="border-white"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
        className="border-white"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "order.cliente",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-white"
        >
          Cliente
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const cliente = row.original.order.cliente;
      return <div className="font-medium">{cliente}</div>;
    },
  },
  {
    accessorKey: "order.produto",
    header: "Produto",
    cell: ({ row }) => {
      const produto = row.original.order.produto;
      return <div>{produto}</div>;
    },
  },
  {
    accessorKey: "atendimento",
    header: "Atendimento",
    cell: ({ row }) => {
      const nota = row.getValue("atendimento") as number;
      return renderAvaliacao(nota);
    },
  },
  {
    accessorKey: "tempoEntrega",
    header: "Tempo Entrega",
    cell: ({ row }) => {
      const nota = row.getValue("tempoEntrega") as number;
      return renderAvaliacao(nota);
    },
  },
  {
    accessorKey: "qualidadeMaterial",
    header: "Qualidade Material",
    cell: ({ row }) => {
      const nota = row.getValue("qualidadeMaterial") as number;
      return renderAvaliacao(nota);
    },
  },
  {
    accessorKey: "comentario",
    header: "Comentário",
    cell: ({ row }) => {
      const comentario = row.getValue("comentario") as string;
      return (
        <div className="max-w-xs truncate" title={comentario}>
          {comentario}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Data",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <div>{date.toLocaleDateString("pt-BR")}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const feedback = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1C2237] text-white border border-purple-600/30">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
           
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onViewDetails(feedback)}>
              <Eye className="mr-2 h-4 w-4" />
              Ver detalhes
            </DropdownMenuItem>
           
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];