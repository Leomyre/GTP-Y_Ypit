"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, MapPinIcon, StarIcon, Users, Clock, DollarSign } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { VoyageDetailsSkeleton } from "@/components/skeletons/voyage-details-skeleton"
import { useAuth } from "@/hooks/useAuth"

// Données statiques pour l'exemple (à remplacer par un appel API réel)
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
    description:
      "Profitez d'un séjour inoubliable dans la ville de l'amour. Visitez la Tour Eiffel, le Louvre, et savourez la cuisine française dans les meilleurs restaurants de la capitale.",
    inclus: ["Hôtel 5 étoiles", "Petit-déjeuner", "Visite guidée", "Croisière sur la Seine"],
    programme: [
      { jour: 1, activite: "Arrivée et installation à l'hôtel" },
      { jour: 2, activite: "Visite de la Tour Eiffel et du Louvre" },
      { jour: 3, activite: "Exploration de Montmartre et du Sacré-Cœur" },
      { jour: 4, activite: "Croisière sur la Seine et shopping sur les Champs-Élysées" },
      { jour: 5, activite: "Visite du château de Versailles" },
      { jour: 6, activite: "Départ et retour" },
    ],
  },
  // Ajoutons d'autres voyages pour que les liens fonctionnent
  {
    id: 2,
    nom: "Aventure à Bali",
    ville_depart: "Paris",
    ville_arrive: "Bali",
    date_depart: "2025-04-01",
    date_arrive_prevu: "2025-04-11",
    prix: 1800,
    places_disponibles: 8,
    image: "/images/bali.jpg",
    agence_nom: "Évasion Tropicale",
    etoiles: 4,
    likes: 65,
    description:
      "Découvrez la beauté exotique de Bali, ses plages paradisiaques, ses temples sacrés et sa culture fascinante.",
    inclus: ["Hôtel 4 étoiles", "Petit-déjeuner", "Excursions guidées", "Transferts aéroport"],
    programme: [
      { jour: 1, activite: "Arrivée à Denpasar et transfert à l'hôtel" },
      { jour: 2, activite: "Visite des rizières en terrasse d'Ubud" },
      { jour: 3, activite: "Découverte des temples de Tanah Lot et Uluwatu" },
      { jour: 4, activite: "Journée libre à la plage de Kuta" },
      { jour: 5, activite: "Excursion au mont Batur" },
      { jour: 6, activite: "Cours de cuisine balinaise" },
      { jour: 7, activite: "Visite du marché traditionnel" },
      { jour: 8, activite: "Journée spa et bien-être" },
      { jour: 9, activite: "Excursion aux îles Gili" },
      { jour: 10, activite: "Temps libre et shopping" },
      { jour: 11, activite: "Départ et retour" },
    ],
  },
  {
    id: 4,
    nom: "Safari au Kenya",
    ville_depart: "Paris",
    ville_arrive: "Nairobi",
    date_depart: "2025-06-10",
    date_arrive_prevu: "2025-06-18",
    prix: 2200,
    places_disponibles: 12,
    image: "/images/kenya.jpg",
    agence_nom: "Aventures Sauvages",
    etoiles: 5,
    likes: 88,
    description:
      "Partez à la découverte de la faune africaine lors d'un safari inoubliable au Kenya. Observez les Big Five dans leur habitat naturel.",
    inclus: ["Lodge de luxe", "Pension complète", "Safari guidé", "Transferts 4x4"],
    programme: [
      { jour: 1, activite: "Arrivée à Nairobi et transfert au lodge" },
      { jour: 2, activite: "Safari dans le parc national d'Amboseli" },
      { jour: 3, activite: "Observation des éléphants et du Kilimandjaro" },
      { jour: 4, activite: "Transfert vers la réserve nationale du Masai Mara" },
      { jour: 5, activite: "Safari à la recherche des lions et léopards" },
      { jour: 6, activite: "Visite d'un village Masaï" },
      { jour: 7, activite: "Safari au lever du soleil et observation des girafes" },
      { jour: 8, activite: "Retour à Nairobi et départ" },
    ],
  },
  {
    id: 6,
    nom: "Escapade à Tokyo",
    ville_depart: "Paris",
    ville_arrive: "Tokyo",
    date_depart: "2025-09-15",
    date_arrive_prevu: "2025-09-25",
    prix: 2500,
    places_disponibles: 10,
    image: "/images/tokyo.jpg",
    agence_nom: "Découvertes Asiatiques",
    etoiles: 5,
    likes: 95,
    description:
      "Immergez-vous dans la culture japonaise et découvrez Tokyo, une ville où tradition et modernité se côtoient harmonieusement.",
    inclus: ["Hôtel 4 étoiles", "Petit-déjeuner", "Pass transport", "Guide francophone"],
    programme: [
      { jour: 1, activite: "Arrivée à Tokyo et transfert à l'hôtel" },
      { jour: 2, activite: "Visite du quartier de Shibuya et du célèbre carrefour" },
      { jour: 3, activite: "Découverte du temple Senso-ji à Asakusa" },
      { jour: 4, activite: "Excursion au Mont Fuji" },
      { jour: 5, activite: "Visite du quartier d'Akihabara" },
      { jour: 6, activite: "Journée à Disneyland Tokyo" },
      { jour: 7, activite: "Visite du Palais Impérial et des jardins" },
      { jour: 8, activite: "Excursion à Kyoto" },
      { jour: 9, activite: "Visite des temples de Kyoto" },
      { jour: 10, activite: "Retour à Tokyo et shopping" },
      { jour: 11, activite: "Départ et retour" },
    ],
  },
]

