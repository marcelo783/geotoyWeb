// contexts/DateFilterContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type DateFilterType = 'today' | 'yesterday' | '7d' | '15d' | 'month' | 'range' | 'specific';

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface DateFilterContextType {
  dateFilter: DateFilterType;
  dateRange: DateRange;
  setDateFilter: (filter: DateFilterType) => void;
  setDateRange: (range: DateRange) => void;
}

const DateFilterContext = createContext<DateFilterContextType | undefined>(undefined);

export const DateFilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dateFilter, setDateFilter] = useState<DateFilterType>('7d');
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });

  // Função para calcular o range de datas baseado no filtro selecionado
  const calculateDateRange = (filter: DateFilterType) => {
    const today = new Date();
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    switch (filter) {
      case 'today':
        startDate = new Date(today);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);
        break;
      
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        startDate = new Date(yesterday);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(yesterday);
        endDate.setHours(23, 59, 59, 999);
        break;
      
      case '7d':
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 7);
        endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);
        break;
      
      case '15d':
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 15);
        endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);
        break;
      
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      
      case 'range':
      case 'specific':
        // Mantém as datas existentes para range e specific
        break;
    }

    return { startDate, endDate };
  };

  // Atualizar o dateRange quando o dateFilter mudar
  useEffect(() => {
    if (dateFilter !== 'range' && dateFilter !== 'specific') {
      const newDateRange = calculateDateRange(dateFilter);
      setDateRange(newDateRange);
    }
  }, [dateFilter]);

  return (
    <DateFilterContext.Provider value={{ dateFilter, dateRange, setDateFilter, setDateRange }}>
      {children}
    </DateFilterContext.Provider>
  );
};

export const useDateFilter = () => {
  const context = useContext(DateFilterContext);
  if (context === undefined) {
    throw new Error('useDateFilter must be used within a DateFilterProvider');
  }
  return context;
};