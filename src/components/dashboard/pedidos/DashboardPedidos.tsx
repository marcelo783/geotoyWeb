"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronDown, Package, Clock, CheckCircle, Truck, AlertCircle } from "lucide-react";
import OrderTable from "./data-table-view";
import OrderDetail from "./order-detail";
import { useDateFilter } from "../DateFilter/DateFilterContext";

export default function DashboardPedidos() {
  const [filter, setFilter] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalItems: 0,
  });
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [statusCounts, setStatusCounts] = useState({
    novo: 0,
    producao: 0,
    finalizado: 0,
    enviado: 0
  });

    const { dateRange } = useDateFilter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        
        // Construir parâmetros de query baseados no filtro de data
        const params: any = {};
        if (dateRange.startDate) {
          params.startDate = dateRange.startDate.toISOString();
        }
        if (dateRange.endDate) {
          // Ajustar para fim do dia
          const endOfDay = new Date(dateRange.endDate);
          endOfDay.setHours(23, 59, 59, 999);
          params.endDate = endOfDay.toISOString();
        }
        
        const response = await fetch(`http://localhost:3000/orders?${new URLSearchParams(params)}`, {
          credentials: 'include' // Inclui cookies para autenticação
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Não autorizado. Faça login novamente.");
          }
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
        const orders = await response.json();
        
        // Verifica se a resposta é um array
        if (!Array.isArray(orders)) {
          throw new Error("Resposta da API não é um array de pedidos");
        }
        
        setData(orders);
        setPagination(prev => ({
          ...prev,
          totalItems: orders.length
        }));
        
        // Calcular contagem por status
     type StatusType = "novo" | "producao" | "finalizado" | "enviado";
      const counts: Record<StatusType, number> = {
        novo: 0,
        producao: 0,
        finalizado: 0,
        enviado: 0,
      };

      orders.forEach((order: any) => {
        const status = (order.status?.toLowerCase() ?? "novo") as StatusType;
        if (status in counts) {
          counts[status] += 1;
        }
      });
        
        setStatusCounts(counts);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        setError(error instanceof Error ? error.message : "Erro desconhecido");
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  if (loading) {
    return (
      <div className="text-white p-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-purple-400">Carregando pedidos...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-white p-4">
        <div className="flex flex-col items-center justify-center h-64 bg-[#1C2237] rounded-lg border border-red-600/30 p-6">
          <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-xl font-bold text-red-400 mb-2">Erro ao carregar pedidos</h3>
          <p className="text-purple-300 text-center">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-purple-600 hover:bg-purple-700"
          >
            Tentar Novamente
          </Button>
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
        
       
      </div>

      {/* Cards de Status */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {/* Novo Pedido */}
        <Card className="bg-[#11172D] border border-purple-600/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">
              Novo Pedido
            </CardTitle>
            <Package className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{statusCounts.novo}</div>
            <p className="text-xs text-purple-300">Pedidos recebidos</p>
          </CardContent>
        </Card>

        {/* Em Produção */}
        <Card className="bg-[#11172D] border border-purple-600/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">
              Em Produção
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{statusCounts.producao}</div>
            <p className="text-xs text-purple-300">Pedidos em produção</p>
          </CardContent>
        </Card>

        {/* Finalizado */}
        <Card className="bg-[#11172D] border border-purple-600/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">
              Finalizado
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{statusCounts.finalizado}</div>
            <p className="text-xs text-purple-300">Pedidos finalizados</p>
          </CardContent>
        </Card>

        {/* Enviado */}
        <Card className="bg-[#11172D] border border-purple-600/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">
              Enviado
            </CardTitle>
            <Truck className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{statusCounts.enviado}</div>
            <p className="text-xs text-purple-300">Pedidos enviados</p>
          </CardContent>
        </Card>
      </div>

       <div className="flex  justify-end gap-4">
          <Input
            placeholder="Filtrar pedidos..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm bg-[#1C2237] text-white flex  border  border-purple-600/30"
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
          
         
        </div>
      
      <OrderTable data={data} filter={filter} onViewDetails={handleViewDetails} />
      
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

      {/* Dialog de Detalhes */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="bg-[#1C2237] text-white border border-purple-600/30 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold p-4">Detalhes do Pedido</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <OrderDetail 
              order={selectedOrder} 
              onClose={() => setIsDetailOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}