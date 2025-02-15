"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { destination: "Paris", ca: 186000 },
  { destination: "Londres", ca: 145000 },
  { destination: "Rome", ca: 137000 },
  { destination: "Barcelone", ca: 123000 },
  { destination: "Amsterdam", ca: 109000 },
  { destination: "Berlin", ca: 94000 },
]

const chartConfig = {
  ca: {
    label: "Chiffre d'affaires (€)",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function ChartBar() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chiffre d&apos;affaires par destination</CardTitle>
        <CardDescription>Top 6 des destinations les plus populaires</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="destination" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="ca" fill="var(--color-ca)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Paris reste la destination la plus populaire <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">Données pour les 6 derniers mois</div>
      </CardFooter>
    </Card>
  )
}

