'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface SalaryChartProps {
  data: { level: string; min: number; max: number; median: number }[];
}

export default function SalaryChart({ data }: SalaryChartProps) {
  // Transform data: create a stacked bar where "base" is the min value (invisible)
  // and "range" is the visible portion (max - min)
  const chartData = data.map((d) => ({
    level: d.level,
    base: d.min,
    range: d.max - d.min,
    medianOffset: d.median - d.min,
    min: d.min,
    max: d.max,
    median: d.median,
  }));

  const formatDollar = (value: number) => `$${Math.round(value / 1000)}k`;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <XAxis
          type="number"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#495670', fontSize: 11 }}
          tickFormatter={formatDollar}
        />
        <YAxis
          type="category"
          dataKey="level"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#e6f1ff', fontSize: 12, fontWeight: 500 }}
          width={85}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#0a0f1c',
            border: '1px solid rgba(100, 255, 218, 0.2)',
            borderRadius: '8px',
            color: '#e6f1ff',
            fontSize: 12,
          }}
          labelStyle={{ color: '#8892b0' }}
          formatter={(_value, _name, props) => {
            const { min, max, median } = props.payload as { min: number; max: number; median: number };
            return [
              `${formatDollar(min)} - ${formatDollar(max)} (Median: ${formatDollar(median)})`,
              'Salary Range',
            ];
          }}
          cursor={{ fill: 'rgba(100, 255, 218, 0.05)' }}
        />
        {/* Invisible base bar to offset the start */}
        <Bar dataKey="base" stackId="salary" fill="transparent" radius={0} />
        {/* Visible range bar */}
        <Bar dataKey="range" stackId="salary" radius={[0, 6, 6, 0]}>
          {chartData.map((entry, index) => (
            <Cell
              key={entry.level}
              fill="#27ae60"
              fillOpacity={0.5 + index * 0.2}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
