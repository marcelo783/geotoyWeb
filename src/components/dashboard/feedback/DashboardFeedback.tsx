// components/dashboard/feedback/dashboard-feedback.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronDown, Filter, Download } from "lucide-react";
import FeedbackTable from "./feedback-table";
import FeedbackDetail from "./feedback-detail";
import { useDateFilter } from "../DateFilter/DateFilterContext";
import axios from "axios";

export default function DashboardFeedback() {
  const [filter, setFilter] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalItems: 0,
  });
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const { dateRange } = useDateFilter();

  useEffect(() => {
    console.log("DateRange no DashboardFeedback:", dateRange);
  }, [dateRange]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
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
        
        console.log("Enviando parâmetros para a API:", params);
        
        // Buscar feedbacks
        const feedbackResponse = await axios.get("http://localhost:3000/avaliacao", {
          params,
          withCredentials: true
        });
        
        console.log("Resposta da API:", {
          quantidade: feedbackResponse.data.length,
          primeirosItens: feedbackResponse.data.slice(0, 3)
        });
        
        // Buscar métricas de feedback
        const metricsResponse = await axios.get("http://localhost:3000/avaliacao/metrics", {
          params,
          withCredentials: true
        });
        
        setData(feedbackResponse.data);
        setMetrics(metricsResponse.data);
        
        // Atualizar a paginação com o número total de itens
        setPagination(prev => ({
          ...prev,
          totalItems: feedbackResponse.data.length
        }));
        
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar feedbacks:", error);
        if (error.response) {
          console.error("Resposta do erro:", error.response.data);
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  // Filtrar dados localmente com base no filtro de texto
  const filteredData = useMemo(() => {
    if (!filter) return data;
    
    const lowerFilter = filter.toLowerCase();
    
    return data.filter(feedback => {
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

  // Calcular dados paginados
  const paginatedData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    return filteredData.slice(start, start + pagination.pageSize);
  }, [filteredData, pagination.pageIndex, pagination.pageSize]);

  if (loading) {
    return (
      <div className="text-white p-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-purple-400">Carregando feedbacks...</div>
        </div>
      </div>
    );
  }

  const handleViewDetails = (feedback: any) => {
    setSelectedFeedback(feedback);
    setIsDetailOpen(true);
  };

  // Calcular itens sendo exibidos
  const startItem = pagination.pageIndex * pagination.pageSize + 1;
  const endItem = Math.min(
    startItem + pagination.pageSize - 1,
    filteredData.length
  );

  return (
    <div className="text-white p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold">Painel de Feedback</h3>
          <p className="text-purple-300 mt-1">
            Visualize e gerencie todos os feedbacks recebidos
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Input
            placeholder="Filtrar feedbacks..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm bg-[#1C2237] text-white border border-purple-600/30"
          />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-[#1C2237] text-white border border-purple-600/30">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1C2237] text-white border border-purple-600/30">
              <DropdownMenuLabel>Filtrar por nota</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {[1, 2, 3, 4, 5].map(nota => (
                <DropdownMenuCheckboxItem
                  key={nota}
                  checked={statusFilter.includes(nota.toString())}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setStatusFilter([...statusFilter, nota.toString()]);
                    } else {
                      setStatusFilter(statusFilter.filter(item => item !== nota.toString()));
                    }
                  }}
                >
                  {["Ruim", "Regular", "Bom", "Muito Bom", "Ótimo"][nota - 1]}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>
      
      <FeedbackTable 
        data={paginatedData} 
        filter={filter} 
        onViewDetails={handleViewDetails}
      />
      
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-purple-300">
          Mostrando {startItem} a {endItem} de {filteredData.length} feedbacks
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
            disabled={endItem >= filteredData.length}
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
            <DialogTitle className="text-2xl font-bold p-4">Detalhes do Feedback</DialogTitle>
          </DialogHeader>
          
          {selectedFeedback && (
            <FeedbackDetail 
              feedback={selectedFeedback} 
              onClose={() => setIsDetailOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}