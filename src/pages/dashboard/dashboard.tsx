"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { Overview } from "@/components/dashboard/overview/overview";
import { RecentSales } from "@/components/dashboard/overview/recent-sales";

import { PackageSearch, Truck, ShoppingCart, Loader } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardPintores from "@/components/dashboard/pintores/DashboardPintores";
import DashboardPedidos from "@/components/dashboard/pedidos/DashboardPedidos";
import DashboardFeedback from "@/components/dashboard/feedback/DashboardFeedback";

export type SimpleOrder = {
  id: string;
  cliente: string;
  valorTotal: number;
  frete: number;
  tipoFrete?: string;
  status: string;
  createdAt: string;
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dias, setDias] = useState("7");
  const [orders, setOrders] = useState<SimpleOrder[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [freightTotals, setFreightTotals] = useState({ SEDEX: 0, PAC: 0 });
  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  useEffect(() => {
    axios
      .get("http://localhost:3000/orders", { withCredentials: true })
      .then((res) => {
        const fetchedOrders: SimpleOrder[] = res.data;
        setOrders(fetchedOrders);
        countStatuses(fetchedOrders);
        calculateFreight(fetchedOrders);
        calculateRevenue(fetchedOrders);
      })
      .catch((err) => console.error("Erro ao buscar ordens:", err));
  }, []);

  const countStatuses = (orders: SimpleOrder[]) => {
    const counts = { novo: 0, producao: 0, finalizado: 0, enviado: 0 };
    orders.forEach((order) => {
      const status = order.status?.toLowerCase() ?? "novo";
      if (counts.hasOwnProperty(status)) counts[status] += 1;
    });
    setStatusCounts(counts);
  };

  const calculateFreight = (orders: SimpleOrder[]) => {
    const freight = { SEDEX: 0, PAC: 0 };
    orders.forEach((order) => {
      const tipo = order.tipoFrete?.trim().toUpperCase();
      if (tipo === "SEDEX") freight.SEDEX += order.frete || 0;
      if (tipo === "PAC") freight.PAC += order.frete || 0;
    });
    setFreightTotals(freight);
  };

  const calculateRevenue = (orders: SimpleOrder[]) => {
    const total = orders.reduce((sum, order) => {
      const valorSemFrete = (order.valorTotal || 0) - (order.frete || 0);
      return sum + valorSemFrete;
    }, 0);
    setTotalRevenue(total);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">Download</Button>
        </div>
      </div>
      {/* Cabeçalho */}
      <div>
        
        {/* Menu de abas */}
        <div className="flex gap-4 mt-4 border-b border-purple-600/30 pb-2">
          {[
            { id: "overview", label: "Overview" },
            { id: "pintores", label: "Pintores" },
            { id: "pedidos", label: "Pedidos" },
            { id: "feedback", label: "Feedback" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 rounded-md text-sm ${
                activeTab === tab.id
                  ? "bg-primary text-white "
                  : "text-white   hover:bg-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo de cada aba */}
      {activeTab === "overview" && (
        <>
          {/* Cards de métricas */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total de Pedidos */}
            <Card className="bg-[#11172D] border border-purple-600/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-purple-300">
                  Total de Pedidos
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <PackageSearch className="h-4 w-4 text-purple-400 cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-[#1C2237] text-white text-xs border border-purple-600/30"
                  >
                    <DropdownMenuItem>
                      Novo Pedido: {statusCounts.novo || 0}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Em Produção: {statusCounts.producao || 0}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Finalizado: {statusCounts.finalizado || 0}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Enviado: {statusCounts.enviado || 0}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {orders.length}
                </div>
                <p className="text-xs text-purple-300">
                  Todos os pedidos cadastrados
                </p>
              </CardContent>
            </Card>

            {/* Frete */}
            <Card className="bg-[#11172D] border border-purple-600/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-purple-300">
                  Frete
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Truck className="h-4 w-4 text-purple-400 cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-[#1C2237] text-white text-xs border border-purple-600/30"
                  >
                    <DropdownMenuItem>
                      SEDEX: R$ {freightTotals.SEDEX?.toFixed(2)}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      PAC: R$ {freightTotals.PAC?.toFixed(2)}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  R${(freightTotals.SEDEX + freightTotals.PAC).toFixed(2)}
                </div>
                <p className="text-xs text-purple-300">Total em frete</p>
              </CardContent>
            </Card>

            {/* Vendas */}
            <Card className="bg-[#11172D] border border-purple-600/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-purple-300">
                  Vendas
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <ShoppingCart className="h-4 w-4 text-purple-400 cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-[#1C2237] text-white text-xs border border-purple-600/30"
                  >
                    <DropdownMenuItem>
                      Total de pedidos: {orders.length}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(totalRevenue)}
                </div>
                <p className="text-xs text-purple-300">
                  Total de vendas em reais
                </p>
              </CardContent>
            </Card>

            {/* Em produção */}
            <Card className="bg-[#11172D] border border-purple-600/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-purple-300">
                  Em produção
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Loader className="h-4 w-4 text-purple-400 animate-spin cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-[#1C2237] text-white text-xs border border-purple-600/30"
                  >
                    <DropdownMenuItem>
                      Pedidos em produção: {statusCounts.producao || 0}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {statusCounts.producao || 0}
                </div>
                <p className="text-xs text-purple-300">Pedidos em produção</p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico e Vendas Recentes */}
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
            <Card className="lg:col-span-4 bg-[#11172D] border border-purple-600/30">
              <CardHeader>
                <CardTitle className="text-white">Visão Geral</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>

            <Card className="lg:col-span-3 bg-[#11172D] border border-purple-600/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Vendas Recentes</CardTitle>
                  <Select
                    value={dias}
                    onValueChange={(value) => setDias(value)}
                  >
                    <SelectTrigger className="w-[100px] bg-[#1C2237] border border-purple-600 text-white text-sm h-8">
                      <SelectValue placeholder="Dias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 dias</SelectItem>
                      <SelectItem value="15">15 dias</SelectItem>
                      <SelectItem value="30">30 dias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-sm text-purple-300">
                  Vendas recentes durante {dias} dias.
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-64 px-6 py-4">
                  <RecentSales orders={orders} dias={parseInt(dias)} />
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {activeTab === "pintores" && <DashboardPintores />}
      {activeTab === "pedidos" && <DashboardPedidos />}
      {activeTab === "feedback" && <DashboardFeedback />}
    </div>
  );
}
