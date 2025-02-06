"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface DestinationChartProps {
  data: Array<{ name: string; popularity: number }>
}

export default function DestinationChart({ data }: DestinationChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="popularity" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}

