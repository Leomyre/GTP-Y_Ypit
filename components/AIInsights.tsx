"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface AIInsightsProps {
  data: any
  page: "destinations" | "clients" | "reservations" | "finances"
}

export function AIInsights({ data, page }: AIInsightsProps) {
  const [insights, setInsights] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simuler un appel API à un service d'IA
    const fetchInsights = async () => {
      setLoading(true)
      // Attendre un court instant pour simuler le temps de traitement de l'IA
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Générer des insights basés sur la page et les données
      const generatedInsights = generateInsights(page, data)
      setInsights(generatedInsights)
      setLoading(false)
    }

    fetchInsights()
  }, [data, page])

  // Fonction pour générer des insights basés sur la page et les données
  const generateInsights = (page: string, data: any): string => {
    // Cette fonction simulerait la génération d'insights par l'IA
    // Pour l'exemple, nous retournons des insights statiques basés sur la page
    switch (page) {
      case "destinations":
        return "L'IA suggère de se concentrer sur la promotion de Prague, qui a le potentiel d'attirer plus de visiteurs grâce à son prix attractif. Envisagez des partenariats locaux pour enrichir l'offre à Paris et maintenir sa popularité."
      case "clients":
        return "L'analyse des données clients révèle une opportunité de fidélisation. Créez un programme de récompenses pour les clients fréquents comme Claire Leroy, et une campagne de réactivation pour les clients occasionnels comme Bob Martin."
      case "reservations":
        return "Les tendances de réservation montrent une croissance constante. Pour optimiser davantage, l'IA recommande des offres spéciales pour les périodes creuses et une stratégie de suivi personnalisée pour les réservations en attente."
      case "finances":
        return "L'IA a détecté une corrélation entre les revenus et les saisons touristiques. Considérez des offres hors saison pour stimuler les revenus en février. La marge bénéficiaire de 49.15% est bonne, mais il y a un potentiel d'optimisation des coûts."
      default:
        return "Aucun insight disponible pour le moment."
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Insights IA</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <p>{insights}</p>
        )}
      </CardContent>
    </Card>
  )
}

