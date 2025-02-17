"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, MapPinIcon, StarIcon, Users, Clock, DollarSign } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

// Données statiques pour l'exemple (à remplacer par un appel API réel)
const voyages = [
  {
    id: 1,
    nom: "Séjour de luxe à Paris",
    ville_depart: "Lyon",
    ville_arrive: "Paris",
    date_depart: "2025-03-15",
    date_arrive_prevu: "2025-03-20",
    prix: 1200,
    places_disponibles: 5,
    image: "/images/paris.jpg",
    agence_nom: "Voyages Extraordinaires",
    etoiles: 5,
    likes: 80,
    description:
      "Profitez d'un séjour inoubliable dans la ville de l'amour. Visitez la Tour Eiffel, le Louvre, et savourez la cuisine française dans les meilleurs restaurants de la capitale.",
    inclus: ["Hôtel 5 étoiles", "Petit-déjeuner", "Visite guidée", "Croisière sur la Seine"],
    programme: [
      { jour: 1, activite: "Arrivée et installation à l'hôtel" },
      { jour: 2, activite: "Visite de la Tour Eiffel et du Louvre" },
      { jour: 3, activite: "Exploration de Montmartre et du Sacré-Cœur" },
      { jour: 4, activite: "Croisière sur la Seine et shopping sur les Champs-Élysées" },
      { jour: 5, activite: "Visite du château de Versailles" },
      { jour: 6, activite: "Départ et retour" },
    ],
  },
  // ... autres voyages
]

export default function VoyageDetails() {
  const router = useRouter()
  const { id } = useParams()
  const [voyage, setVoyage] = useState<any>(null)

  useEffect(() => {
    // Simuler une requête API
    const fetchedVoyage = voyages.find((v) => v.id.toString() === id)
    setVoyage(fetchedVoyage)
  }, [id])

  if (!voyage) {
    return <div>Chargement...</div>
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => router.back()}>
        Retour
      </Button>

      <Card className="overflow-hidden">
        <Image
          src={voyage.image || "/placeholder.svg"}
          alt={voyage.nom}
          width={1200}
          height={400}
          className="w-full h-64 object-cover"
        />
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{voyage.nom}</CardTitle>
              <p className="text-muted-foreground">{voyage.agence_nom}</p>
            </div>
            <div className="flex items-center">
              <StarIcon className="text-yellow-400 mr-1" />
              <span>{voyage.etoiles}/5</span>
              <span className="ml-2">({voyage.likes} avis)</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <MapPinIcon className="mr-2" />
              <span>Départ de {voyage.ville_depart}</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="mr-2" />
              <span>{format(new Date(voyage.date_depart), "d MMMM yyyy", { locale: fr })}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2" />
              <span>{format(new Date(voyage.date_arrive_prevu), "d MMMM yyyy", { locale: fr })}</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-2" />
              <span>{voyage.places_disponibles} places disponibles</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="mr-2" />
              <span>{voyage.prix} €</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p>{voyage.description}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Ce qui est inclus</h3>
            <ul className="list-disc list-inside">
              {voyage.inclus.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Programme</h3>
            <ul className="space-y-2">
              {voyage.programme.map((jour: { jour: number; activite: string }) => (
                <li key={jour.jour} className="flex">
                  <span className="font-semibold mr-2">Jour {jour.jour}:</span>
                  <span>{jour.activite}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button className="w-full mt-4">Réserver maintenant</Button>
        </CardContent>
      </Card>
    </div>
  )
}

