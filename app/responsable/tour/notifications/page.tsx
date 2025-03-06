"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, TrendingUp, Star, Lightbulb, MessageSquare, Check, Calendar, Users } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Skeleton } from "@/components/ui/skeleton"

// Types pour les notifications
type NotificationType = "tendance" | "avis" | "suggestion" | "reservation" | "systeme"

interface Notification {
  id: string
  type: NotificationType
  title: string
  description: string
  date: string
  read: boolean
  image?: string
  rating?: number
  link?: string
  metadata?: Record<string, any>
}

// Données statiques pour l'exemple
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "tendance",
    title: "Barcelone est en hausse de 25%",
    description:
      "Les réservations pour Barcelone ont augmenté de 25% ce mois-ci. Envisagez d'ajouter plus d'offres pour cette destination.",
    date: "2024-06-01T09:30:00",
    read: false,
    image: "/images/barcelona.jpg",
    metadata: {
      percentage: 25,
      previousMonth: 120,
      currentMonth: 150,
    },
  },
  {
    id: "2",
    type: "avis",
    title: "Nouvel avis 5 étoiles",
    description:
      "Marie Dupont a laissé un avis 5 étoiles pour 'Paris Romantique'. Elle a particulièrement apprécié la visite guidée.",
    date: "2024-05-31T14:20:00",
    read: true,
    rating: 5,
    metadata: {
      clientName: "Marie Dupont",
      voyageId: "1",
      voyageName: "Paris Romantique",
    },
  },
  {
    id: "3",
    type: "suggestion",
    title: "Suggestion de voyage: Croisière nordique",
    description:
      "Notre IA suggère d'ajouter une croisière dans les fjords norvégiens. Les recherches pour cette destination ont augmenté de 40%.",
    date: "2024-05-30T11:15:00",
    read: false,
    image: "/images/norway.jpg",
    metadata: {
      searchIncrease: 40,
      estimatedDemand: "Élevé",
      suggestedPrice: "2500€-3500€",
    },
  },
  {
    id: "4",
    type: "reservation",
    title: "Nouvelle réservation",
    description: "Jean Martin a réservé 'Aventure à Bali' pour 2 personnes du 15 au 25 juillet 2025.",
    date: "2024-05-29T16:45:00",
    read: false,
    metadata: {
      clientName: "Jean Martin",
      voyageId: "2",
      voyageName: "Aventure à Bali",
      persons: 2,
      dateStart: "2025-07-15",
      dateEnd: "2025-07-25",
    },
  },
  {
    id: "5",
    type: "systeme",
    title: "Mise à jour du système",
    description:
      "Le système de réservation a été mis à jour. Nouvelles fonctionnalités: paiement en plusieurs fois et gestion des annulations.",
    date: "2024-05-28T08:00:00",
    read: true,
    metadata: {
      version: "2.3.0",
      features: ["Paiement en plusieurs fois", "Gestion des annulations", "Amélioration des performances"],
    },
  },
  {
    id: "6",
    type: "tendance",
    title: "Les voyages courts sont populaires",
    description:
      "Les city-breaks de 3-4 jours sont de plus en plus demandés. Envisagez d'ajouter plus d'offres courtes.",
    date: "2024-05-27T10:30:00",
    read: true,
    metadata: {
      trend: "City-breaks",
      duration: "3-4 jours",
      popularDestinations: ["Amsterdam", "Prague", "Lisbonne"],
    },
  },
  {
    id: "7",
    type: "avis",
    title: "Avis nécessitant attention",
    description:
      "Pierre Durand a laissé un avis 2 étoiles pour 'New York City Break'. Il mentionne des problèmes avec l'hôtel.",
    date: "2024-05-26T13:15:00",
    read: false,
    rating: 2,
    metadata: {
      clientName: "Pierre Durand",
      voyageId: "3",
      voyageName: "New York City Break",
      issue: "Qualité de l'hôtel",
    },
  },
  {
    id: "8",
    type: "suggestion",
    title: "Suggestion de voyage: Japon en automne",
    description:
      "Notre IA suggère un circuit au Japon pendant la saison des feuilles d'automne. Cette période attire beaucoup de voyageurs.",
    date: "2024-05-25T09:45:00",
    read: true,
    image: "/images/japan.jpg",
    metadata: {
      season: "Automne",
      estimatedDemand: "Très élevé",
      suggestedPrice: "3000€-4000€",
      highlights: ["Tokyo", "Kyoto", "Mont Fuji"],
    },
  },
  {
    id: "9",
    type: "reservation",
    title: "Réservation annulée",
    description: "Sophie Petit a annulé sa réservation pour 'Safari Kenyan' prévue du 5 au 13 septembre 2025.",
    date: "2024-05-24T15:30:00",
    read: true,
    metadata: {
      clientName: "Sophie Petit",
      voyageId: "4",
      voyageName: "Safari Kenyan",
      dateStart: "2025-09-05",
      dateEnd: "2025-09-13",
      refundStatus: "En cours",
    },
  },
  {
    id: "10",
    type: "systeme",
    title: "Maintenance prévue",
    description:
      "Une maintenance du système est prévue le 10 juin de 2h à 4h du matin. Le système sera indisponible pendant cette période.",
    date: "2024-05-23T11:00:00",
    read: false,
    metadata: {
      maintenanceDate: "2024-06-10",
      startTime: "02:00",
      endTime: "04:00",
      impact: "Système indisponible",
    },
  },
]

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<string>("all")
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simuler un chargement de données
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setNotifications(mockNotifications)
      setLoading(false)
    }

    loadData()
  }, [])

  const filteredNotifications =
    activeTab === "all" ? notifications : notifications.filter((notif) => notif.type === activeTab)

  const unreadCount = notifications.filter((notif) => !notif.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const getIconForType = (type: NotificationType) => {
    switch (type) {
      case "tendance":
        return <TrendingUp className="h-5 w-5 text-blue-500" />
      case "avis":
        return <Star className="h-5 w-5 text-yellow-500" />
      case "suggestion":
        return <Lightbulb className="h-5 w-5 text-green-500" />
      case "reservation":
        return <Calendar className="h-5 w-5 text-purple-500" />
      case "systeme":
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getTypeLabel = (type: NotificationType) => {
    switch (type) {
      case "tendance":
        return "Tendance"
      case "avis":
        return "Avis client"
      case "suggestion":
        return "Suggestion IA"
      case "reservation":
        return "Réservation"
      case "systeme":
        return "Système"
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Restez informé des dernières nouvelles de votre agence</p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="mr-2 h-4 w-4" />
              Tout marquer comme lu
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 sm:grid-cols-6 mb-4">
          <TabsTrigger value="all" className="relative">
            Tout
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="tendance">Tendances</TabsTrigger>
          <TabsTrigger value="avis">Avis</TabsTrigger>
          <TabsTrigger value="suggestion">Suggestions</TabsTrigger>
          <TabsTrigger value="reservation">Réservations</TabsTrigger>
          <TabsTrigger value="systeme">Système</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {loading ? (
            // Affichage du chargement
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4 mt-1" />
                </CardContent>
              </Card>
            ))
          ) : filteredNotifications.length > 0 ? (
            // Affichage des notifications
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all ${!notification.read ? "border-l-4 border-l-primary" : ""}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {getIconForType(notification.type)}
                      <Badge variant="outline">{getTypeLabel(notification.type)}</Badge>
                      {!notification.read && <Badge>Nouveau</Badge>}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(notification.date), "d MMM yyyy à HH:mm", { locale: fr })}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="text-lg font-semibold mb-1">{notification.title}</h3>
                  <p className="text-muted-foreground">{notification.description}</p>

                  {notification.type === "avis" && notification.rating && (
                    <div className="flex items-center mt-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < notification.rating! ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  )}

                  {notification.type === "suggestion" && (
                    <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium mb-1">
                        <Lightbulb className="h-4 w-4" />
                        Suggestion de l'IA
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Basée sur l'analyse de {notification.metadata?.searchIncrease}% d'augmentation des recherches.
                        Demande estimée: {notification.metadata?.estimatedDemand}.
                      </p>
                    </div>
                  )}

                  {notification.type === "reservation" && (
                    <div className="mt-2 flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{notification.metadata?.clientName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-medium">{notification.metadata?.clientName}</p>
                        <p className="text-muted-foreground">
                          {notification.metadata?.persons}{" "}
                          {notification.metadata?.persons > 1 ? "personnes" : "personne"}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button variant="link" size="sm" asChild>
                    <a href={notification.link || "#"}>Voir les détails</a>
                  </Button>
                  {!notification.read && (
                    <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                      <Check className="mr-2 h-4 w-4" />
                      Marquer comme lu
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))
          ) : (
            // Aucune notification
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Aucune notification</p>
                <p className="text-muted-foreground">Vous n'avez pas de notifications dans cette catégorie</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {activeTab === "suggestion" && !loading && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-green-500" />
              Assistant IA
            </CardTitle>
            <CardDescription>
              Notre IA analyse les tendances du marché pour vous suggérer de nouvelles opportunités
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-full">
                <Lightbulb className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-medium">Tendances actuelles</h3>
                <p className="text-sm text-muted-foreground">
                  Les voyages écologiques et durables sont en forte hausse. Envisagez d'ajouter des options de voyage à
                  faible empreinte carbone.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium">Destinations émergentes</h3>
                <p className="text-sm text-muted-foreground">
                  La Slovénie et le Portugal connaissent une augmentation significative des recherches. Ces destinations
                  offrent un bon rapport qualité-prix.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-full">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h3 className="font-medium">Comportement client</h3>
                <p className="text-sm text-muted-foreground">
                  Les voyageurs réservent plus tôt que l'année dernière. Envisagez des offres de réservation anticipée
                  pour maximiser les ventes.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <MessageSquare className="mr-2 h-4 w-4" />
              Discuter avec l'assistant IA
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

