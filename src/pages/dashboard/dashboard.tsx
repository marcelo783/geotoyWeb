// src/app/dashboard/page.tsx
import { 
  Calendar, 
  DollarSign, 
  Users, 
  CreditCard, 
  Activity 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { Overview } from "@/components/dashboard/overview";

export default function DashboardPage() {
  // Dados fictícios para o dashboard
  const metrics = [
    { title: "Total Revenue", value: "R$45.231,89", desc: "+20.1% em relação ao mês passado", icon: DollarSign },
    { title: "Assinaturas", value: "+2350", desc: "+180.1% em relação ao mês passado", icon: Users },
    { title: "Vendas", value: "+12.234", desc: "+19% em relação ao mês passado", icon: CreditCard },
    { title: "Ativos Agora", value: "+573", desc: "+201 desde a última hora", icon: Activity }
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">Download</Button>
        </div>
      </div>

      {/* Cards de métricas */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-[#11172D] border border-purple-600/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-300">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{metric.value}</div>
              <p className="text-xs text-purple-300">{metric.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráfico e Tabela */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        {/* Gráfico */}
        <Card className="lg:col-span-4 bg-[#11172D] border border-purple-600/30">
          <CardHeader>
            <CardTitle className="text-white">Visão Geral</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        
        {/* Tabela de vendas recentes */}
        <Card className="lg:col-span-3 bg-[#11172D] border border-purple-600/30">
          <CardHeader>
            <CardTitle className="text-white">Vendas Recentes</CardTitle>
            <p className="text-sm text-purple-300">Você fez 265 vendas este mês.</p>
          </CardHeader>
          <CardContent>
            <RecentSales />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}