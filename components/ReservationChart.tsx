"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ReservationChartProps {
  data: Array<{ name: string; reservations: number }>
}

export default function ReservationChart({ data }: ReservationChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="reservations" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  )
}