export default function VoyageDetails() {
  const router = useRouter()
  const { id } = useParams()
  const [voyage, setVoyage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { isLoggedIn } = useAuth()

  // Fonction pour enregistrer le voyage consulté
  const enregistrerVoyageConsulte = (voyageId: number, voyageDetails: any) => {
    if (isLoggedIn) {
      // Dans une implémentation réelle, vous feriez un appel API ici
      // pour enregistrer le voyage consulté par l'utilisateur
      console.log("Voyage consulté en détail:", voyageId)

      // Pour l'exemple, on stocke dans le localStorage
      try {
        const voyagesConsultes = JSON.parse(localStorage.getItem("voyagesConsultes") || "[]")

        // Vérifier si le voyage est déjà dans la liste
        const existingIndex = voyagesConsultes.findIndex((v: any) => v.id === voyageId)

        if (existingIndex !== -1) {
          // Mettre à jour la date de consultation
          voyagesConsultes[existingIndex].date_consultation = new Date().toISOString()
        } else {
          // Ajouter le nouveau voyage consulté avec plus de détails
          voyagesConsultes.push({
            id: voyageId,
            nom: voyageDetails.nom,
            destination: voyageDetails.ville_arrive,
            prix: voyageDetails.prix,
            date_consultation: new Date().toISOString(),
          })
        }

        // Limiter à 10 voyages consultés les plus récents
        const voyagesRecents = voyagesConsultes
          .sort((a: any, b: any) => new Date(b.date_consultation).getTime() - new Date(a.date_consultation).getTime())
          .slice(0, 10)

        localStorage.setItem("voyagesConsultes", JSON.stringify(voyagesRecents))
      } catch (error) {
        console.error("Erreur lors de l'enregistrement du voyage consulté:", error)
      }
    }
  }

  useEffect(() => {
    // Simuler une requête API
    const fetchData = async () => {
      // Simuler un délai de chargement
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const fetchedVoyage = voyages.find((v) => v.id.toString() === id)
      setVoyage(fetchedVoyage)
      setLoading(false)

      // Enregistrer le voyage consulté si l'utilisateur est connecté
      if (fetchedVoyage && isLoggedIn) {
        enregistrerVoyageConsulte(fetchedVoyage.id, fetchedVoyage)
      }
    }

    fetchData()
  }, [id, isLoggedIn])

  if (loading) {
    return <VoyageDetailsSkeleton />
  }

  if (!voyage) {
    return <div>Voyage non trouvé</div>
  }

  // Modifier la fonction handleReservation pour rediriger vers la page de paiement au lieu de la page de réservation
  const handleReservation = () => {
    if (!isLoggedIn) {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      router.push("/client/auth/login")
    } else {
      // Rediriger vers la page de paiement directement
      router.push(`/client/paiement?voyageId=${id}`)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        Retour
      </Button>

      <Card className="overflow-hidden">
        <Image
          src={voyage.image || "/placeholder.svg"}
          alt={voyage.nom}
          width={1200}
          height={400}
          className="w-full h-48 sm:h-64 object-cover"
        />
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <CardTitle className="text-xl sm:text-2xl">{voyage.nom}</CardTitle>
              <p className="text-sm sm:text-base text-muted-foreground">{voyage.agence_nom}</p>
            </div>
            <div className="flex items-center mt-2 sm:mt-0">
              <StarIcon className="text-yellow-400 w-4 h-4 sm:w-5 sm:h-5 mr-1" />
              <span className="text-sm sm:text-base">{voyage.etoiles}/5</span>
              <span className="text-sm sm:text-base ml-2">({voyage.likes} avis)</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="flex items-center">
              <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base">Départ de {voyage.ville_depart}</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base">
                {format(new Date(voyage.date_depart), "d MMMM yyyy", { locale: fr })}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base">
                {format(new Date(voyage.date_arrive_prevu), "d MMMM yyyy", { locale: fr })}
              </span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base">{voyage.places_disponibles} places disponibles</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base">{voyage.prix} €</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-base sm:text-lg">Description</h3>
            <p className="text-sm sm:text-base">{voyage.description}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-base sm:text-lg">Ce qui est inclus</h3>
            <ul className="list-disc list-inside text-sm sm:text-base">
              {voyage.inclus.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-base sm:text-lg">Programme</h3>
            <ul className="space-y-2 text-sm sm:text-base">
              {voyage.programme.map((jour: { jour: number; activite: string }) => (
                <li key={jour.jour} className="flex">
                  <span className="font-semibold mr-2">Jour {jour.jour}:</span>
                  <span>{jour.activite}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button className="w-full mt-4" onClick={handleReservation}>
            Réserver maintenant
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

