"use client";

import { useState, useEffect } from "react";
//import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/dashboard/columns";

export default function OrderTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulando busca de dados da API
    const fetchData = async () => {
      try {
        // Substituir por chamada real à sua API
        // const response = await fetch("http://localhost:3000/orders");
        // const orders = await response.json();
        
        // Dados de exemplo
        const orders = [
          {
            id: "728ed52f",
            produto: "Quadro personalizado",
            cliente: "João Silva",
            valorTotal: 249.90,
            frete: 25.90,
            tipoFrete: "SEDEX",
            status: "produção",
            previsaoEntrega: "2023-11-15"
          },
          {
            id: "489e1d42",
            produto: "Pintura em tela",
            cliente: "Maria Oliveira",
            valorTotal: 450.00,
            frete: 35.00,
            tipoFrete: "PAC",
            status: "novo",
            previsaoEntrega: "2023-11-20"
          },
          // Adicione mais pedidos conforme necessário
        ];
        
        setData(orders);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-purple-400">Carregando pedidos...</div>
      </div>
    );
  }

  return <DataTable columns={columns} data={data} />;
}