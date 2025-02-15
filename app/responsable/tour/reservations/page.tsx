"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Données statiques pour l'exemple
const reservations = [
  { id: 1, voyage: "Paris Romantique", client: "Alice Dupont", date: "2025-06-15", statut: "Confirmé", montant: 1200 },
  { id: 2, voyage: "Aventure à Bali", client: "Bob Martin", date: "2025-07-01", statut: "En attente", montant: 1800 },
  { id: 3, voyage: "New York City Break", client: "Claire Leroy", date: "2025-08-10", statut: "Payé", montant: 1500 },
  { id: 4, voyage: "Safari Kenyan", client: "David Moreau", date: "2025-09-05", statut: "Confirmé", montant: 2200 },
  { id: 5, voyage: "Tokyo Découverte", client: "Emma Petit", date: "2025-10-20", statut: "En attente", montant: 2000 },
]

const voyages = [
  "Tous",
  "Paris Romantique",
  "Aventure à Bali",
  "New York City Break",
  "Safari Kenyan",
  "Tokyo Découverte",
]

const graphData = [
  { name: "Paris Romantique", reservations: 15 },
  { name: "Aventure à Bali", reservations: 12 },
  { name: "New York City Break", reservations: 20 },
  { name: "Safari Kenyan", reservations: 8 },
  { name: "Tokyo Découverte", reservations: 18 },
]

export default function ReservationsPage() {
  const [selectedVoyage, setSelectedVoyage] = useState("Tous")

  const filteredReservations =
    selectedVoyage === "Tous" ? reservations : reservations.filter((res) => res.voyage === selectedVoyage)

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Réservations</h1>

      <Card>
        <CardHeader>
          <CardTitle>Réservations par Voyage</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="reservations" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Liste des Réservations</CardTitle>
          <Select value={selectedVoyage} onValueChange={setSelectedVoyage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner un voyage" />
            </SelectTrigger>
            <SelectContent>
              {voyages.map((voyage) => (
                <SelectItem key={voyage} value={voyage}>
                  {voyage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Voyage</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Montant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>{reservation.voyage}</TableCell>
                  <TableCell>{reservation.client}</TableCell>
                  <TableCell>{reservation.date}</TableCell>
                  <TableCell>{reservation.statut}</TableCell>
                  <TableCell>{reservation.montant} €</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

