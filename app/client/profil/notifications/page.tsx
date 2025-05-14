"use client"

import { useRouter } from "next/navigation"
import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Bell, Check } from "lucide-react"
import { withAuth } from "@/components/withAuth"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useNotifications } from "@/hooks/useNotifications"
import { Skeleton } from "@/components/ui/skeleton"

const FILTER_OPTIONS = ["all", "unread", "promotion", "reservation", "reminder", "new_feature", "info", "alert"] as const

const NotificationClient = () => {
  const router = useRouter()
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    // markAllAsRead,
    refresh
  } = useNotifications()
  const [filter, setFilter] = useState<typeof FILTER_OPTIONS[number]>("all")
  const [localError, setLocalError] = useState<string | null>(null)

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      if (filter === "all") return true
      if (filter === "unread") return !notification.read
      return notification.notification_type === filter
    })
  }, [notifications, filter])

  const getTypeLabel = (type: string): string => {
    const typeLabels: Record<string, string> = {
      promotion: "Promotion",
      reservation: "Réservation",
      reminder: "Rappel",
      new_feature: "Nouveauté",
      info: "Information",
      alert: "Alerte"
    }
    return typeLabels[type] || type
  }

  const getTypeBadge = (type: string) => {
    const variantClasses: Record<string, string> = {
      promotion: "bg-purple-500 hover:bg-purple-600",
      reservation: "bg-blue-500 hover:bg-blue-600",
      reminder: "bg-yellow-500 hover:bg-yellow-600",
      new_feature: "bg-green-500 hover:bg-green-600",
      info: "bg-gray-500 hover:bg-gray-600",
      alert: "bg-red-500 hover:bg-red-600"
    }
    return (
      <Badge className={variantClasses[type] || ""}>
        {getTypeLabel(type)}
      </Badge>
    )
  }

  const handleRefresh = () => {
    refresh()
    setFilter("all")
    setLocalError(null)
  }

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead({ id })
      setLocalError(null)
    } catch (err) {
      console.log(err);

      setLocalError("Échec de la mise à jour de la notification")
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(notification => !notification.read)
      for (const notification of unreadNotifications) {
        await markAsRead({ id: notification.id })
      }
      setLocalError(null)
    } catch (err) {
      console.log(err);
      setLocalError("Échec de la mise à jour des notifications")
    }
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-red-500">Erreur lors du chargement des notifications</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={handleRefresh}
            >
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {localError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {localError}
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setLocalError(null)}
          >
            ×
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mr-4"
            aria-label="Retour"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour
          </Button>
          <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">
            Mes Notifications
          </h1>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
        >
          Actualiser
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center">
          <Bell className="mr-2 h-5 w-5 text-green-500" />
          {loading ? (
            <Skeleton className="h-6 w-32" />
          ) : (
            <span className="text-lg font-medium">
              {unreadCount} notification{unreadCount !== 1 ? "s" : ""} non lue{unreadCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((filterType) => (
            <Button
              key={filterType}
              variant={filter === filterType ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(filterType)}
              disabled={loading}
              aria-label={`Filtrer par ${filterType}`}
            >
              {filterType === "all" ? "Toutes" :
                filterType === "unread" ? "Non lues" :
                  getTypeLabel(filterType)}
            </Button>
          ))}

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={loading || unreadCount === 0}
              aria-label="Marquer toutes comme lues"
            >
              <Check className="mr-1 h-4 w-4" />
              Tout marquer comme lu
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={`skeleton-${i}`}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredNotifications.length > 0 ? (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`hover:shadow-md transition-shadow ${!notification.read ? "border-l-4 border-l-teal-500 bg-teal-50/50 dark:bg-teal-900/20" : ""}`}
              aria-labelledby={`notification-${notification.id}-title`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex flex-col">
                    <CardTitle
                      id={`notification-${notification.id}-title`}
                      className="text-lg"
                    >
                      {notification.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(notification.created_at), "d MMMM yyyy à HH:mm", { locale: fr })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {getTypeBadge(notification.notification_type)}
                    {!notification.read && (
                      <Badge variant="outline" aria-hidden="true">
                        Nouveau
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{notification.message}</p>
                <div className="flex justify-end mt-4">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsRead(notification.id)}
                      aria-label={`Marquer comme lue: ${notification.title}`}
                    >
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
        <Card aria-live="polite">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Aucune notification</p>
            <p className="text-muted-foreground text-center">
              {filter === "all"
                ? "Vous n'avez pas encore reçu de notifications."
                : filter === "unread"
                  ? "Vous n'avez pas de notifications non lues."
                  : `Vous n'avez pas de notifications de type "${getTypeLabel(filter)}".`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default withAuth(NotificationClient)