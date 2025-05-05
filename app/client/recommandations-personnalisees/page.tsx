"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { VoyageCard } from "@/components/VoyageCard"
import { RecommendationEngine, type UserPreference } from "@/utils/recommendation-service"
import { withAuth } from "@/components/withAuth"
import { useAuth } from "@/hooks/useAuth"
import { Sparkles, ThumbsUp, ThumbsDown, RefreshCw } from "lucide-react"

// Données statiques pour l'exemple (à remplacer par un appel API réel)
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

// Styles de voyage disponibles
const travelStyles = [
  { id: "cultural", label: "Culturel" },
  { id: "adventure", label: "Aventure" },
  { id: "relaxation", label: "Détente" },
  { id: "gastronomy", label: "Gastronomie" },
  { id: "romantic", label: "Romantique" },
  { id: "family", label: "Famille" },
]

// Destinations populaires
const popularDestinations = [
  { id: "paris", label: "Paris" },
  { id: "bali", label: "Bali" },
  { id: "new-york", label: "New York" },
  { id: "tokyo", label: "Tokyo" },
  { id: "nairobi", label: "Nairobi" },
  { id: "athenes", label: "Athènes" },
  { id: "rome", label: "Rome" },
  { id: "bangkok", label: "Bangkok" },
]

const RecommandationsPersonnalisees = () => {
  const router = useRouter()
  const { user } = useAuth()

  // État pour les préférences utilisateur
  const [preferences, setPreferences] = useState<UserPreference>({
    destinations: ["Paris", "Tokyo"],
    priceRange: [1000, 2500],
    travelStyles: ["cultural", "gastronomy"],
    previousDestinations: ["Rome", "Bangkok"],
    searchHistory: ["Tokyo", "New York"],
  })

  // État pour les recommandations
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showPreferences, setShowPreferences] = useState(false)

  // Charger les recommandations au chargement de la page
  useEffect(() => {
    // Simuler un chargement de données
    setIsLoading(true)

    // Dans une implémentation réelle, vous récupéreriez les préférences de l'utilisateur depuis l'API
    setTimeout(() => {
      const topRecommendations = RecommendationEngine.getTopRecommendations(voyages, preferences, 4)
      setRecommendations(topRecommendations)
      setIsLoading(false)
    }, 1500)
  }, [preferences])

  // Mettre à jour les préférences
  const updatePreferences = (key: keyof UserPreference, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Gérer les changements de style de voyage
  const handleTravelStyleChange = (styleId: string, checked: boolean) => {
    if (checked) {
      updatePreferences("travelStyles", [...preferences.travelStyles, styleId])
    } else {
      updatePreferences(
        "travelStyles",
        preferences.travelStyles.filter((id) => id !== styleId),
      )
    }
  }

  // Gérer les changements de destinations préférées
  const handleDestinationChange = (destination: string, checked: boolean) => {
    if (checked) {
      updatePreferences("destinations", [...preferences.destinations, destination])
    } else {
      updatePreferences(
        "destinations",
        preferences.destinations.filter((d) => d !== destination),
      )
    }
  }

  // Rafraîchir les recommandations
  const refreshRecommendations = () => {
    setIsLoading(true)
    setTimeout(() => {
      const topRecommendations = RecommendationEngine.getTopRecommendations(voyages, preferences, 4)
      setRecommendations(topRecommendations)
      setIsLoading(false)
    }, 1000)
  }

  // Feedback sur les recommandations (dans une implémentation réelle, cela améliorerait l'algorithme)
  const handleFeedback = (voyageId: number, isPositive: boolean) => {
    console.log(`Feedback ${isPositive ? "positif" : "négatif"} pour le voyage ${voyageId}`)
    // Dans une implémentation réelle, vous enverriez ce feedback à l'API
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-teal-600 dark:text-teal-400">Recommandations Personnalisées</h1>
          <p className="text-muted-foreground">Découvrez des voyages sélectionnés spécialement pour vous</p>
        </div>
        <Button variant="outline" onClick={() => setShowPreferences(!showPreferences)} className="mt-2 sm:mt-0">
          {showPreferences ? "Masquer mes préférences" : "Modifier mes préférences"}
        </Button>
      </div>

      {showPreferences && (
        <Card>
          <CardHeader>
            <CardTitle>Mes préférences de voyage</CardTitle>
            <CardDescription>Personnalisez vos préférences pour obtenir de meilleures recommandations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Budget</h3>
                <div className="space-y-2">
                  <Label>Fourchette de prix (€)</Label>
                  <Slider
                    value={preferences.priceRange}
                    min={500}
                    max={5000}
                    step={100}
                    onValueChange={(value) => updatePreferences("priceRange", value)}
                  />
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>{preferences.priceRange[0]} €</span>
                    <span>{preferences.priceRange[1]} €</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Styles de voyage préférés</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {travelStyles.map((style) => (
                    <div key={style.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`style-${style.id}`}
                        checked={preferences.travelStyles.includes(style.id)}
                        onCheckedChange={(checked) => handleTravelStyleChange(style.id, checked === true)}
                      />
                      <Label htmlFor={`style-${style.id}`}>{style.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Destinations qui vous intéressent</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {popularDestinations.map((destination) => (
                    <div key={destination.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`dest-${destination.id}`}
                        checked={preferences.destinations.includes(destination.label)}
                        onCheckedChange={(checked) => handleDestinationChange(destination.label, checked === true)}
                      />
                      <Label htmlFor={`dest-${destination.id}`}>{destination.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Button onClick={refreshRecommendations} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Mettre à jour mes recommandations
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mb-4"></div>
          <p className="text-lg font-medium">Analyse de vos préférences en cours...</p>
          <p className="text-muted-foreground">Notre IA sélectionne les meilleures destinations pour vous</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {recommendations.map((voyage) => (
              <div key={voyage.id} className="relative">
                <div className="absolute top-2 right-2 z-10">
                  <Badge className="bg-teal-500 hover:bg-teal-600 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    {voyage.recommendationScore}% de match
                  </Badge>
                </div>
                <Card className="overflow-hidden h-full flex flex-col">
                  <VoyageCard voyage={voyage} />
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 mt-auto">
                    <div className="mb-2">
                      <p className="text-sm font-medium">Pourquoi nous vous le recommandons :</p>
                      <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                        {voyage.matchReasons.map((reason: string, index: number) => (
                          <li key={index} className="flex items-center">
                            <span className="mr-1">•</span> {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex justify-between mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFeedback(voyage.id, true)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Pertinent
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFeedback(voyage.id, false)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        Non pertinent
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default withAuth(RecommandationsPersonnalisees)

