import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import ReservationChart from "@/components/ReservationChart"
import { AIInsights } from "@/components/AIInsights"

const reservations = [
  {
    id: 1,
    client: "Alice Dupont",
    destination: "Paris",
    dateDepart: "2024-07-15",
    dateFin: "2024-07-22",
    statut: "Confirmée",
    montant: "1200€",
  },
  {
    id: 2,
    client: "Bob Martin",
    destination: "Rome",
    dateDepart: "2024-08-01",
    dateFin: "2024-08-08",
    statut: "En attente",
    montant: "950€",
  },
  {
    id: 3,
    client: "Claire Leroy",
    destination: "Barcelone",
    dateDepart: "2024-06-20",
    dateFin: "2024-06-27",
    statut: "Payée",
    montant: "850€",
  },
  {
    id: 4,
    client: "David Moreau",
    destination: "Amsterdam",
    dateDepart: "2024-09-05",
    dateFin: "2024-09-12",
    statut: "Confirmée",
    montant: "1100€",
  },
  {
    id: 5,
    client: "Emma Petit",
    destination: "Prague",
    dateDepart: "2024-07-30",
    dateFin: "2024-08-06",
    statut: "Annulée",
    montant: "750€",
  },
]

const stats = [
  { title: "Réservations Totales", value: "152" },
  { title: "Réservations ce Mois", value: "28" },
  { title: "Taux d'Occupation", value: "76%" },
  { title: "Revenu Moyen par Réservation", value: "970€" },
]

const chartData = [
  { name: "Jan", reservations: 20 },
  { name: "Fév", reservations: 25 },
  { name: "Mar", reservations: 30 },
  { name: "Avr", reservations: 22 },
  { name: "Mai", reservations: 28 },
  { name: "Juin", reservations: 35 },
]

export default function ReservationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Réservations</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Réservations Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Date de Départ</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell>{reservation.client}</TableCell>
                    <TableCell>{reservation.destination}</TableCell>
                    <TableCell>{reservation.dateDepart}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          reservation.statut === "Confirmée"
                            ? "default"
                            : reservation.statut === "En attente"
                              ? "secondary"
                              : reservation.statut === "Payée"
                                ? "success"
                                : "destructive"
                        }
                      >
                        {reservation.statut}
                      </Badge>
                    </TableCell>
                    <TableCell>{reservation.montant}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Évolution des Réservations</CardTitle>
          </CardHeader>
          <CardContent>
            <ReservationChart data={chartData} />
          </CardContent>
        </Card>
      </div>

      <AIInsights data={{ reservations, stats, chartData }} page="reservations" />
    </div>
  )
}

