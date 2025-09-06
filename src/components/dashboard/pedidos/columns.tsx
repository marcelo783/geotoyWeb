// components/dashboard/orders/columns.tsx
import { ArrowUpDown, MoreHorizontal, Eye } from "lucide-react";
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

export type Order = {
  id: string;
  produto: string;
  cliente: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  valorUnitario: number;
  valorTotal: number;
  frete: number;
  tipoFrete?: string;
  status: string;
  previsaoEntrega?: Date;
  createdAt?: Date;
  pintor?: string;
  imagem?: string;
  imagens?: string[];
  observacao?: string[];
};

export const getColumns = (onViewDetails: (order: any) => void): ColumnDef<Order>[] => [
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
    accessorKey: "cliente",
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
    cell: ({ row }) => <div className="font-medium">{row.getValue("cliente")}</div>,
  },
  {
    accessorKey: "produto",
    header: "Produto",
    cell: ({ row }) => <div>{row.getValue("produto")}</div>,
  },
  {
    accessorKey: "valorTotal",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-white"
      >
        Valor Total
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("valorTotal"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      let bgColor = "bg-purple-900/30";
      
      if (status === "novo") bgColor = "bg-blue-500/30";
      else if (status === "producao") bgColor = "bg-yellow-500/30";
      else if (status === "finalizado") bgColor = "bg-green-500/30";
      else if (status === "enviado") bgColor = "bg-indigo-500/30";
      
      return (
        <div className={`capitalize px-3 py-1 rounded-full ${bgColor} inline-block`}>
          {status}
        </div>
      );
    },
  },
  {
  accessorKey: "createdAt",
  header: "Data do Pedido",
  cell: ({ row }) => {
    const date = row.getValue("createdAt") as Date | string | null | undefined;
    if (!date) return "N/A";

    // Formatar para DD/MM/YYYY HH:mm
    const formatted = new Date(date).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return <div>{formatted}</div>;
  },
},

  // {
  //   accessorKey: "previsaoEntrega",
  //   header: "Previsão Entrega",
  //   cell: ({ row }) => {
  //     const date = row.getValue("previsaoEntrega") as Date | null | undefined;
  //     return date ? new Date(date).toLocaleDateString("pt-BR") : "N/A";
  //   },
  // },
  // {
  //   accessorKey: "tipoFrete",
  //   header: "Tipo de Frete",
  //   cell: ({ row }) => {
  //     const tipo = row.getValue("tipoFrete") as string;
  //     return <div className="uppercase">{tipo || "N/A"}</div>;
  //   },
  // },
  {
    accessorKey: "frete",
    header: () => <div className="text-right">Valor Frete</div>,
    cell: ({ row }) => {
      const frete = parseFloat(row.getValue("frete"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(frete);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const order = row.original;

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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(order.id)}
            >
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onViewDetails(order)}>
              <Eye className="mr-2 h-4 w-4" />
              Ver detalhes
            </DropdownMenuItem>
            <DropdownMenuItem>Editar status</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];