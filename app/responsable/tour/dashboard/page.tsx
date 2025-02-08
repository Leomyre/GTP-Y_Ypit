import { ChartArea } from "@/components/chart-area"
import { ChartBar } from "@/components/chart-bar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Plane, CreditCard, TrendingUp } from "lucide-react"
import type React from "react"


export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Tableau de bord
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Réservations totales" value="1,234" icon={<Plane className="h-6 w-6" />} trend="+12%" />
        <StatCard title="Nouveaux clients" value="256" icon={<Users className="h-6 w-6" />} trend="+5%" />
        <StatCard title="Chiffre d'affaires" value="152,345 €" icon={<CreditCard className="h-6 w-6" />} trend="+8%" />
        <StatCard title="Taux de conversion" value="3.2%" icon={<TrendingUp className="h-6 w-6" />} trend="+0.5%" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <ChartArea />
        <ChartBar />
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{trend} par rapport au mois dernier</p>
      </CardContent>
    </Card>
  )
}

