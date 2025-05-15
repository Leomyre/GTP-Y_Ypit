"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { VoyageCard } from "@/components/VoyageCard"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { MapPin } from "lucide-react"
import { VoyageService } from "@/services/service-voyages"
import { VoyageSkeleton } from "@/components/skeletons/voyage-skeleton"
import { Voyage } from "@/types/voyages"

export default function ClientAccueil() {
  const router = useRouter()
  const [selectedVoyages, setSelectedVoyages] = useState<number[]>([])
  const [voyages, setVoyages] = useState<Voyage[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVoyages = async () => {
      try {
        const data = await VoyageService.getVoyages();
        setVoyages(data); // Utilise directement le tableau retourné
        setLoading(false);
      } catch (err) {
        setError("Erreur lors de la récupération des voyages");
        setLoading(false);
        console.error(err);
      }
    };

    fetchVoyages();
  }, []);

  const handleVoyageSelect = (id: number) => {
    if (selectedVoyages.includes(id)) {
      setSelectedVoyages(selectedVoyages.filter((voyageId) => voyageId !== id))
    } else {
      if (selectedVoyages.length < 3) {
        setSelectedVoyages([...selectedVoyages, id])
      }
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">
          Chargement des voyages...
        </h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <VoyageSkeleton key={index} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">{error}</div>
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-teal-600 dark:text-teal-400">Destinations de Rêve</h1>
        <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
          <Button
            variant="outline"
            onClick={() => router.push("/client/carte-destinations")}
            className="flex items-center"
          >
            <MapPin className="mr-2 h-4 w-4" />
            Carte des destinations
          </Button>
        </div>
      </div>

      {selectedVoyages.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md mb-4">
          <p className="text-sm">Sélectionnez jusqu&apos à 3 voyages à comparer, puis cliquez sur le bouton &quotComparer&quot.</p>
        </div>
      )}

      {Array.isArray(voyages) && voyages.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Aucun voyage disponible pour le moment.</p>
        </div>
      ) : Array.isArray(voyages) && voyages.length > 0 ? (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {voyages.map((voyage) => (
            <div key={voyage.id} className="relative">
              {selectedVoyages.length > 0 && (
                <div className="absolute top-2 left-2 z-10">
                  <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-1 rounded-md shadow-sm">
                    <Checkbox
                      id={`compare-${voyage.id}`}
                      checked={selectedVoyages.includes(voyage.id)}
                      onCheckedChange={() => handleVoyageSelect(voyage.id)}
                    />
                    <Label htmlFor={`compare-${voyage.id}`} className="text-xs">
                      Comparer
                    </Label>
                  </div>
                </div>
              )}
              <VoyageCard voyage={voyage} />
            </div>
          ))}
        </div>
      ) : (
        // Affichage d'un message d'erreur si voyages n'est pas un tableau
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">Erreur: Les données de voyages ne sont pas valides.</p>
        </div>
      )}

    </>
  )
}