import type React from "react"
import { ChartArea } from "@/components/chart-area"
import { ChartBar } from "@/components/chart-bar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Plane, CreditCard, TrendingUp } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
        Tableau de bord - Agence de Voyage en Ligne
      </h1>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Réservations totales"
          value="1,234"
          icon={<Plane className="h-5 w-5 sm:h-6 sm:w-6" />}
          trend="+12%"
        />
        <StatCard title="Nouveaux clients" value="256" icon={<Users className="h-5 w-5 sm:h-6 sm:w-6" />} trend="+5%" />
        <StatCard
          title="Chiffre d'affaires"
          value="152,345 €"
          icon={<CreditCard className="h-5 w-5 sm:h-6 sm:w-6" />}
          trend="+8%"
        />
        <StatCard
          title="Taux de conversion"
          value="3.2%"
          icon={<TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />}
          trend="+0.5%"
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Réservations Mensuelles</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartArea />
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Chiffre d&aposaffaires par destination</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartBar />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  trend,
}: { title: string; value: string; icon: React.ReactNode; trend: string }) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-xl sm:text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{trend} par rapport au mois dernier</p>
      </CardContent>
    </Card>
  )
}

