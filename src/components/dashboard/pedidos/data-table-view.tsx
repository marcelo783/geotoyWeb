// components/dashboard/orders/data-table-view.tsx
"use client";

import { useState, useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "./columns";


interface OrderTableProps {
  data: any[];
  filter: string;
  onViewDetails: (order: any) => void;
}

export default function OrderTable({ data, filter, onViewDetails }: OrderTableProps) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Filtrar dados com tratamento seguro
  const filteredData = useMemo(() => {
    if (!filter) return data;
    
    const lowerFilter = filter.toLowerCase();
    
    return data.filter(order => {
      // Função segura para converter e comparar
      const safeCompare = (value: any) => 
        String(value || "").toLowerCase().includes(lowerFilter);
      
      return (
        safeCompare(order.cliente) ||
        safeCompare(order.produto) ||
        safeCompare(order.status) ||
        safeCompare(order.pintor) ||
        safeCompare(order.id) ||
        safeCompare(order.tipoFrete)
      );
    });
  }, [data, filter]);

  const columns = getColumns(onViewDetails);

  return (
    <DataTable 
      columns={columns} 
      data={filteredData} 
      pagination={pagination}
      onPaginationChange={setPagination}
    />
  );
}