"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, MapPinIcon, StarIcon } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useAuth } from "@/hooks/useAuth"

interface VoyageCardProps {
  voyage: {
    id: number
    nom: string
    ville_depart: string
    ville_arrive: string
    date_depart: string
    prix: number
    image: string
    agence_nom: string
    etoiles: number
    likes: number
  }
}

export function VoyageCard({ voyage }: VoyageCardProps) {
  const router = useRouter()
  const { isLoggedIn } = useAuth()

  // Fonction pour enregistrer le voyage consulté
  const enregistrerVoyageConsulte = (voyageId: number) => {
    if (isLoggedIn) {
      // Dans une implémentation réelle, vous feriez un appel API ici
      // pour enregistrer le voyage consulté par l'utilisateur
      console.log("Voyage consulté:", voyageId)

      // Pour l'exemple, on stocke dans le localStorage
      try {
        const voyagesConsultes = JSON.parse(localStorage.getItem("voyagesConsultes") || "[]")

        // Vérifier si le voyage est déjà dans la liste
        const existingIndex = voyagesConsultes.findIndex((v: any) => v.id === voyageId)

        if (existingIndex !== -1) {
          // Mettre à jour la date de consultation
          voyagesConsultes[existingIndex].date_consultation = new Date().toISOString()
        } else {
          // Ajouter le nouveau voyage consulté
          voyagesConsultes.push({
            id: voyageId,
            date_consultation: new Date().toISOString(),
          })
        }

        // Limiter à 10 voyages consultés les plus récents
        const voyagesRecents = voyagesConsultes
          .sort((a: any, b: any) => new Date(b.date_consultation).getTime() - new Date(a.date_consultation).getTime())
          .slice(0, 10)

        localStorage.setItem("voyagesConsultes", JSON.stringify(voyagesRecents))
      } catch (error) {
        console.error("Erreur lors de l'enregistrement du voyage consulté:", error)
      }
    }
  }

  // Modifier la fonction handleReservation pour rediriger vers la page de détails du voyage
  const handleReservation = () => {
    // Enregistrer le voyage consulté
    enregistrerVoyageConsulte(voyage.id)

    // Rediriger vers la page de détails du voyage
    router.push(`/client/voyage/${voyage.id}`)
  }

  return (
    <Card className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
      <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full px-2 py-1 text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 shadow">
        {voyage.likes} ❤️
      </div>
      <CardHeader className="p-0">
        <Image
          src={voyage.image || "/placeholder.svg"}
          alt={voyage.ville_arrive}
          width={400}
          height={200}
          className="w-full h-40 sm:h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="flex-grow p-3 sm:p-4">
        <CardTitle className="text-lg sm:text-xl mb-2 text-teal-600 dark:text-teal-400">
          {voyage.ville_arrive}
        </CardTitle>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-2">{voyage.nom}</p>
        <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
          <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          <span>Départ de {voyage.ville_depart}</span>
        </div>
        <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2">
          <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          <span>{format(new Date(voyage.date_depart), "d MMM yyyy", { locale: fr })}</span>
        </div>
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-gray-600 dark:text-gray-300">{voyage.agence_nom}</span>
          <div className="flex items-center">
            <StarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 mr-1" />
            <span className="font-medium">{voyage.etoiles}/5</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-800">
        <span className="text-base sm:text-lg font-bold text-teal-600 dark:text-teal-400">
          {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(voyage.prix)}
        </span>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm" onClick={handleReservation}>
          Voir les détails
        </Button>
      </CardFooter>
    </Card>
  )
}

