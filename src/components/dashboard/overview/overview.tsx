// src/components/dashboard/overview.tsx
"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', total: 4000 },
  { name: 'Fev', total: 3000 },
  { name: 'Mar', total: 2000 },
  { name: 'Abr', total: 2780 },
  { name: 'Mai', total: 1890 },
  { name: 'Jun', total: 2390 },
  { name: 'Jul', total: 3490 },
  { name: 'Ago', total: 4000 },
  { name: 'Set', total: 3000 },
  { name: 'Out', total: 2000 },
  { name: 'Nov', total: 2780 },
  { name: 'Dez', total: 1890 },
];

export function Overview() {
  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#6D28D9" opacity={0.3} />
          <XAxis 
            dataKey="name" 
            stroke="#C084FC" 
            fontSize={12}
          />
          <YAxis 
            stroke="#C084FC" 
            fontSize={12}
            tickFormatter={(value) => `R$${value}`}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: '#0F172A',
              borderColor: '#7C3AED',
              color: 'white'
            }}
            formatter={(value) => [`R$${value}`, 'Total']}
          />
          <Bar 
            dataKey="total" 
            fill="#8B5CF6" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}