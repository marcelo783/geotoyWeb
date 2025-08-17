"use client";

import { useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import OrderTable from "./data-table-view";

export default function DashboardPedidos() {
  const [filter, setFilter] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalItems: 0,
  });

  useEffect(() => {
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
        setPagination(prev => ({
          ...prev,
          totalItems: orders.length
        }));
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
      <div className="text-white p-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-purple-400">Carregando pedidos...</div>
        </div>
      </div>
    );
  }

  // Calcular itens sendo exibidos
  const startItem = pagination.pageIndex * pagination.pageSize + 1;
  const endItem = Math.min(
    (pagination.pageIndex + 1) * pagination.pageSize,
    pagination.totalItems
  );

  return (
    <div className="text-white p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold">Gestão de Pedidos</h3>
          <p className="text-purple-300 mt-1">
            Visualize e gerencie todos os pedidos do sistema
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Input
            placeholder="Filtrar pedidos..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm bg-[#1C2237] text-white border border-purple-600/30"
          />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-[#1C2237] text-white border border-purple-600/30">
                Ações <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1C2237] text-white border border-purple-600/30">
              <DropdownMenuLabel>Exportar dados</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem>CSV</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Excel</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>PDF</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button className="bg-purple-600 hover:bg-purple-700">
            Novo Pedido
          </Button>
        </div>
      </div>
      
      <OrderTable data={data} />
      
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-purple-300">
          Mostrando {startItem} a {endItem} de {pagination.totalItems} pedidos
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="bg-[#1C2237] text-white border border-purple-600/30"
            disabled={pagination.pageIndex === 0}
            onClick={() => setPagination(prev => ({
              ...prev,
              pageIndex: prev.pageIndex - 1
            }))}
          >
            Anterior
          </Button>
          <Button 
            variant="outline" 
            className="bg-[#1C2237] text-white border border-purple-600/30"
            disabled={endItem >= pagination.totalItems}
            onClick={() => setPagination(prev => ({
              ...prev,
              pageIndex: prev.pageIndex + 1
            }))}
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
}