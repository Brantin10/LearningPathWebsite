'use client';

import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

interface SkillMatchChartProps {
  matchPercent: number;
}

export default function SkillMatchChart({ matchPercent }: SkillMatchChartProps) {
  const data = [
    { name: 'Matched', value: matchPercent },
    { name: 'Remaining', value: 100 - matchPercent },
  ];

  const COLORS = ['#27ae60', 'rgba(73, 86, 112, 0.3)'];

  return (
    <div style={{ position: 'relative', width: 180, height: 180 }}>
      <PieChart width={180} height={180}>
        <Pie
          data={data}
          cx={85}
          cy={85}
          innerRadius={55}
          outerRadius={80}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#27ae60',
            lineHeight: 1,
          }}
        >
          {matchPercent}%
        </span>
        <br />
        <span style={{ fontSize: 10, color: '#8892b0' }}>match</span>
      </div>
    </div>
  );
}
