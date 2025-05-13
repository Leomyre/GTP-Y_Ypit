"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Calendar, MapPin, CreditCard } from "lucide-react"
import { withAuth } from "@/components/withAuth"
import { format, parseISO, isValid } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { ReservationService } from "@/services/service-reservations"
import { Reservation } from "@/types/Reservation"
import { useAuth } from "@/hooks/useAuth"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toastx"

const HistoriqueReservations = () => {
  const router = useRouter()
  const { toast } = useToast()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  // Fonction pour formater les dates de manière sécurisée
  const safeFormatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString)
      return isValid(date) ? format(date, "d MMM yyyy", { locale: fr }) : "Date invalide"
    } catch (error) {
      console.error("Erreur de formatage de date:", error)
      return "Date invalide"
    }
  }

  useEffect(() => {
    const fetchReservations = async () => {
      if (!token) return

      try {
        setLoading(true)
        const data = await ReservationService.getReservations(token)
        setReservations(data.results || [])
        console.log(data.results);

      } catch (error) {
        console.error("Erreur lors du chargement des réservations:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les réservations",
          createdAt: Date.now(),
        })
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()
  }, [token, toast])

  const handleVoyageClick = (id: number) => {
    router.push(`/client/voyage/${id}`)
  }

  const getStatusBadge = (statut: string) => {
    const statusMap: Record<string, string> = {
      "Confirmée": "bg-green-500 hover:bg-green-600",
      "Payée": "bg-blue-500 hover:bg-blue-600",
      "En attente": "bg-yellow-500 hover:bg-yellow-600",
      "Annulée": "bg-red-500 hover:bg-red-600",
    }
    return <Badge className={statusMap[statut] || "bg-gray-500"}>{statut}</Badge>
  }

  if (loading) {
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
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
                  <TableHead className="w-[120px]">Référence</TableHead>
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
                    <TableCell className="font-mono text-xs">
                      {reservation.id || "N/A"}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleVoyageClick(reservation.voyage.id)}
                        className="text-green-600 hover:underline font-medium focus:outline-none"
                      >
                        {reservation.voyage.titre || "Nom inconnu"}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{reservation.voyage.destination_nom || "Destination inconnue"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{reservation.date_depart ? safeFormatDate(reservation.date_depart) : "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4 text-gray-500" />
                        <span>
                          {reservation.prix_total
                            ? new Intl.NumberFormat("fr-FR", {
                              style: "currency",
                              currency: "EUR",
                            }).format(reservation.prix_total)
                            : "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {reservation.statut ? (
                        getStatusBadge(reservation.statut)
                      ) : (
                        <Badge>Inconnu</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                Vous n&apos;avez pas encore effectué de réservation.
              </p>
              <Button
                className="mt-4"
                onClick={() => router.push("/client/accueil")}
              >
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