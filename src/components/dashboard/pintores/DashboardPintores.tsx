"use client";

import { useEffect, useState } from "react";
import { useDateFilter } from "../DateFilter/DateFilterContext";

interface PintorCount {
  pintor: string;
  total: string;
}

export default function DashboardPintores() {
  const { dateRange } = useDateFilter();
  const [pintores, setPintores] = useState<PintorCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCount() {
      try {
        const params = new URLSearchParams();
        if (dateRange.startDate) {
          params.append("startDate", dateRange.startDate.toISOString());
        }
        if (dateRange.endDate) {
          params.append("endDate", dateRange.endDate.toISOString());
        }

        const res = await fetch(`http://localhost:3000/orders/count-all-pintores?${params.toString()}`,{
 method: 'GET',
 credentials: 'include',
        });
        if (!res.ok) throw new Error("Erro ao buscar contador");
        const data: PintorCount[] = await res.json();
        setPintores(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchCount();
  }, [dateRange])

  // Calcular estatísticas
  const totalPintores = pintores.length;
  
  // Converter totais para números e somar
  const totalObras = pintores.reduce((acc, curr) => {
    const total = parseInt(curr.total) || 0;
    return acc + total;
  }, 0);
  
  // Encontrar o artista top
  let artistaTop = "Nenhum";
  if (pintores.length > 0) {
    let maxTotal = 0;
    pintores.forEach(p => {
      const total = parseInt(p.total) || 0;
      if (total > maxTotal) {
        maxTotal = total;
        artistaTop = p.pintor;
      }
    });
  }
  
  // Encontrar o máximo de obras para o gráfico
  let maxTotal = 0;
  pintores.forEach(p => {
    const total = parseInt(p.total) || 0;
    if (total > maxTotal) {
      maxTotal = total;
    }
  });

  // Cores para os cards
  const cardColors = [
    "bg-gradient-to-r from-purple-500 to-indigo-600",
    "bg-gradient-to-r from-pink-500 to-rose-500",
    "bg-gradient-to-r from-amber-500 to-orange-500",
    "bg-gradient-to-r from-emerald-500 to-teal-600",
    "bg-gradient-to-r from-cyan-500 to-blue-500",
    "bg-gradient-to-r from-violet-500 to-fuchsia-500",
  ];

  return (
    <div>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-2">
            Painel de Pintores
          </h1>
          <p className="text-purple-400 max-w-2xl mx-auto">
            Visualize quantas obras de arte cada artista criou para nossa coleção de toy art
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#11172D] rounded-2xl shadow-lg p-6  transition-all hover:shadow-xl">
            <div className="text-purple-400 text-sm font-medium mb-2">Total de Pintores</div>
            <div className="text-3xl font-bold text-gray-100">{totalPintores}</div>
          </div>
          
          <div className="bg-[#11172D] rounded-2xl shadow-lg p-6  transition-all hover:shadow-xl">
            <div className="text-purple-400 text-sm font-medium mb-2">Total de Pedidos</div>
            <div className="text-3xl font-bold text-gray-100">{totalObras}</div>
          </div>
          
          <div className="bg-[#11172D] rounded-2xl shadow-lg p-6  transition-all hover:shadow-xl">
            <div className="text-purple-400 text-sm font-medium mb-2">Artista Top</div>
            <div className="text-3xl font-bold text-gray-100 truncate" title={artistaTop}>
              {artistaTop}
            </div>
          </div>
        </div>

        {/* Cards de Pintores */}
        {loading ? (
          <div className="flex justify-center  py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : pintores.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <p className="text-gray-600">Nenhum pintor encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pintores.map((p, index) => {
              const total = parseInt(p.total) || 0;
              return (
                <div
                  key={index}
                  className={`${cardColors[index % cardColors.length]} rounded-2xl shadow-xl overflow-hidden text-white transition-transform hover:scale-105`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold">{p.pintor || "Não definido"}</h3>
                        <p className="text-sm opacity-80 mt-1">Artista de Toy Art</p>
                      </div>
                      <div className="bg-white bg-opacity-20 rounded-full p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-between items-end">
                      <div>
                        <p className="text-2xl opacity-80">Pintados</p>

                      </div> 
                      
                      <div className="relative">
                        <div className="bg-white bg-opacity-30 rounded-full p-3">
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                            <span className="text-lg font-bold text-gray-800">{total}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-black bg-opacity-10 p-4 text-center">
                    <div className="text-xs opacity-80">Última atualização: Hoje</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      
      </div>
    </div>
  );
}