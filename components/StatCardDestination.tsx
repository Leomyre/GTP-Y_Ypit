import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown, Equal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatCardProps {
    title: string
    value: string | number
    description?: string
    change?: number // Pourcentage de changement
    loading?: boolean
    icon?: React.ReactNode
    className?: string
}

export function StatCardDestination({
    title,
    value,
    description,
    change,
    loading = false,
    icon,
    className
}: StatCardProps) {
    const getChangeIndicator = () => {
        if (change === undefined || change === null) return null

        const positive = change > 0
        const neutral = change === 0

        return (
            <Badge
                variant="outline"
                className={cn(
                    "ml-2 flex items-center gap-1",
                    positive ? "bg-green-50 text-green-600" : "",
                    !positive && !neutral ? "bg-red-50 text-red-600" : "",
                    neutral ? "bg-gray-50 text-gray-600" : ""
                )}
            >
                {positive ? (
                    <ArrowUp className="h-3 w-3" />
                ) : neutral ? (
                    <Equal className="h-3 w-3" />
                ) : (
                    <ArrowDown className="h-3 w-3" />
                )}
                {Math.abs(change)}%
            </Badge>
        )
    }

    return (
        <Card className={cn("hover:shadow-sm transition-shadow", className)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
            </CardHeader>
            <CardContent>
                {loading ? (
                    <>
                        <Skeleton className="h-8 w-3/4 mb-2" />
                        {description && <Skeleton className="h-4 w-full" />}
                    </>
                ) : (
                    <>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold">{value}</span>
                            {getChangeIndicator()}
                        </div>
                        {description && (
                            <p className="text-xs text-muted-foreground mt-1">{description}</p>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    )
}

// Variantes pré-définies pour les statistiques de revenus
export function RevenueStatCard({ title, value, change, period }: {
    title: string
    value: number
    change?: number
    period?: string
}) {
    const formattedValue = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0
    }).format(value)

    return (
        <StatCardDestination
            title={title}
            value={formattedValue}
            change={change}
            description={period ? `vs ${period}` : undefined}
            icon={<TrendingUp className="h-4 w-4" />}
            className="border-blue-100 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-900/10"
        />
    )
}

// Exemple d'utilisation :
/*
<RevenueStatCard 
  title="Chiffre d'affaires" 
  value={12500} 
  change={12.5} 
  period="mois dernier"
/>
*/