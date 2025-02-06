"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { month: "Janvier", vols: 186, hotels: 80, packages: 120 },
  { month: "Février", vols: 305, hotels: 130, packages: 180 },
  { month: "Mars", vols: 237, hotels: 100, packages: 140 },
  { month: "Avril", vols: 173, hotels: 90, packages: 110 },
  { month: "Mai", vols: 209, hotels: 110, packages: 160 },
  { month: "Juin", vols: 314, hotels: 140, packages: 210 },
]

const chartConfig = {
  vols: {
    label: "Vols",
    color: "hsl(var(--chart-1))",
  },
  hotels: {
    label: "Hôtels",
    color: "hsl(var(--chart-2))",
  },
  packages: {
    label: "Forfaits",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function ChartArea() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Réservations Mensuelles</CardTitle>
        <CardDescription>Répartition des réservations par type</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area type="monotone" dataKey="vols" stackId="1" stroke="var(--color-vols)" fill="var(--color-vols)" />
            <Area
              type="monotone"
              dataKey="hotels"
              stackId="1"
              stroke="var(--color-hotels)"
              fill="var(--color-hotels)"
            />
            <Area
              type="monotone"
              dataKey="packages"
              stackId="1"
              stroke="var(--color-packages)"
              fill="var(--color-packages)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              En hausse de 15% ce mois-ci <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">Janvier - Juin 2024</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

