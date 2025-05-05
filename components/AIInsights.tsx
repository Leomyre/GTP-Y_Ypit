"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Lightbulb, TrendingUp, MapPin, DollarSign, CheckCircle, Clock } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { UrlConfig } from "@/utils/Config"

// Types pour les insights
interface ExampleProduct {
  title: string
  destination: string
  duration: string
  price: number
  features: string[]
}

interface Insight {
  id: number
  category: string
  category_name: string
  title: string
  description: string
  recommendation: string
  priority: "high" | "medium" | "low"
  created_at: string
  is_read: boolean
  is_implemented: boolean
  metric_name: string
  metric_value: number | null
  metric_change: number | null
  metric_period: string
  example_product: ExampleProduct | null
}

export function AIInsights() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [loading, setLoading] = useState<boolean>(true)
  const [generating, setGenerating] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const BASE_URL = `${UrlConfig.apiBaseUrl}`;

  // Charger les insights au chargement du composant
  useEffect(() => {
    fetchInsights()
  }, [])

  // Fonction pour récupérer les insights
  const fetchInsights = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${BASE_URL}/insights/`)
      if (!response.ok) throw new Error("Erreur lors de la récupération des insights")

      const data = await response.json()
      setInsights(data.results || [])
      setError(null)
    } catch (err) {
      setError("Impossible de charger les insights. Veuillez réessayer.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Fonction pour générer de nouveaux insights
  const generateInsights = async () => {
    setGenerating(true)
    try {
      const response = await fetch(`${BASE_URL}/analytics/generate_insights/`)
      if (!response.ok) throw new Error("Erreur lors de la génération des insights")

      await fetchInsights() // Recharger les insights après génération
      setError(null)
    } catch (err) {
      setError("Impossible de générer de nouveaux insights. Veuillez réessayer.")
      console.error(err)
    } finally {
      setGenerating(false)
    }
  }

  // Fonction pour marquer un insight comme lu
  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/insights/${id}/mark_as_read/`, {
        method: "PATCH",
      })
      if (!response.ok) throw new Error("Erreur lors du marquage de l'insight")

      setInsights(insights.map((insight) => (insight.id === id ? { ...insight, is_read: true } : insight)))
    } catch (err) {
      console.error(err)
    }
  }

  // Fonction pour marquer un insight comme implémenté
  const markAsImplemented = async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/insights/${id}/mark_as_implemented/`, {
        method: "PATCH",
      })
      if (!response.ok) throw new Error("Erreur lors du marquage de l'insight")

      setInsights(insights.map((insight) => (insight.id === id ? { ...insight, is_implemented: true } : insight)))
    } catch (err) {
      console.error(err)
    }
  }

  // Filtrer les insights par catégorie
  const filteredInsights =
    activeCategory === "all"
      ? insights
      : insights.filter((insight) => insight.category_name.toLowerCase() === activeCategory)

  // Obtenir les catégories uniques
  const categories = ["all", ...new Set(insights.map((insight) => insight.category_name.toLowerCase()))]

  // Fonction pour obtenir l'icône selon la catégorie
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "financier":
        return <DollarSign className="h-5 w-5" />
      case "tendance":
        return <TrendingUp className="h-5 w-5" />
      case "destination":
        return <MapPin className="h-5 w-5" />
      default:
        return <Lightbulb className="h-5 w-5" />
    }
  }

  // Fonction pour obtenir la couleur selon la priorité
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  // Fonction pour formater la priorité en français
  const formatPriority = (priority: string) => {
    switch (priority) {
      case "high":
        return "Haute"
      case "medium":
        return "Moyenne"
      case "low":
        return "Basse"
      default:
        return priority
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Insights IA</h2>
          <p className="text-muted-foreground">Analyses et recommandations générées par intelligence artificielle</p>
        </div>
        <Button onClick={generateInsights} disabled={generating} className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4" />
          {generating ? "Génération en cours..." : "Générer de nouveaux insights"}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="mb-4">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category === "all" ? "Tous" : category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-0">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredInsights.length === 0 ? (
            <div className="text-center py-10">
              <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Aucun insight disponible</h3>
              <p className="mt-2 text-muted-foreground">
                Générez de nouveaux insights pour obtenir des recommandations.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredInsights.map((insight) => (
                <Card key={insight.id} className={insight.is_implemented ? "border-green-500" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(insight.category_name)}
                        <Badge variant="outline" className="capitalize">
                          {insight.category_name}
                        </Badge>
                      </div>
                      <Badge className={getPriorityColor(insight.priority)}>
                        Priorité: {formatPriority(insight.priority)}
                      </Badge>
                    </div>
                    <CardTitle className="mt-2">{insight.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(insight.created_at).toLocaleDateString("fr-FR")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Description:</p>
                      <p>{insight.description}</p>
                    </div>

                    {insight.metric_value !== null && (
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline" className="font-mono">
                          {insight.metric_name}: {insight.metric_value}
                          {insight.metric_change !== null && (
                            <span className={insight.metric_change > 0 ? "text-green-600" : "text-red-600"}>
                              {" "}
                              ({insight.metric_change > 0 ? "+" : ""}
                              {insight.metric_change.toFixed(1)}%)
                            </span>
                          )}
                        </Badge>
                        {insight.metric_period && (
                          <span className="text-muted-foreground">vs {insight.metric_period}</span>
                        )}
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Recommandation:</p>
                      <p className="font-medium">{insight.recommendation}</p>
                    </div>

                    {insight.example_product && (
                      <div className="mt-4 p-3 bg-muted rounded-md">
                        <p className="font-medium mb-2">Exemple de voyage suggéré:</p>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="font-medium">Titre:</span> {insight.example_product.title}
                          </p>
                          <p>
                            <span className="font-medium">Destination:</span> {insight.example_product.destination}
                          </p>
                          <p>
                            <span className="font-medium">Durée:</span> {insight.example_product.duration}
                          </p>
                          <p>
                            <span className="font-medium">Prix suggéré:</span>{" "}
                            {insight.example_product.price.toLocaleString("fr-FR")} €
                          </p>
                          {insight.example_product.features.length > 0 && (
                            <div>
                              <span className="font-medium">Caractéristiques:</span>
                              <ul className="list-disc list-inside ml-2">
                                {insight.example_product.features.map((feature, i) => (
                                  <li key={i}>{feature}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    {!insight.is_read ? (
                      <Button variant="outline" size="sm" onClick={() => markAsRead(insight.id)}>
                        Marquer comme lu
                      </Button>
                    ) : (
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Lu
                      </span>
                    )}

                    {!insight.is_implemented ? (
                      <Button size="sm" onClick={() => markAsImplemented(insight.id)}>
                        Marquer comme implémenté
                      </Button>
                    ) : (
                      <span className="text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Implémenté
                      </span>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
