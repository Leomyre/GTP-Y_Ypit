import { VoyageCard } from "@/components/VoyageCard"

const voyagesRecommandes = [
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
  {
    id: 6,
    nom: "Escapade à Tokyo",
    ville_depart: "Paris",
    ville_arrive: "Tokyo",
    date_depart: "2025-09-15",
    prix: 2500,
    image: "/images/tokyo.jpg",
    agence_nom: "Découvertes Asiatiques",
    etoiles: 5,
    likes: 95,
  },
]

export default function VoyagesRecommandes() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">Voyages Recommandés</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {voyagesRecommandes.map((voyage) => (
          <VoyageCard key={voyage.id} voyage={voyage} />
        ))}
      </div>
    </div>
  )
}

