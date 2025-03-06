"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { VoyageCard } from "@/components/VoyageCard"

// Données statiques pour l'exemple (à remplacer par un appel API réel)
const tousLesVoyages = [
  {
    id: 1,
    nom: "Séjour de luxe à Paris",
    ville_depart: "Lyon",
    ville_arrive: "Paris",
    date_depart: "2025-03-15",
    prix: 1200,
    image: "/images/paris.jpg",
    agence_nom: "Voyages Extraordinaires",
    etoiles: 5,
    likes: 80,
  },
  {
    id: 2,
    nom: "Aventure à Bali",
    ville_depart: "Paris",
    ville_arrive: "Bali",
    date_depart: "2025-04-01",
    prix: 1800,
    image: "/images/bali.jpg",
    agence_nom: "Évasion Tropicale",
    etoiles: 4,
    likes: 65,
  },
  {
    id: 3,
    nom: "Découverte de New York",
    ville_depart: "Marseille",
    ville_arrive: "New York",
    date_depart: "2025-05-20",
    prix: 1500,
    image: "/images/new-york.jpg",
    agence_nom: "City Explorer",
    etoiles: 4,
    likes: 72,
  },
  {
    id: 4,
    nom: "Safari au Kenya",
    ville_depart: "Paris",
    ville_arrive: "Nairobi",
    date_depart: "2025-06-10",
    prix: 2200,
    image: "/images/kenya.jpg",
    agence_nom: "Aventures Sauvages",
    etoiles: 5,
    likes: 88,
  },
  {
    id: 5,
    nom: "Croisière en Méditerranée",
    ville_depart: "Marseille",
    ville_arrive: "Athènes",
    date_depart: "2025-07-05",
    prix: 1600,
    image: "/images/mediterranean.jpg",
    agence_nom: "Croisières de Rêve",
    etoiles: 4,
    likes: 70,
  },
]

export default function RechercheVoyages() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("q")
  const [resultats, setResultats] = useState(tousLesVoyages)

  useEffect(() => {
    if (searchQuery) {
      const filteredVoyages = tousLesVoyages.filter(
        (voyage) =>
          voyage.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
          voyage.ville_arrive.toLowerCase().includes(searchQuery.toLowerCase()) ||
          voyage.ville_depart.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setResultats(filteredVoyages)
    } else {
      setResultats(tousLesVoyages)
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

