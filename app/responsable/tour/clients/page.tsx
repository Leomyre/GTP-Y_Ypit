"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import ClientChart from "@/components/ClientChart"
import { ClientInsights } from "@/components/ClientInsights"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ReservationService } from "@/services/service-reservations"
import { useAuth } from "@/hooks/useAuth"
import { Client, ChartData } from "@/types/users"

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Récupération des clients
        if (!token) {
          throw new Error("Token is required");
        }
        const clientsResponse = await ReservationService.getClients(token);
        setClients(Array.isArray(clientsResponse) ? clientsResponse : [clientsResponse]);

        // Récupération des stats pour le graphique
        if (!token) {
          throw new Error("Token is required");
        }
        const distributionResponse = await ReservationService.getReservationsDistribution(token);
        const chartData = distributionResponse.map(item => ({
          username: item.username,
          value: item.count
        }));
        setChartData(chartData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Formatage des données clients pour l'analyse
  const clientsData = clients.map(client => ({
    id: client.id,
    username: client.username,
    email: client.email,
    reservations_count: client.reservations_count,
    total_spent: parseFloat(client.total_spent),
    last_reservation_date: client.last_reservation_date || "N/A"
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Clients</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Liste des Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Réservations</TableHead>
                  <TableHead>Total Dépensé</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    </TableRow>
                  ))
                ) : clients.length > 0 ? (
                  clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.username}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.reservations_count}</TableCell>
                      <TableCell>{client.total_spent} €</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      Aucun client trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition des Réservations</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[300px] w-full rounded-md" />
            ) : (
              <ClientChart data={chartData} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Section AI Insights */}
      {!loading && clients.length > 0 && (
        <ClientInsights clients={clientsData} />
      )}
    </div>
  )
}