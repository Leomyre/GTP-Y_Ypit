"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Calendar, MapPin, CreditCard } from "lucide-react"
import { withAuth } from "@/components/withAuth"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"

// Données statiques pour l'exemple (à remplacer par un appel API réel)
const reservationsHistorique = [
  {
    id: 1,
    voyage_id: 2,
    nom_voyage: "Aventure à Bali",
    destination: "Bali",
    date_reservation: "2024-05-15T09:20:00",
    date_depart: "2025-07-01",
    prix: 1800,
    statut: "Confirmée",
    reference: "RES-2024-001",
  },
  {
    id: 2,
    voyage_id: 4,
    nom_voyage: "Safari au Kenya",
    destination: "Kenya",
    date_reservation: "2024-04-20T14:30:00",
    date_depart: "2025-09-05",
    prix: 2200,
    statut: "Payée",
    reference: "RES-2024-002",
  },
  {
    id: 3,
    voyage_id: 6,
    nom_voyage: "Escapade à Tokyo",
    destination: "Tokyo",
    date_reservation: "2024-03-10T11:45:00",
    date_depart: "2025-09-15",
    prix: 2500,
    statut: "Annulée",
    reference: "RES-2024-003",
  },
]

const HistoriqueReservations = () => {
  const router = useRouter()
  const [reservations, setReservations] = useState(reservationsHistorique)

  // Simuler un chargement des données depuis l'API
  useEffect(() => {
    // Dans une implémentation réelle, vous feriez un appel API ici
    // pour récupérer l'historique des réservations de l'utilisateur
  }, [])

  const handleVoyageClick = (id: number) => {
    router.push(`/client/voyage/${id}`)
  }

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "Confirmée":
        return <Badge className="bg-green-500 hover:bg-green-600">{statut}</Badge>
      case "Payée":
        return <Badge className="bg-blue-500 hover:bg-blue-600">{statut}</Badge>
      case "En attente":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">{statut}</Badge>
      case "Annulée":
        return <Badge className="bg-red-500 hover:bg-red-600">{statut}</Badge>
      default:
        return <Badge>{statut}</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
        <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">Historique de réservation</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vos réservations de voyages</CardTitle>
        </CardHeader>
        <CardContent>
          {reservations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Référence</TableHead>
                  <TableHead>Voyage</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Date de départ</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-mono text-xs">{reservation.reference}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleVoyageClick(reservation.voyage_id)}
                        className="text-green-600 hover:underline font-medium focus:outline-none"
                      >
                        {reservation.nom_voyage}
                      </button>
                    </TableCell>
                    <TableCell className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                      {reservation.destination}
                    </TableCell>
                    <TableCell className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      {format(new Date(reservation.date_depart), "d MMM yyyy", { locale: fr })}
                    </TableCell>
                    <TableCell className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-1 text-gray-500" />
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(reservation.prix)}
                    </TableCell>
                    <TableCell>{getStatusBadge(reservation.statut)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Vous n'avez pas encore effectué de réservation.</p>
              <Button className="mt-4" onClick={() => router.push("/client/accueil")}>
                Découvrir des voyages
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default withAuth(HistoriqueReservations)

