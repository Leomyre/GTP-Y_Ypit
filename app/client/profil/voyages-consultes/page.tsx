"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Calendar, MapPin } from "lucide-react"
import { withAuth } from "@/components/withAuth"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useAuth } from "@/hooks/useAuth"
import { VoyageService } from "@/services/service-voyages"
import { Voyage } from "@/types/voyages"
import { Skeleton } from "@/components/ui/skeleton"

const VoyagesConsultes = () => {
  const router = useRouter()
  const { token } = useAuth()
  const [voyages, setVoyages] = useState<Voyage[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchConsultations = async () => {
      if (!token) return

      try {
        const data = await VoyageService.getConsultation(token)
        setVoyages(data.results)
      } catch (error) {
        console.error("Erreur lors du chargement des voyages consultés :", error)
        setError("Une erreur est survenue.")
      } finally {
        setLoading(false)
      }
    }

    fetchConsultations()
  }, [token])

  const handleVoyageClick = (id: number) => {
    router.push(`/client/voyage/${id}`)
  }

  const renderSkeletonRows = () => {
    return Array.from({ length: 4 }).map((_, index) => (
      <TableRow key={index}>
        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      </TableRow>
    ))
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
        <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">Voyages consultés</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique de vos voyages consultés</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8">
              <p className="text-red-500 dark:text-red-400">{error}</p>
              <Button className="mt-4" onClick={() => router.push("/client/accueil")}>
                Retour à l&aposaccueil
              </Button>
            </div>
          ) : loading ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Voyage</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Date de consultation</TableHead>
                  <TableHead>Prix</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{renderSkeletonRows()}</TableBody>
            </Table>
          ) : voyages.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Voyage</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Date de consultation</TableHead>
                  <TableHead>Prix</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {voyages.map((voyage) => (
                  <TableRow key={voyage.id}>
                    <TableCell>
                      <button
                        onClick={() => handleVoyageClick(voyage.id)}
                        className="text-green-600 hover:underline font-medium focus:outline-none"
                      >
                        {voyage.titre}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                        {voyage.destination_nom}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                        {format(new Date(voyage.date_consultation), "d MMM yyyy à HH:mm", { locale: fr })}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(Number(voyage.prix))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Vous n&apos;avez pas encore consulté de voyages.</p>
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

export default withAuth(VoyagesConsultes)
