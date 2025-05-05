"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Search, Navigation, X, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Map from "@/components/Map"
import { toast } from "@/components/ui/use-toastx"
import { DestinationService } from "@/services/service-destinations"
import { Destination } from "@/types/Destinations"
import { VoyageCard } from "@/components/VoyageCard"
import { DestinationCard } from "@/components/DestinationCard"
import { ScrollArea } from "@/components/ui/scroll-area"

// Fonction utilitaire pour calculer la distance
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

const MapListener = ({ onCoordinatesSelected }: { onCoordinatesSelected: (lat: number, lng: number) => void }) => {
  useEffect(() => {
    const handleMapClick = (e: CustomEvent) => {
      const { lat, lng } = e.detail
      onCoordinatesSelected(lat, lng)
    }

    window.addEventListener("map-click" as any, handleMapClick)
    return () => window.removeEventListener("map-click" as any, handleMapClick)
  }, [onCoordinatesSelected])

  return null
}

export default function CarteDestinations() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState([0, 3000])
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [searchRadius, setSearchRadius] = useState(500)
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [selectedVoyages, setSelectedVoyages] = useState<Destination['voyages_ids'] | null>(null)
  const [showVoyagesModal, setShowVoyagesModal] = useState(false)
  const [loading, setLoading] = useState(true)

  // Chargement initial des destinations
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await DestinationService.getDestinations()
        console.log(data);

        setDestinations(data)
      } catch (err) {
        console.error("Erreur lors du chargement des destinations:", err)
        toast({
          title: "Erreur",
          description: "Impossible de charger les destinations",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    fetchDestinations()
  }, [])

  const filteredDestinations = useMemo(() => {
    return destinations.filter(dest => {
      try {
        // Filtre texte
        const searchMatch = !searchTerm ||
          [dest.nom, dest.pays].some(
            field => field?.toLowerCase().includes(searchTerm.toLowerCase())
          );

        // Filtre prix - Nouvelle logique
        const hasValidVoyage = dest.voyages_ids?.some(v => {
          const prix = typeof v.prix === 'number' ? v.prix : parseFloat(v.prix || '0');
          return !isNaN(prix) && prix >= priceRange[0] && prix <= priceRange[1];
        });

        // On garde la destination si:
        // 1. Elle match le texte de recherche ET
        // 2. Elle a au moins un voyage dans la fourchette OU elle n'a pas de voyages
        return searchMatch && (hasValidVoyage || !dest.voyages_ids?.length);
      } catch (error) {
        console.error("Error filtering destination:", dest, error);
        return false;
      }
    });
  }, [searchTerm, priceRange, destinations]);

  // Destinations à proximité
  const nearbyDestinations = useMemo(() => {
    if (!selectedCoordinates) return []

    return destinations
      .filter((dest) => calculateDistance(
        selectedCoordinates.lat,
        selectedCoordinates.lng,
        dest.latitude,
        dest.longitude
      ) <= searchRadius)
      .sort((a, b) =>
        calculateDistance(selectedCoordinates.lat, selectedCoordinates.lng, a.latitude, a.longitude) -
        calculateDistance(selectedCoordinates.lat, selectedCoordinates.lng, b.latitude, b.longitude)
      )
  }, [selectedCoordinates, searchRadius, destinations])

  // Gestion de la sélection sur la carte
  const handleCoordinatesSelected = useCallback((lat: number, lng: number) => {
    setSelectedCoordinates({ lat, lng })
    if (nearbyDestinations.length > 0) {
      toast({
        title: "Destinations trouvées",
        description: `${nearbyDestinations.length} destination(s) dans un rayon de ${searchRadius} km`,
      })
    }
  }, [searchRadius, nearbyDestinations.length])

  // Affichage des voyages
  const handleShowVoyages = (destination: Destination) => {
    setSelectedVoyages(destination.voyages_ids || [])
    setShowVoyagesModal(true)
  }

  // Composant modal pour les voyages
  const VoyagesModal = ({ voyages, onClose }: { voyages: typeof selectedVoyages, onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] flex flex-col">
        <CardHeader className="flex-row justify-between items-center border-b">
          <CardTitle>Voyages disponibles ({voyages?.length || 0})</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <ScrollArea className="flex-1 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {voyages?.map((voyage) => (
              <VoyageCard
                key={voyage.id}
                voyage={{
                  ...voyage,
                  prix: voyage.prix.toString(),
                  destination_nom: voyage.destination_nom || "Destination inconnue"
                }}
              />
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-teal-600 dark:text-teal-400">Carte des destinations</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de filtres */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Filtres</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="search">Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="search"
                  placeholder="Destination ou pays..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Fourchette de prix (€)</Label>
              <Slider
                value={priceRange}
                min={0}
                max={3000}
                step={100}
                onValueChange={setPriceRange}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{priceRange[0]} €</span>
                <span>{priceRange[1]} €</span>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <Label>Rayon de recherche (km)</Label>
              <Slider
                value={[searchRadius]}
                min={100}
                max={2000}
                step={100}
                onValueChange={(value) => setSearchRadius(value[0])}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{searchRadius} km</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Cliquez sur la carte pour trouver des destinations dans ce rayon
              </p>
            </div>

            <div className="pt-2">
              <p className="text-sm text-muted-foreground">
                {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? "s" : ""} trouvée
                {filteredDestinations.length !== 1 ? "s" : ""}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Carte et résultats */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="p-4 pb-0">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Carte interactive</CardTitle>
                {selectedCoordinates && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Navigation className="h-3 w-3" />
                    {selectedCoordinates.lat.toFixed(4)}, {selectedCoordinates.lng.toFixed(4)}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <div className="h-[400px] bg-muted">
              <Map />
              <MapListener onCoordinatesSelected={handleCoordinatesSelected} />
            </div>
          </Card>

          {/* Destinations à proximité */}
          {selectedCoordinates && nearbyDestinations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Destinations à proximité ({nearbyDestinations.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {nearbyDestinations.slice(0, 4).map((destination) => (
                    <DestinationCard
                      key={`nearby-${destination.id}`}
                      destination={destination}
                      onShowVoyages={() => handleShowVoyages(destination)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Liste des destinations filtrées */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="h-[200px] animate-pulse" />
              ))}
            </div>
          ) : filteredDestinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredDestinations.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  onShowVoyages={() => handleShowVoyages(destination)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Aucune destination ne correspond à vos critères
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modal des voyages */}
      {showVoyagesModal && selectedVoyages && (
        <VoyagesModal
          voyages={selectedVoyages}
          onClose={() => setShowVoyagesModal(false)}
        />
      )}
    </div>
  )
}