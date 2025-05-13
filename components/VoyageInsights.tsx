import { AIInsightBase } from "./AIInsightBase"
import { MapPin } from "lucide-react"
import { Insight, VoyageData } from "@/types/insights"

interface VoyageInsightsProps {
    voyages: VoyageData[]
}

const generateVoyageInsights = async (voyages: VoyageData[]): Promise<Insight[]> => {
    // Analyse de la rentabilité
    const profitableVoyages = [...voyages]
        .sort((a, b) => {
            const aValue = (a.average_price || 0) * (a.reservations_count || 0)
            const bValue = (b.average_price || 0) * (b.reservations_count || 0)
            return bValue - aValue
        })
        .slice(0, 5)

    // Analyse prix vs popularité
    const priceAnalysis = [...voyages]
        .filter(v => v.popularity && v.average_price)
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))

    return [
        {
            id: `voyage-${Date.now()}-1`,
            title: "Voyages les plus rentables",
            description: "Classement par chiffre d'affaires généré",
            recommendation: "Mettre en avant ces voyages dans les campagnes marketing",
            priority: "high",
            metrics: profitableVoyages.map(v => ({
                name: v.name || "Voyage",
                value: `${((v.average_price || 0) * (v.reservations_count || 0)).toLocaleString()}€`,
                change: undefined
            }))
        },
        {
            id: `voyage-${Date.now()}-2`,
            title: "Corrélation prix/popularité",
            description: "Analyse de l'impact du prix sur la popularité",
            recommendation: "Ajuster les prix selon la courbe de demande",
            priority: "medium",
            metrics: priceAnalysis.slice(0, 5).map(v => ({
                name: v.name || "Voyage",
                value: `Popularité: ${v.popularity}/5 | Prix: ${v.average_price}€`,
                change: undefined
            }))
        }
    ]
}

export function VoyageInsights({ voyages }: VoyageInsightsProps) {
    return (
        <AIInsightBase
            data={voyages}
            pageType="voyages"
            icon={<MapPin className="h-5 w-5" />}
            generateInsights={generateVoyageInsights}
        />
    )
}