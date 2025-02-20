import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, MapPinIcon, StarIcon } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

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
        <CardTitle className="text-lg sm:text-xl mb-2 text-blue-600 dark:text-blue-400">
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
        <span className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
          {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(voyage.prix)}
        </span>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm">
          <Link href={`/client/voyage/${voyage.id}`}>Voir les détails</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

