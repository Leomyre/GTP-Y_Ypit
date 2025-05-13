// components/AIInsightBase.tsx
"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lightbulb, Star, TrendingUp, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Insight } from "@/types/insights"

interface AIInsightBaseProps<T> {
  data: T[]
  pageType: "clients" | "reservations" | "voyages"
  icon: React.ReactNode
  generateInsights: (data: T[]) => Promise<Insight[]>
}

export function AIInsightBase<T>({
  data,
  pageType,
  icon,
  generateInsights
}: AIInsightBaseProps<T>) {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    try {
      const generatedInsights = await generateInsights(data)
      setInsights(generatedInsights)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur inconnue s'est produite")
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
        return <Badge variant="secondary" className="flex items-center gap-1">
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
            {icon}
            <CardTitle>
              Insights {pageType === "clients" ? "Clients" :
                pageType === "reservations" ? "Réservations" :
                  "Voyages"}
            </CardTitle>
          </div>
          <Button
            onClick={handleGenerate}
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
          Analyse intelligente par IA
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
              Cliquez sur &quotGénérer&quot pour obtenir des insights intelligents
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}