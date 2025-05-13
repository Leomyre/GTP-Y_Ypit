import { AIInsightBase } from "./AIInsightBase"
import { Calendar } from "lucide-react"
import { Insight, ReservationData } from "@/types/insights"

interface ReservationInsightsProps {
    reservations: ReservationData[]
}

const generateReservationInsights = async (reservations: ReservationData[]): Promise<Insight[]> => {
    // Analyse par statut
    const statusCount = reservations.reduce((acc, r) => {
        const status = r.status || 'inconnu'
        acc[status] = (acc[status] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    // Analyse des destinations populaires
    const popularDestinations = [...reservations]
        .reduce((acc, r) => {
            const dest = r.destination || 'Inconnue'
            acc[dest] = (acc[dest] || 0) + 1
            return acc
        }, {} as Record<string, number>)

    return [
        {
            id: `reservation-${Date.now()}-1`,
            title: "Statut des réservations",
            description: "Répartition des réservations par statut",
            recommendation: "Suivre les réservations en attente de paiement",
            priority: "medium",
            metrics: Object.entries(statusCount).map(([status, count]) => ({
                name: status,
                value: count,
                change: undefined
            }))
        },
        {
            id: `reservation-${Date.now()}-2`,
            title: "Destinations populaires",
            description: "Top des destinations les plus réservées",
            recommendation: "Augmenter l'offre pour ces destinations",
            priority: "high",
            metrics: Object.entries(popularDestinations)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([destination, count]) => ({
                    name: destination,
                    value: count,
                    change: undefined
                }))
        }
    ]
}

export function ReservationInsights({ reservations }: ReservationInsightsProps) {
    return (
        <AIInsightBase
            data={reservations}
            pageType="reservations"
            icon={<Calendar className="h-5 w-5" />}
            generateInsights={generateReservationInsights}
        />
    )
}