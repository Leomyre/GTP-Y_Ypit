"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, MapPinIcon, StarIcon } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { Voyage } from "@/types/voyages"
import { VoyageService } from "@/services/service-voyages"


interface VoyageCardProps {
  voyage: Voyage
}

export function VoyageCard({ voyage }: VoyageCardProps) {
  const router = useRouter()
  const { isLoggedIn, user, token } = useAuth()

  // Fonction API pour enregistrer la consultation côté serveur
  const enregistrerVoyageConsulte = async (voyageId: number) => {
    if (isLoggedIn && token) {
      try {
        await VoyageService.enregistrerConsultation(voyageId, token)
      } catch (error) {
        console.error("Erreur lors de l'enregistrement du voyage consulté :", error)
      }
    }
  }


  const handleReservation = async () => {
    if (isLoggedIn) {
      await enregistrerVoyageConsulte(voyage.id)
    }

    const basePath = user?.is_responsable
      ? "/responsable/tour/voyages"
      : "/client/voyage"

    router.push(`${basePath}/${voyage.id}`)
  }

  return (
    <Card className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
      <CardHeader className="p-0">
        <Image
          src={voyage.images || "http://localhost:8000/voyages/b2df7fb10f2f2321750985e7977a04b8a5dc7c26r1-1280-720v2_hq_52GV00G.jpg"}
          alt={voyage.titre || "Image de voyage"}
          width={400}
          height={200}
          className="w-full h-40 sm:h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="flex-grow p-3 sm:p-4">
        <CardTitle className="text-lg sm:text-xl mb-2 text-teal-600 dark:text-teal-400">
          {voyage.destination_nom || "Destination inconnue"}
        </CardTitle>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-2">{voyage.titre}</p>
        <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
          <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          <span>Départ de {voyage.ville_depart || "Ville inconnue"}</span>
        </div>
        <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2">
          <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          <span>Date au choix</span>
        </div>
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-gray-600 dark:text-gray-300">{voyage.agence_nom}</span>
          <div className="flex items-center">
            <StarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 mr-1" />
            <span className="font-medium">{voyage.niveau_confort}/5</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-800">
        <span className="text-base sm:text-lg font-bold text-teal-600 dark:text-teal-400">
          {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(Number(voyage.prix))}
        </span>
        <Button
          className="bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm"
          onClick={handleReservation}
        >
          Voir les détails
        </Button>
      </CardFooter>
    </Card>
  )
}
