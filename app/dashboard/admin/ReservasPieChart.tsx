"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

// Datos de ejemplo si no se pasan
const defaultData = [{ name: 'Sin datos', value: 100 }];

// Colores para el gráfico
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface ChartData {
  name: string;
  value: number;
}

export function ReservasPieChart({ data }: { data: ChartData[] }) {
  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={(entry) => `${entry.name}: ${entry.value}`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
