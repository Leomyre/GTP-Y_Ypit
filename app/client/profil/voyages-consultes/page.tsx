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

// Données statiques pour l'exemple (à remplacer par un appel API réel)
const voyagesConsultes = [
  {
    id: 1,
    nom: "Séjour de luxe à Paris",
    destination: "Paris",
    date_consultation: "2024-06-10T14:30:00",
    prix: 1200,
  },
  {
    id: 3,
    nom: "Découverte de New York",
    destination: "New York",
    date_consultation: "2024-06-09T10:15:00",
    prix: 1500,
  },
  {
    id: 5,
    nom: "Croisière en Méditerranée",
    destination: "Méditerranée",
    date_consultation: "2024-06-08T16:45:00",
    prix: 1600,
  },
]

const VoyagesConsultes = () => {
  const router = useRouter()
  const [voyages, setVoyages] = useState(voyagesConsultes)

  // Simuler un chargement des données depuis l'API
  useEffect(() => {
    // Dans une implémentation réelle, vous feriez un appel API ici
    // pour récupérer les voyages consultés par l'utilisateur
  }, [])

  const handleVoyageClick = (id: number) => {
    router.push(`/client/voyage/${id}`)
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
          {voyages.length > 0 ? (
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
                        {voyage.nom}
                      </button>
                    </TableCell>
                    <TableCell className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                      {voyage.destination}
                    </TableCell>
                    <TableCell className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      {format(new Date(voyage.date_consultation), "d MMM yyyy à HH:mm", { locale: fr })}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(voyage.prix)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Vous n'avez pas encore consulté de voyages.</p>
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

