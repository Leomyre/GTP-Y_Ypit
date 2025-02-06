"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface FinancialChartProps {
  data: Array<{ name: string; revenue: number }>
}

export default function FinancialChart({ data }: FinancialChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="revenue" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}

