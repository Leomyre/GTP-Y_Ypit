import { Calendar, MapPin, CreditCard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { ReservationCardProps } from "@/types/Reservation"

const getStatusBadge = (statut: string) => {
    switch (statut) {
        case "Confirmée":
            return <Badge className="bg-green-500 hover:bg-green-600">{statut}</Badge>
        case "Payée":
            return <Badge className="bg-blue-500 hover:bg-blue-600">{statut}</Badge>
        case "En attente":
            return <Badge className="bg-yellow-500 hover:bg-yellow-600">{statut}</Badge>
        case "Annulée":
            return <Badge className="bg-red-500 hover:bg-red-600">{statut}</Badge>
        default:
            return <Badge>{statut}</Badge>
    }
}

const ReservationCard: React.FC<ReservationCardProps> = ({ reservation }) => {
    const router = useRouter()

    const handleClick = () => {
        router.push(`/client/voyage/${reservation.voyage.id}`)
    }

    return (
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleClick}>
            <CardHeader>
                <CardTitle className="text-lg font-semibold flex justify-between items-center">
                    {reservation.voyage.titre}
                    {getStatusBadge(reservation.statut)}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{reservation.voyage.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{format(new Date(reservation.voyage.date_depart), "d MMMM yyyy", { locale: fr })}</span>
                </div>
                <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span>
                        {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(reservation.prix_total)}
                    </span>
                </div>
                {reservation.reference && (
                    <p className="text-xs text-muted-foreground mt-2">Réf : {reservation.reference}</p>
                )}
            </CardContent>
        </Card>
    )
}

export default ReservationCard
