import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DestinationChart from "@/components/DestinationChart"
import { AIInsights } from "@/components/AIInsights"

const destinations = [
  { id: 1, name: "Paris", country: "France", popularity: 85, avgPrice: "250€" },
  { id: 2, name: "Rome", country: "Italie", popularity: 75, avgPrice: "200€" },
  { id: 3, name: "Barcelone", country: "Espagne", popularity: 70, avgPrice: "180€" },
  { id: 4, name: "Amsterdam", country: "Pays-Bas", popularity: 65, avgPrice: "220€" },
  { id: 5, name: "Prague", country: "République Tchèque", popularity: 60, avgPrice: "150€" },
]

const chartData = destinations.map((dest) => ({ name: dest.name, popularity: dest.popularity }))

export default function DestinationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Destinations</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Aperçu des Destinations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Pays</TableHead>
                  <TableHead>Popularité</TableHead>
                  <TableHead>Prix Moyen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {destinations.map((dest) => (
                  <TableRow key={dest.id}>
                    <TableCell>{dest.name}</TableCell>
                    <TableCell>{dest.country}</TableCell>
                    <TableCell>{dest.popularity}%</TableCell>
                    <TableCell>{dest.avgPrice}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popularité des Destinations</CardTitle>
          </CardHeader>
          <CardContent>
            <DestinationChart data={chartData} />
          </CardContent>
        </Card>
      </div>

      <AIInsights data={destinations} page="destinations" />
    </div>
  )
}

