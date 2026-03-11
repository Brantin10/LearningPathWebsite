'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ActivityChartProps {
  data: { date: string; count: number }[];
}

export default function ActivityChart({ data }: ActivityChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#27ae60" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#27ae60" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#495670', fontSize: 11 }}
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
          itemStyle={{ color: '#27ae60' }}
          cursor={{ stroke: '#27ae60', strokeOpacity: 0.3 }}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#27ae60"
          strokeWidth={2}
          fill="url(#activityGradient)"
          name="Activities"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
