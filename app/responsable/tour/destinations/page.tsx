"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DestinationService } from "@/services/service-destinations"
import { Destination } from "@/types/Destinations"
import { DestinationCard } from "@/components/DestinationCard"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, PlusCircle, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toastx"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { useAuth } from "@/hooks/useAuth"

export default function DestinationsPage() {
  const router = useRouter()
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { token } = useAuth()

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await DestinationService.getDestinations()
        setDestinations(data)
        setLoading(false)
      } catch (err) {
        setError("Erreur lors de la récupération des destinations")
        setLoading(false)
        console.error(err)
      }
    }

    fetchDestinations()
  }, [])

  const handleCardClick = (destination: Destination) => {
    setSelectedDestination(destination)
  }

  const handleCreateDestination = () => {
    router.push("destinations/ajouter")
  }

  const handleEditDestination = () => {
    if (selectedDestination) {
      router.push(`destinations/${selectedDestination.id}/modifier`)
    }
  }

  const handleDeleteDestination = async () => {
    if (!selectedDestination) return

    setIsDeleting(true)
    try {
      if (token) {
        await DestinationService.deleteDestination(selectedDestination.id, token)
      } else {
        throw new Error("Token is required for this operation")
      }
      toast({
        title: "Succès",
        description: "Destination supprimée avec succès",
        variant: "default",
        createdAt: Date.now()
      })
      setDestinations(destinations.filter(d => d.id !== selectedDestination.id))
      setSelectedDestination(null)
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Échec de la suppression de la destination",
        variant: "destructive",
        createdAt: Date.now()
      })
      console.error(err)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des Destinations</h1>
        <Button onClick={handleCreateDestination}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Ajouter une destination
        </Button>
      </div>

      {error && (
        <div className="text-red-500 p-4 rounded-md bg-red-50 dark:bg-red-900/20">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Liste des destinations */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Destinations ({destinations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
              </div>
            ) : destinations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucune destination disponible
              </div>
            ) : (
              <ScrollArea className="h-[600px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {destinations.map((destination) => (
                    <DestinationCard
                      key={destination.id}
                      destination={destination}
                      selected={selectedDestination?.id === destination.id}
                      onClick={() => handleCardClick(destination)}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Détails de la destination sélectionnée */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                {selectedDestination ? (
                  <>
                    {selectedDestination.nom}
                    <Badge variant="outline" className="ml-2">
                      ID: {selectedDestination.id}
                    </Badge>
                  </>
                ) : (
                  "Sélectionnez une destination"
                )}
              </CardTitle>
              {selectedDestination && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditDestination}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                  <ConfirmDialog
                    title="Confirmer la suppression"
                    description={`Êtes-vous sûr de vouloir supprimer la destination "${selectedDestination.nom}" ?`}
                    onConfirm={handleDeleteDestination}
                  >
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {isDeleting ? "Suppression..." : "Supprimer"}
                    </Button>
                  </ConfirmDialog>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedDestination ? (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{selectedDestination.pays}</span>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">
                    {selectedDestination.description || "Aucune description disponible"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nombre de voyages</p>
                    <p>{selectedDestination.voyages_ids?.length || 0}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Coordonnées GPS</h3>
                  <div className="flex gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Latitude</p>
                      <p>{selectedDestination.latitude}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Longitude</p>
                      <p>{selectedDestination.longitude}</p>
                    </div>
                  </div>
                </div>

                {selectedDestination.voyages_ids && selectedDestination.voyages_ids.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Voyages associé</h3>
                    <div className="space-y-2">
                      {selectedDestination.voyages_ids.slice(0, 3).map((voyage) => (
                        <div
                          key={voyage.id}
                          className="p-3 border rounded-md cursor-pointer hover:bg-muted"
                          onClick={() => router.push(`/voyages/${voyage.id}`)}
                        >
                          <p className="font-medium">{voyage.titre}</p>
                          <p className="text-sm text-muted-foreground">
                            {voyage.prix} €
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                <MapPin className="h-12 w-12 mb-4" />
                <p>Sélectionnez une destination pour voir les détails</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}