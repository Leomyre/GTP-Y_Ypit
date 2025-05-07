"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Lightbulb, Users, Calendar, MapPin, Star, TrendingUp, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Insight {
  id: string
  title: string
  description: string
  recommendation: string
  priority: "high" | "medium" | "low"
  metrics?: {
    name: string
    value: string | number
    change?: number
  }[]
}

export function AIInsights({
  data,
  pageType
}: {
  data: any[],
  pageType: "clients" | "reservations" | "destinations"
}) {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""

  const generateInsights = async () => {
    if (!apiKey) {
      setError("Clé API non configurée")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Limite les données envoyées pour éviter les dépassements
      const analysisData = data.slice(0, 50).map(item => {
        if (pageType === "clients") {
          return {
            client: item.username,
            reservations: item.reservations_count,
            total_spent: item.total_spent,
            last_booking: item.last_reservation_date
          }
        } else if (pageType === "reservations") {
          return {
            date: item.date,
            destination: item.destination,
            amount: item.amount,
            status: item.status
          }
        } else {
          return {
            destination: item.name,
            popularity: item.popularity,
            average_price: item.average_price
          }
        }
      })

      const prompt = `
        Tu es un expert en analyse de données pour agences de voyage. 
        Analyse ces données ${pageType} et fournis 3 insights maximum avec:
        - Un titre clair
        - Une description concise
        - Une recommandation actionnable
        - Une priorité (high/medium/low)
        - Des métriques pertinentes si nécessaire

        Format de réponse STRICT en JSON valide:
        {
          "insights": [{
            "title": string,
            "description": string,
            "recommendation": string,
            "priority": "high"|"medium"|"low",
            "metrics"?: [{
              "name": string,
              "value": string|number,
              "change"?: number
            }]
          }]
        }

        Données à analyser: ${JSON.stringify(analysisData)}
      `

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.5,
            topP: 0.95,
            maxOutputTokens: 2000
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || "Erreur API")
      }

      const result = await response.json()
      const responseText = result.candidates[0].content.parts[0].text

      // Extraction robuste du JSON
      const jsonStart = responseText.indexOf('{')
      const jsonEnd = responseText.lastIndexOf('}') + 1
      const jsonString = responseText.slice(jsonStart, jsonEnd)

      const parsedResponse = JSON.parse(jsonString)
      if (!parsedResponse.insights) throw new Error("Format de réponse invalide")

      // Ajout d'ID unique pour chaque insight
      const insightsWithId = parsedResponse.insights.map((insight: any) => ({
        ...insight,
        id: `insight-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      }))

      setInsights(insightsWithId)

    } catch (err: any) {
      setError(`Erreur: ${err.message}`)
      console.error("Erreur Gemini API:", err)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> Haute priorité
        </Badge>
      case "medium":
        return <Badge variant="warning" className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3" /> Moyenne priorité
        </Badge>
      default:
        return <Badge variant="default" className="flex items-center gap-1">
          <Star className="h-3 w-3" /> Basse priorité
        </Badge>
    }
  }

  return (
    <Card className="mt-6 border-0 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {pageType === "clients" ? <Users className="h-5 w-5" /> :
              pageType === "reservations" ? <Calendar className="h-5 w-5" /> :
                <MapPin className="h-5 w-5" />}
            <CardTitle>
              Insights {pageType === "clients" ? "Clients" :
                pageType === "reservations" ? "Réservations" :
                  "Destinations"}
            </CardTitle>
          </div>
          <Button
            onClick={generateInsights}
            disabled={loading}
            size="sm"
            className="gap-1"
          >
            {loading ? (
              <>
                <span className="animate-pulse">⚡</span> Analyse en cours...
              </>
            ) : (
              <>
                <Lightbulb className="h-4 w-4" /> Générer
              </>
            )}
          </Button>
        </div>
        <CardDescription className="pt-1">
          Analyse intelligente par Gemini Flash
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : insights.length > 0 ? (
          <div className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className="rounded-lg border p-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-medium leading-tight">{insight.title}</h3>
                  {getPriorityBadge(insight.priority)}
                </div>

                <p className="text-sm text-muted-foreground mt-2">{insight.description}</p>

                <div className="mt-3 bg-secondary/50 rounded px-3 py-2">
                  <p className="text-sm font-medium">
                    💡 Recommandation: <span className="text-primary">{insight.recommendation}</span>
                  </p>
                </div>

                {insight.metrics && insight.metrics.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {insight.metrics.map((metric, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="flex items-center gap-1 font-mono text-xs"
                      >
                        {metric.name}: {metric.value}
                        {metric.change && (
                          <>
                            {metric.change > 0 ? (
                              <span className="text-green-600 flex items-center">
                                (+{metric.change}% <TrendingUp className="h-3 w-3 ml-0.5" />)
                              </span>
                            ) : (
                              <span className="text-red-600 flex items-center">
                                ({metric.change}% <TrendingUp className="h-3 w-3 ml-0.5 rotate-180" />)
                              </span>
                            )}
                          </>
                        )}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Lightbulb className="h-10 w-10 text-muted-foreground mb-3" />
            <h4 className="font-medium text-muted-foreground">Aucune analyse générée</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Cliquez sur "Générer" pour obtenir des insights intelligents
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}