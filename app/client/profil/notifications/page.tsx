"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Bell, Check } from "lucide-react"
import { withAuth } from "@/components/withAuth"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

// Données statiques pour l'exemple (à remplacer par un appel API réel)
const notificationsData = [
  {
    id: 1,
    titre: "Promotion spéciale",
    message: "Profitez de 15% de réduction sur votre prochaine réservation avec le code SUMMER2025.",
    date: "2024-06-12T10:30:00",
    lue: false,
    type: "promotion",
  },
  {
    id: 2,
    titre: "Confirmation de réservation",
    message: "Votre réservation pour 'Aventure à Bali' a été confirmée. Bon voyage !",
    date: "2024-05-15T14:45:00",
    lue: true,
    type: "reservation",
  },
  {
    id: 3,
    titre: "Rappel de voyage",
    message: "Votre voyage à Bali commence dans 30 jours. N'oubliez pas de vérifier vos documents de voyage.",
    date: "2024-06-01T09:15:00",
    lue: false,
    type: "rappel",
  },
  {
    id: 4,
    titre: "Nouvelle destination",
    message: "Découvrez notre nouvelle destination : les îles Maldives ! Des plages paradisiaques vous attendent.",
    date: "2024-05-28T16:20:00",
    lue: true,
    type: "nouveaute",
  },
  {
    id: 5,
    titre: "Mise à jour des conditions",
    message: "Nos conditions générales de vente ont été mises à jour. Veuillez en prendre connaissance.",
    date: "2024-05-20T11:10:00",
    lue: false,
    type: "information",
  },
]

const NotificationsClient = () => {
  const router = useRouter()
  const [notifications, setNotifications] = useState(notificationsData)
  const [filter, setFilter] = useState("toutes")

  // Simuler un chargement des données depuis l'API
  useEffect(() => {
    // Dans une implémentation réelle, vous feriez un appel API ici
    // pour récupérer les notifications de l'utilisateur
  }, [])

  const marquerCommeLue = (id: number) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, lue: true } : notif)))
  }

  const marquerToutesCommeLues = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, lue: true })))
  }

  const filteredNotifications =
    filter === "toutes"
      ? notifications
      : filter === "non-lues"
        ? notifications.filter((notif) => !notif.lue)
        : notifications.filter((notif) => notif.type === filter)

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "promotion":
        return "Promotion"
      case "reservation":
        return "Réservation"
      case "rappel":
        return "Rappel"
      case "nouveaute":
        return "Nouveauté"
      case "information":
        return "Information"
      default:
        return type
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "promotion":
        return <Badge className="bg-purple-500 hover:bg-purple-600">{getTypeLabel(type)}</Badge>
      case "reservation":
        return <Badge className="bg-blue-500 hover:bg-blue-600">{getTypeLabel(type)}</Badge>
      case "rappel":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">{getTypeLabel(type)}</Badge>
      case "nouveaute":
        return <Badge className="bg-green-500 hover:bg-green-600">{getTypeLabel(type)}</Badge>
      case "information":
        return <Badge className="bg-gray-500 hover:bg-gray-600">{getTypeLabel(type)}</Badge>
      default:
        return <Badge>{getTypeLabel(type)}</Badge>
    }
  }

  const nonLuesCount = notifications.filter((notif) => !notif.lue).length

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
        <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">Mes Notifications</h1>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center">
          <Bell className="mr-2 h-5 w-5 text-green-500" />
          <span className="text-lg font-medium">
            {nonLuesCount} notification{nonLuesCount !== 1 ? "s" : ""} non lue{nonLuesCount !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant={filter === "toutes" ? "default" : "outline"} size="sm" onClick={() => setFilter("toutes")}>
            Toutes
          </Button>
          <Button
            variant={filter === "non-lues" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("non-lues")}
          >
            Non lues
          </Button>
          <Button
            variant={filter === "promotion" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("promotion")}
          >
            Promotions
          </Button>
          <Button
            variant={filter === "reservation" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("reservation")}
          >
            Réservations
          </Button>

          {nonLuesCount > 0 && (
            <Button variant="outline" size="sm" onClick={marquerToutesCommeLues} className="ml-2">
              <Check className="mr-1 h-4 w-4" />
              Tout marquer comme lu
            </Button>
          )}
        </div>
      </div>

      {filteredNotifications.length > 0 ? (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`hover:shadow-md transition-shadow ${!notification.lue ? "border-l-4 border-l-teal-500" : ""}`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <CardTitle className="text-lg">{notification.titre}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(notification.date), "d MMMM yyyy à HH:mm", { locale: fr })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTypeBadge(notification.type)}
                    {!notification.lue && <Badge variant="outline">Nouveau</Badge>}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p>{notification.message}</p>
                <div className="flex justify-end mt-4">
                  {!notification.lue && (
                    <Button variant="ghost" size="sm" onClick={() => marquerCommeLue(notification.id)}>
                      <Check className="mr-1 h-4 w-4" />
                      Marquer comme lu
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Aucune notification</p>
            <p className="text-muted-foreground">
              {filter === "toutes"
                ? "Vous n'avez pas encore reçu de notifications."
                : filter === "non-lues"
                  ? "Vous n'avez pas de notifications non lues."
                  : `Vous n'avez pas de notifications de type "${getTypeLabel(filter)}".`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default withAuth(NotificationsClient)

