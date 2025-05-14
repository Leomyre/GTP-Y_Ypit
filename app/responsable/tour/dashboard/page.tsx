"use client"

import { useEffect, useState } from "react"
import { fetchDashboardStats, fetchRevenusParDestination } from "@/services/service-dashboard"
import type React from "react"
import { ChartBar } from "@/components/chart-bar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Plane, CreditCard, TrendingUp } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { Stats, RevenusData } from "@/types/Dashboard"

export default function Dashboard() {
  const { token } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [revenusData, setRevenusData] = useState<RevenusData[]>([]);


  useEffect(() => {
    if (token) {
      fetchDashboardStats(token).then(setStats)
      fetchDashboardStats(token).then(setStats)
      fetchRevenusParDestination(token).then(setRevenusData)
    }
  }, [token])

  if (!token) {
    router.push("/responsable/auth/login")
    return;
  }


  if (!stats) {
    return <div>Chargement...</div>
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
        Tableau de bord - Agence de Voyage en Ligne
      </h1>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Réservations totales"
          value={stats.total_reservations.toString()}
          icon={<Plane />}
          trend=""
        />
        <StatCard
          title="Nouveaux clients"
          value={stats.new_clients}
          icon={<Users />}
          trend=""
        />
        <StatCard
          title="Chiffre d'affaires"
          value={stats.total_revenue}
          icon={<CreditCard />}
          trend=""
        />
        <StatCard
          title="Taux de conversion"
          value={stats.conversion_rate}
          icon={<TrendingUp />}
          trend=""
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-1">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Chiffre d&aposaffaires par destination</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartBar data={revenusData} />
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

