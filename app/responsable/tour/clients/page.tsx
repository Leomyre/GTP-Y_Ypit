import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import ClientChart from "@/components/ClientChart"
import { AIInsights } from "@/components/AIInsights"

const clients = [
  { id: 1, name: "Alice Dupont", email: "alice@example.com", reservations: 3, totalSpent: "750€" },
  { id: 2, name: "Bob Martin", email: "bob@example.com", reservations: 1, totalSpent: "300€" },
  { id: 3, name: "Claire Leroy", email: "claire@example.com", reservations: 2, totalSpent: "1200€" },
  { id: 4, name: "David Moreau", email: "david@example.com", reservations: 2, totalSpent: "500€" },
  { id: 5, name: "Emma Petit", email: "emma@example.com", reservations: 4, totalSpent: "900€" },
]

const chartData = [
  { name: "1 réservation", value: 1 },
  { name: "2 réservations", value: 2 },
  { name: "3 réservations", value: 1 },
  { name: "4 réservations", value: 1 },
  { name: "5 réservations", value: 0 },
]

export default function ClientsPage() {
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
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.reservations}</TableCell>
                    <TableCell>{client.totalSpent}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition des Réservations</CardTitle>
          </CardHeader>
          <CardContent>
            <ClientChart data={chartData} />
          </CardContent>
        </Card>
      </div>

      <AIInsights data={clients} page="clients" />
    </div>
  )
}

