"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, MapPinIcon, StarIcon } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

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
  },
  {
    id: 2,
    nom: "Aventure tropicale en Thaïlande",
    ville_depart: "Marseille",
    ville_arrive: "Bangkok",
    date_depart: "2025-04-10",
    date_arrive_prevu: "2025-04-25",
    prix: 2500,
    places_disponibles: 8,
    image: "/images/thailande.jpg",
    agence_nom: "Globe-Trotter",
    etoiles: 4,
    likes: 95,
  },
]

export default function ClientAccueil() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">Destinations de Rêve</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {voyages.map((voyage) => (
          <Card
            key={voyage.id}
            className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300 relative"
          >
            <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full px-2 py-1 text-sm font-semibold text-blue-600 dark:text-blue-400 shadow">
              {voyage.likes} ❤️
            </div>
            <CardHeader className="p-0">
              <Image
                src={voyage.image}
                alt={voyage.ville_arrive}
                width={400}
                height={200}
                className="w-full h-48 object-cover"
              />
            </CardHeader>
            <CardContent className="flex-grow p-4">
              <CardTitle className="text-xl mb-2 text-blue-600 dark:text-blue-400">{voyage.ville_arrive}</CardTitle>
              <p className="text-gray-600 dark:text-gray-300 mb-2">{voyage.nom}</p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                <MapPinIcon className="w-4 h-4 mr-1" />
                <span>Départ de {voyage.ville_depart}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                <CalendarIcon className="w-4 h-4 mr-1" />
                <span>{format(new Date(voyage.date_depart), "d MMMM yyyy", { locale: fr })}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">{voyage.agence_nom}</span>
                <div className="flex items-center">
                  <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="font-medium">{voyage.etoiles}/5</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800">
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(voyage.prix)}
              </span>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href={`/client/voyage/${voyage.id}`}>Voir les détails</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  )
}
