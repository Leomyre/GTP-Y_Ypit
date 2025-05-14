"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"


const chartConfig = {
  ca: {
    label: "Chiffre d'affaires (€)",
    color: "hsl(var(--chart-1-light))",
  },
} satisfies ChartConfig

export function ChartBar({ data }: { data: { nom_destination: string; total: number }[] }) {
  const chartData = data?.map(item => ({
    destination: item.nom_destination,
    ca: item.total,
  }));


  return (
    <Card>
      <CardHeader>
        <CardTitle>Chiffre d&aposaffaires par destination</CardTitle>
        <CardDescription>Top 6 des destinations les plus populaires</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="destination" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="ca" fill="rgba(255, 165, 0, 0.7)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {chartData?.[0]?.destination} reste la destination la plus populaire <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">Données pour les 6 derniers mois</div>
      </CardFooter>
    </Card>
  )
}


