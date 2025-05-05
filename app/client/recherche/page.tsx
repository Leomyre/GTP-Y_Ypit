"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { VoyageService } from "@/services/service-voyages" // Ajustez le chemin selon votre structure
import { Voyage } from "@/types/voyages"
import { VoyageCard } from "@/components/VoyageCard"


export default function RechercheVoyages() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("q")
  const [voyages, setVoyages] = useState<Voyage[]>([])
  const [resultats, setResultats] = useState(voyages)

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

  useEffect(() => {
    if (searchQuery) {
      const filteredVoyages = voyages.filter(
        (voyage) =>
          voyage.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
          voyage.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
          voyage.ville_depart.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setResultats(filteredVoyages)
    } else {
      setResultats(voyages)
    }
  }, [searchQuery])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">
        Résultats de recherche pour &quot{searchQuery}&quot
      </h1>
      {resultats.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resultats.map((voyage) => (
            <VoyageCard key={voyage.id} voyage={voyage} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400">
          Aucun voyage trouvé pour votre recherche. Essayez d&aposautres termes.
        </p>
      )}
    </div>
  )
}

