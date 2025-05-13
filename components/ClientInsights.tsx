import { AIInsightBase } from "./AIInsightBase"
import { Users } from "lucide-react"
import { Insight, ClientData } from "@/types/insights"

interface ClientInsightsProps {
    clients: ClientData[]
}

const generateClientInsights = async (clients: ClientData[]): Promise<Insight[]> => {
    // Analyse des clients VIP (top dépenseurs)
    const topClients = [...clients]
        .sort((a, b) => (b.total_spent || 0) - (a.total_spent || 0))
        .slice(0, 5)

    // Analyse de la fréquence de réservation
    const frequentClients = [...clients]
        .sort((a, b) => (b.reservations_count || 0) - (a.reservations_count || 0))
        .slice(0, 5)

    return [
        {
            id: `client-${Date.now()}-1`,
            title: "Top 5 clients par chiffre d'affaires",
            description: `Ces clients ont généré ${topClients.reduce((sum, c) => sum + (c.total_spent || 0), 0).toLocaleString()}€ au total`,
            recommendation: "Proposer des offres premium à ces clients fidèles",
            priority: "high",
            metrics: topClients.map(c => ({
                name: c.username || "Client",
                value: `${(c.total_spent || 0).toLocaleString()}€`,
                change: undefined
            }))
        },
        {
            id: `client-${Date.now()}-2`,
            title: "Clients les plus actifs",
            description: `Ces clients ont effectué ${frequentClients.reduce((sum, c) => sum + (c.reservations_count || 0), 0)} réservations`,
            recommendation: "Mettre en place un programme de fidélité",
            priority: "medium",
            metrics: frequentClients.map(c => ({
                name: c.username || "Client",
                value: `${c.reservations_count || 0} réservations`,
                change: undefined
            }))
        }
    ]
}

export function ClientInsights({ clients }: ClientInsightsProps) {
    return (
        <AIInsightBase
            data={clients}
            pageType="clients"
            icon={<Users className="h-5 w-5" />}
            generateInsights={generateClientInsights}
        />
    )
}