// components/dashboard/feedback/dashboard-feedback.tsx
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronDown, Filter, Download } from "lucide-react";
import FeedbackTable from "./feedback-table";
import FeedbackDetail from "./feedback-detail";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/avaliacao");
        const feedbacks = await response.json();
        
        setData(feedbacks);
        setPagination(prev => ({
          ...prev,
          totalItems: feedbacks.length
        }));
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar feedbacks:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewDetails = (feedback: any) => {
    setSelectedFeedback(feedback);
    setIsDetailOpen(true);
  };

  if (loading) {
    return (
      <div className="text-white p-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-purple-400">Carregando feedbacks...</div>
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
        data={data} 
        filter={filter} 
        onViewDetails={handleViewDetails}
      />
      
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-purple-300">
          Mostrando {startItem} a {endItem} de {pagination.totalItems} feedbacks
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