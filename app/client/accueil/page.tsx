"use client"

import { VoyageCard } from "@/components/VoyageCard"

const voyages = [
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

export default function ClientAccueil() {
  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-blue-600 dark:text-blue-400">
        Destinations de Rêve
      </h1>
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {voyages.map((voyage) => (
          <VoyageCard key={voyage.id} voyage={voyage} />
        ))}
      </div>
    </>
  )
}

