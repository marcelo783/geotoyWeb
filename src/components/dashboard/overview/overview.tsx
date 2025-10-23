// src/components/dashboard/overview.tsx
"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';



export function Overview() {
  const [data, setData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/orders/overview?year=${year}`, {
          credentials: "include",
          
        });
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Erro ao carregar overview:", err);
      }
    };

    fetchData();
  }, [year]);

  return (
    <div className="h-[350px]">
      {/* Filtro de ano */}
      <div className="mb-2">
        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="bg-[#1C2237] text-white border border-purple-600 rounded px-2 py-1"
        >
          {[2023, 2024, 2025].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#6D28D9" opacity={0.3} />
          <XAxis dataKey="name" stroke="#C084FC" fontSize={12} />
          <YAxis stroke="#C084FC" fontSize={12} tickFormatter={(v) => `R$${v}`} />
          <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#7C3AED', color: 'white' }} />
          <Bar dataKey="total" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
