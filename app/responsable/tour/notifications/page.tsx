"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, TrendingUp, Star, Lightbulb, Check, Calendar, Users, MessageSquare } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toastx"
import { NotificationService } from "@/services/service-notification"
import { useAuth } from "@/hooks/useAuth"
import { Notification, NotificationType } from "@/types/notifications"

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<NotificationType | "all">("all")
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const { toast } = useToast()
  const { token } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return

      try {
        setLoading(true)

        // Charger les notifications
        const notificationsResponse = await NotificationService.getNotifications(token, {
          type: activeTab === "all" ? undefined : activeTab
        })
        setNotifications(notificationsResponse.results)

        // Charger le compte des non-lues
        const countResponse = await NotificationService.getUnreadCount(token)
        setUnreadCount(countResponse.count)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les notifications",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [activeTab, token, toast])

  const markAsRead = async (id: number) => {
    try {
      await axios.patch(`/api/notifications/${id}/mark_one_as_read/`)
      setNotifications(prev =>
        prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
      )
      setUnreadCount(prev => prev - 1)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de marquer la notification comme lue",
        variant: "destructive"
      })
    }
  }

  const markAllAsRead = async () => {
    try {
      await NotificationService.markAsRead(token, { all: true })
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true })))
      setUnreadCount(0)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de marquer toutes les notifications comme lues",
        variant: "destructive"
      })
    }
  }

  const getIconForType = (type: string) => {
    switch (type) {
      case "promotion":
        return <TrendingUp className="h-5 w-5 text-blue-500" />
      case "reservation":
        return <Calendar className="h-5 w-5 text-purple-500" />
      case "reminder":
        return <Bell className="h-5 w-5 text-yellow-500" />
      case "new_feature":
        return <Lightbulb className="h-5 w-5 text-green-500" />
      case "info":
      case "alert":
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "promotion":
        return "Promotion"
      case "reservation":
        return "Réservation"
      case "reminder":
        return "Rappel"
      case "new_feature":
        return "Nouveauté"
      case "info":
        return "Information"
      case "alert":
        return "Alerte"
      default:
        return type
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

      <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as NotificationType | "all")}>
        <TabsList className="grid grid-cols-3 sm:grid-cols-6 mb-4">
          <TabsTrigger value="all" className="relative">
            Tout
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="promotion">Promotions</TabsTrigger>
          <TabsTrigger value="reservation">Réservations</TabsTrigger>
          <TabsTrigger value="reminder">Rappels</TabsTrigger>
          <TabsTrigger value="new_feature">Nouveautés</TabsTrigger>
          <TabsTrigger value="info">Infos</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {loading ? (
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
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all ${!notification.read ? "border-l-4 border-l-primary" : ""}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {getIconForType(notification.notification_type)}
                      <Badge variant="outline">{getTypeLabel(notification.notification_type)}</Badge>
                      {!notification.read && <Badge>Nouveau</Badge>}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(notification.created_at), "d MMM yyyy à HH:mm", { locale: fr })}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="text-lg font-semibold mb-1">{notification.title}</h3>
                  <p className="text-muted-foreground">{notification.message}</p>

                  {notification.metadata && Object.keys(notification.metadata).length > 0 && (
                    <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <pre className="text-xs text-muted-foreground overflow-auto">
                        {JSON.stringify(notification.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button variant="link" size="sm" asChild>
                    <a href="#">Voir les détails</a>
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
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Aucune notification</p>
                <p className="text-muted-foreground">Vous n&aposavez pas de notifications dans cette catégorie</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}