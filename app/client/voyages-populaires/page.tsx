import { VoyageCard } from "@/components/VoyageCard"

const voyagesPopulaires = [
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
]

export default function VoyagesPopulaires() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">Voyages Populaires</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {voyagesPopulaires.map((voyage) => (
          <VoyageCard key={voyage.id} voyage={voyage} />
        ))}
      </div>
    </div>
  )
}

