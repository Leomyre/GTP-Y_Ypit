"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarIcon, MapPinIcon } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

// Assurez-vous que ce chemin est correct
import { UrlConfig } from "@/utils/Config"

interface Voyage {
  id: number
  nom: string
  ville_depart: string
  ville_arrive: string
  date_depart: string
  date_arrive_prevu: string
  prix: number
  places_disponibles: number
  image: string
}

export default function ClientAccueil() {
  const [voyages, setVoyages] = useState<Voyage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch(`${UrlConfig.apiBaseUrl}/tour/voyages/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des voyages")
        }
        return response.json()
      })
      .then((data) => {
        setVoyages(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching voyages:", error)
        setError(error.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">Destinations de Rêve</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {voyages.map((voyage) => (
          <Card
            key={voyage.id}
            className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <CardHeader className="p-0">
              <Image
                src={voyage.image || "/placeholder.svg"}
                alt={voyage.ville_arrive}
                width={400}
                height={200}
                className="w-full h-48 object-cover"
              />
            </CardHeader>
            <CardContent className="flex-grow p-4">
              <CardTitle className="text-xl mb-2 text-blue-600 dark:text-blue-400">{voyage.nom}</CardTitle>
              {/* <p className="text-gray-600 dark:text-gray-300 mb-2">{voyage.ville_arrive}</p> */}
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                <MapPinIcon className="w-4 h-4 mr-1" />
                <span>Départ de {voyage.ville_depart}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <CalendarIcon className="w-4 h-4 mr-1" />
                <span>{format(new Date(voyage.date_depart), "d MMMM yyyy", { locale: fr })}</span>
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

function LoadingSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, index) => (
        <Card key={index} className="flex flex-col overflow-hidden">
          <CardHeader className="p-0">
            <Skeleton className="w-full h-48" />
          </CardHeader>
          <CardContent className="flex-grow p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-2/3 mb-1" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
          <CardFooter className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-10 w-1/3" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="text-center py-10">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
      <p className="text-gray-600 dark:text-gray-400">{message}</p>
      <p className="mt-4">Veuillez réessayer plus tard ou contacter le support si le problème persiste.</p>
    </div>
  )
}

