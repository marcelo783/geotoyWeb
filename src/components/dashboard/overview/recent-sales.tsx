// src/components/dashboard/recent-sales.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { parseISO, isValid } from "date-fns";

export type SimpleOrder = {
  id: string;
  cliente: string;
  email?: string;
  valorTotal?: number;
  valorUnitario?: number;
  frete?: number;
  status: string;
  createdAt?: string;
};

type RecentSalesProps = {
  orders: SimpleOrder[];
};

export function RecentSales({ orders }: RecentSalesProps) {
  // Ordenar por data de criação (mais recente primeiro)
  const recent = orders
    .map((order) => {
      const parsed = order.createdAt ? parseISO(order.createdAt) : null;
      return parsed && isValid(parsed) ? { ...order, date: parsed } : null;
    })
    .filter((o): o is SimpleOrder & { date: Date } => !!o)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5); // Mostrar apenas os 5 mais recentes

  return (
    <div className="space-y-6">
      {recent.map((sale, index) => (
        <div key={sale.id} className="flex items-center">
          <Avatar className="h-9 w-9 border border-purple-500">
            <AvatarImage src={`/avatars/0${(index % 9) + 1}.png`} />
            <AvatarFallback className="bg-purple-600 text-white">
              {sale.cliente
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium text-white">{sale.cliente}</p>
            {/* <p className="text-sm text-purple-300">
              {sale.email || "sem email"}
            </p> */}
          </div>
          <div className="ml-auto font-medium text-green-400">
            {sale.valorUnitario?.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </div>
        </div>
      ))}
      {recent.length === 0 && (
        <p className="text-sm text-center text-purple-300">
          Nenhuma venda no período selecionado.
        </p>
      )}
    </div>
  );
}