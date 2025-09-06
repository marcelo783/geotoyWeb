// components/date-filter.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useDateFilter, type DateFilterType } from "@/components/dashboard/DateFilter/DateFilterContext";

export function DateFilter() {
  const { dateFilter, dateRange, setDateFilter, setDateRange } = useDateFilter();
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined);
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined);
  const [specificDate, setSpecificDate] = useState<Date | undefined>(undefined);

  const handleFilterChange = (value: DateFilterType) => {
    setDateFilter(value);
    
    const today = new Date();
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    switch (value) {
      case 'today':
        startDate = today;
        endDate = today;
        break;
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        startDate = yesterday;
        endDate = yesterday;
        break;
      case '7d':
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 7);
        endDate = today;
        break;
      case '15d':
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 15);
        endDate = today;
        break;
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'range':
        // Mantém as datas personalizadas se já existirem
        if (dateRange.startDate && dateRange.endDate) {
          startDate = dateRange.startDate;
          endDate = dateRange.endDate;
        }
        break;
      case 'specific':
        // Mantém a data específica se já existir
        if (dateRange.startDate) {
          startDate = dateRange.startDate;
          endDate = dateRange.startDate;
        }
        break;
    }

    setDateRange({ startDate, endDate });
  };

  const handleRangeApply = () => {
    if (customStartDate && customEndDate) {
      setDateRange({ startDate: customStartDate, endDate: customEndDate });
      setDateFilter('range');
    }
  };

  const handleSpecificApply = () => {
    if (specificDate) {
      setDateRange({ startDate: specificDate, endDate: specificDate });
      setDateFilter('specific');
    }
  };

  const getDisplayText = () => {
    switch (dateFilter) {
      case 'today':
        return 'Hoje';
      case 'yesterday':
        return 'Ontem';
      case '7d':
        return 'Últimos 7 dias';
      case '15d':
        return 'Últimos 15 dias';
      case 'month':
        return 'Este mês';
      case 'range':
        if (dateRange.startDate && dateRange.endDate) {
          return `${format(dateRange.startDate, 'dd/MM/yyyy')} - ${format(dateRange.endDate, 'dd/MM/yyyy')}`;
        }
        return 'Intervalo';
      case 'specific':
        if (dateRange.startDate) {
          return format(dateRange.startDate, 'dd/MM/yyyy');
        }
        return 'Data específica';
      default:
        return 'Selecionar período';
    }
  };

  return (
    <Select value={dateFilter} onValueChange={handleFilterChange}>
      <SelectTrigger className="w-[180px] bg-[#1C2237] text-white border border-purple-600/30">
        <SelectValue placeholder={getDisplayText()} />
        <ChevronDown className="ml-2 h-4 w-4" />
      </SelectTrigger>
      <SelectContent className="bg-[#1C2237] text-white border border-purple-600/30">
        <SelectItem value="today">Hoje</SelectItem>
        <SelectItem value="yesterday">Ontem</SelectItem>
        <SelectItem value="7d">Últimos 7 dias</SelectItem>
        <SelectItem value="15d">Últimos 15 dias</SelectItem>
        <SelectItem value="month">Este mês</SelectItem>
        
        <div className="relative">
          <SelectItem value="range" className="hidden" />
          <Popover>
            <PopoverTrigger asChild>
              <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-[#2A3249] focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-[#2A3249]">
                Intervalo
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4 bg-[#1C2237] text-white border border-purple-600/30">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">De</h4>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-[#11172D] text-white border border-purple-600/30"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customStartDate ? format(customStartDate, "PPP", { locale: ptBR }) : "Selecione a data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-[#1C2237] text-white border border-purple-600/30">
                      <Calendar
                        mode="single"
                        selected={customStartDate}
                        onSelect={setCustomStartDate}
                        initialFocus
                        className="bg-[#1C2237] text-white"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Até</h4>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-[#11172D] text-white border border-purple-600/30"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customEndDate ? format(customEndDate, "PPP", { locale: ptBR }) : "Selecione a data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-[#1C2237] text-white border border-purple-600/30">
                      <Calendar
                        mode="single"
                        selected={customEndDate}
                        onSelect={setCustomEndDate}
                        initialFocus
                        className="bg-[#1C2237] text-white"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button 
                  onClick={handleRangeApply}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={!customStartDate || !customEndDate}
                >
                  Aplicar
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="relative">
          <SelectItem value="specific" className="hidden" />
          <Popover>
            <PopoverTrigger asChild>
              <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-[#2A3249] focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-[#2A3249]">
                Data específica
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4 bg-[#1C2237] text-white border border-purple-600/30">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Selecione a data</h4>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-[#11172D] text-white border border-purple-600/30"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {specificDate ? format(specificDate, "PPP", { locale: ptBR }) : "Selecione a data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-[#1C2237] text-white border border-purple-600/30">
                      <Calendar
                        mode="single"
                        selected={specificDate}
                        onSelect={setSpecificDate}
                        initialFocus
                        className="bg-[#1C2237] text-white"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button 
                  onClick={handleSpecificApply}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={!specificDate}
                >
                  Aplicar
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </SelectContent>
    </Select>
  );
}