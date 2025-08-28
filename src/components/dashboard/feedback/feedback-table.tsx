// components/dashboard/feedback/feedback-table.tsx
"use client";

import { useState, useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "@/components/dashboard/feedback/columns";

interface FeedbackTableProps {
  data: any[];
  filter: string;
  onViewDetails: (feedback: any) => void;
}

export default function FeedbackTable({ data, filter, onViewDetails }: FeedbackTableProps) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Filtrar dados com tratamento seguro
  const filteredData = useMemo(() => {
    if (!filter) return data;
    
    const lowerFilter = filter.toLowerCase();
    
    return data.filter(feedback => {
      // Função segura para converter e comparar
      const safeCompare = (value: any) => 
        String(value || "").toLowerCase().includes(lowerFilter);
      
      return (
        safeCompare(feedback.order?.cliente) ||
        safeCompare(feedback.order?.produto) ||
        safeCompare(feedback.comentario) ||
        safeCompare(feedback.atendimento) ||
        safeCompare(feedback.tempoEntrega) ||
        safeCompare(feedback.qualidadeMaterial)
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