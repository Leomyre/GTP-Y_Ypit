"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { VoyageService } from "@/services/service-voyages"
import { Voyage } from "@/types/voyages"
import { VoyageCard } from "@/components/VoyageCard"
import { VoyageSkeleton } from "@/components/skeletons/voyage-skeleton"
import VoyageFilters, { FiltresVoyage } from "@/components/VoyageFilters"

export default function RechercheVoyages() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("q")
  const [voyages, setVoyages] = useState<Voyage[]>([])
  const [resultats, setResultats] = useState<Voyage[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [filtres, setFiltres] = useState<FiltresVoyage>({
    ordre: "asc",
    prixMin: 0,
    prixMax: 10000,
    confort: "",
  })

  useEffect(() => {
    const fetchVoyages = async () => {
      try {
        const data = await VoyageService.getVoyages()
        setVoyages(data)
        setLoading(false)
      } catch (err) {
        setError("Erreur lors de la récupération des voyages")
        setLoading(false)
        console.error(err)
      }
    }

    fetchVoyages()
  }, [])

  useEffect(() => {
    let filtered = [...voyages]

    if (searchQuery) {
      const searchWords = searchQuery.toLowerCase().split(" ")
      filtered = filtered.filter((voyage) =>
        searchWords.some((word) =>
          voyage.titre.toLowerCase().includes(word) ||
          voyage.destination_nom.toLowerCase().includes(word) ||
          voyage.ville_depart.toLowerCase().includes(word)
        )
      )
    }

    // Appliquer les filtres
    filtered = filtered.filter((voyage) => {
      const prixNum = parseFloat(voyage.prix)
      return (
        prixNum >= filtres.prixMin &&
        prixNum <= filtres.prixMax &&
        (filtres.confort === "" || voyage.niveau_confort === Number(filtres.confort))
      )
    })

    // Tri
    filtered.sort((a, b) => {
      if (filtres.ordre === "asc") {
        return a.titre.localeCompare(b.titre)
      } else {
        return b.titre.localeCompare(a.titre)
      }
    })

    setResultats(filtered)
  }, [searchQuery, voyages, filtres])

  const handleFilterChange = (nouveauxFiltres: FiltresVoyage) => {
    setFiltres(nouveauxFiltres)
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
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">
          Erreur
        </h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erreur : </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Réessayer
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">
        {searchQuery ? `Résultats de recherche pour "${searchQuery}"` : "Tous nos voyages"}
      </h1>

      <VoyageFilters onFilterChange={handleFilterChange} />

      <div className="mb-4 text-gray-700 dark:text-gray-300">
        <p className="text-sm">
          <span className="font-medium">Tri :</span> {filtres.ordre === "asc" ? "A → Z" : "Z → A"} |
          <span className="font-medium ml-2">Prix :</span> {filtres.prixMin}€ - {filtres.prixMax}€ |
          <span className="font-medium ml-2">Confort :</span> {filtres.confort ? "★".repeat(Number(filtres.confort)) : "Tous"}
        </p>
      </div>

      {resultats.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resultats.map((voyage) => (
            <VoyageCard key={voyage.id} voyage={voyage} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400">
          Aucun voyage trouvé pour votre recherche. Essayez d&apos;autres termes ou ajustez les filtres.
        </p>
      )}
    </div>
  )
}