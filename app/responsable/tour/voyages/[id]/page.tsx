"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Trash, Plus } from "lucide-react"
import { VoyageSkeleton } from "@/components/skeletons/voyage-skeleton"

// Données statiques pour l'exemple
const voyages = [
  {
    id: "1",
    nom: "Paris Romantique",
    destination: "Paris",
    dateDepart: "2025-06-15",
    duree: 7,
    prix: 1200,
    placesDisponibles: 20,
    description: "Un séjour romantique dans la ville de l'amour.",
  },
  {
    id: "2",
    nom: "Aventure à Bali",
    destination: "Bali",
    dateDepart: "2025-07-01",
    duree: 10,
    prix: 1800,
    placesDisponibles: 15,
    description: "Découvrez la beauté exotique de Bali.",
  },
]

export default function DetailsVoyage() {
  const router = useRouter()
  const { id } = useParams()
  const [voyage, setVoyage] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simuler une requête API
    const fetchData = async () => {
      // Simuler un délai de chargement
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const fetchedVoyage = voyages.find((v) => v.id === id)
      setVoyage(fetchedVoyage)
      setLoading(false)
    }

    fetchData()
  }, [id])

  if (loading) {
    return <VoyageSkeleton />
  }

  if (!voyage) {
    return <div>Voyage non trouvé</div>
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour
      </Button>

      <h1 className="text-3xl font-bold">{voyage.nom}</h1>

      <Card>
        <CardHeader>
          <CardTitle>Détails du Voyage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            <strong>Destination:</strong> {voyage.destination}
          </p>
          <p>
            <strong>Date de départ:</strong> {new Date(voyage.dateDepart).toLocaleDateString()}
          </p>
          <p>
            <strong>Durée:</strong> {voyage.duree} jours
          </p>
          <p>
            <strong>Prix:</strong> {voyage.prix} €
          </p>
          <p>
            <strong>Places disponibles:</strong> {voyage.placesDisponibles}
          </p>
          <p>
            <strong>Description:</strong> {voyage.description}
          </p>
        </CardContent>
      </Card>

      <div className="flex space-x-4">
        <Button onClick={() => router.push(`/responsable/tour/voyages/${id}/modifier`)}>
          <Edit className="mr-2 h-4 w-4" /> Modifier
        </Button>
        <Button onClick={() => router.push(`/responsable/tour/trajets/ajouter?voyageId=${id}`)}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un trajet
        </Button>
        <Button variant="destructive">
          <Trash className="mr-2 h-4 w-4" /> Supprimer
        </Button>
      </div>
    </div>
  )
}

