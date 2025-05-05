"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Star, Check, X, MapPin, Calendar, Users, Clock } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

// Données statiques pour l'exemple (à remplacer par un appel API réel)
const voyages = [
  {
    id: 1,
    nom: "Séjour de luxe à Paris",
    ville_depart: "Lyon",
    ville_arrive: "Paris",
    date_depart: "2025-03-15",
    date_arrive_prevu: "2025-03-20",
    prix: 1200,
    places_disponibles: 5,
    image: "/images/paris.jpg",
    agence_nom: "Voyages Extraordinaires",
    etoiles: 5,
    likes: 80,
    description: "Profitez d'un séjour inoubliable dans la ville de l'amour.",
    inclus: ["Hôtel 5 étoiles", "Petit-déjeuner", "Visite guidée", "Croisière sur la Seine"],
    duree: 5,
    wifi: true,
    transfert_aeroport: true,
    guide_francophone: true,
    pension_complete: false,
  },
  {
    id: 2,
    nom: "Aventure à Bali",
    ville_depart: "Paris",
    ville_arrive: "Bali",
    date_depart: "2025-04-01",
    date_arrive_prevu: "2025-04-11",
    prix: 1800,
    places_disponibles: 8,
    image: "/images/bali.jpg",
    agence_nom: "Évasion Tropicale",
    etoiles: 4,
    likes: 65,
    description: "Découvrez la beauté exotique de Bali, ses plages paradisiaques et ses temples sacrés.",
    inclus: ["Hôtel 4 étoiles", "Petit-déjeuner", "Excursions guidées", "Transferts aéroport"],
    duree: 10,
    wifi: true,
    transfert_aeroport: true,
    guide_francophone: false,
    pension_complete: false,
  },
  {
    id: 4,
    nom: "Safari au Kenya",
    ville_depart: "Paris",
    ville_arrive: "Nairobi",
    date_depart: "2025-06-10",
    date_arrive_prevu: "2025-06-18",
    prix: 2200,
    places_disponibles: 12,
    image: "/images/kenya.jpg",
    agence_nom: "Aventures Sauvages",
    etoiles: 5,
    likes: 88,
    description: "Partez à la découverte de la faune africaine lors d'un safari inoubliable.",
    inclus: ["Lodge de luxe", "Pension complète", "Safari guidé", "Transferts 4x4"],
    duree: 8,
    wifi: false,
    transfert_aeroport: true,
    guide_francophone: true,
    pension_complete: true,
  },
  {
    id: 6,
    nom: "Escapade à Tokyo",
    ville_depart: "Paris",
    ville_arrive: "Tokyo",
    date_depart: "2025-09-15",
    date_arrive_prevu: "2025-09-25",
    prix: 2500,
    places_disponibles: 10,
    image: "/images/tokyo.jpg",
    agence_nom: "Découvertes Asiatiques",
    etoiles: 5,
    likes: 95,
    description: "Immergez-vous dans la culture japonaise et découvrez Tokyo.",
    inclus: ["Hôtel 4 étoiles", "Petit-déjeuner", "Pass transport", "Guide francophone"],
    duree: 10,
    wifi: true,
    transfert_aeroport: true,
    guide_francophone: true,
    pension_complete: false,
  },
]

export default function ComparaisonVoyages() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedVoyages, setSelectedVoyages] = useState<number[]>([])
  const [availableVoyages, setAvailableVoyages] = useState(voyages)

  useEffect(() => {
    // Récupérer les IDs des voyages à comparer depuis l'URL
    const ids = searchParams.get("ids")
    if (ids) {
      const idArray = ids.split(",").map(Number)
      setSelectedVoyages(idArray)
    }
  }, [searchParams])

  const handleAddVoyage = (id: string) => {
    const numId = Number(id)
    if (!selectedVoyages.includes(numId) && selectedVoyages.length < 3) {
      setSelectedVoyages([...selectedVoyages, numId])
    }
  }

  const handleRemoveVoyage = (id: number) => {
    setSelectedVoyages(selectedVoyages.filter((voyageId) => voyageId !== id))
  }

  const getVoyageById = (id: number) => {
    return voyages.find((voyage) => voyage.id === id)
  }

  const voyagesToCompare = selectedVoyages.map(getVoyageById).filter(Boolean)

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
        <h1 className="text-3xl font-bold text-teal-600 dark:text-teal-400">Comparaison de voyages</h1>
      </div>

      {selectedVoyages.length < 3 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Ajouter un voyage à comparer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select onValueChange={handleAddVoyage}>
                <SelectTrigger className="w-full sm:w-[300px]">
                  <SelectValue placeholder="Sélectionner un voyage" />
                </SelectTrigger>
                <SelectContent>
                  {availableVoyages
                    .filter((voyage) => !selectedVoyages.includes(voyage.id))
                    .map((voyage) => (
                      <SelectItem key={voyage.id} value={voyage.id.toString()}>
                        {voyage.nom} - {voyage.ville_arrive}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Vous pouvez comparer jusqu'à 3 voyages simultanément.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {voyagesToCompare.length > 0 ? (
        <div className="overflow-x-auto">
          <Table className="border-collapse">
            <TableHeader>
              <TableRow>
                <TableHead className="w-40">Caractéristiques</TableHead>
                {voyagesToCompare.map((voyage) => (
                  <TableHead key={voyage?.id} className="w-60">
                    <div className="flex flex-col items-center">
                      <div className="relative w-full h-32 mb-2">
                        <Image
                          src={voyage?.image || "/placeholder.svg"}
                          alt={voyage?.nom || ""}
                          fill
                          className="object-cover rounded-md"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 rounded-full"
                          onClick={() => handleRemoveVoyage(voyage?.id || 0)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <h3 className="font-bold text-center">{voyage?.nom}</h3>
                      <div className="flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="text-xs">{voyage?.ville_arrive}</span>
                      </div>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Prix</TableCell>
                {voyagesToCompare.map((voyage) => (
                  <TableCell key={`${voyage?.id}-prix`} className="text-center">
                    <span className="font-bold text-lg text-teal-600 dark:text-teal-400">{voyage?.prix} €</span>
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Durée</TableCell>
                {voyagesToCompare.map((voyage) => (
                  <TableCell key={`${voyage?.id}-duree`} className="text-center">
                    <div className="flex items-center justify-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                      {voyage?.duree} jours
                    </div>
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Date de départ</TableCell>
                {voyagesToCompare.map((voyage) => (
                  <TableCell key={`${voyage?.id}-depart`} className="text-center">
                    <div className="flex items-center justify-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      {format(new Date(voyage?.date_depart || ""), "d MMM yyyy", { locale: fr })}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Ville de départ</TableCell>
                {voyagesToCompare.map((voyage) => (
                  <TableCell key={`${voyage?.id}-ville-depart`} className="text-center">
                    {voyage?.ville_depart}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Places disponibles</TableCell>
                {voyagesToCompare.map((voyage) => (
                  <TableCell key={`${voyage?.id}-places`} className="text-center">
                    <div className="flex items-center justify-center">
                      <Users className="h-4 w-4 mr-1 text-gray-500" />
                      {voyage?.places_disponibles}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Note</TableCell>
                {voyagesToCompare.map((voyage) => (
                  <TableCell key={`${voyage?.id}-note`} className="text-center">
                    <div className="flex items-center justify-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < (voyage?.etoiles || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-sm">({voyage?.likes})</span>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Agence</TableCell>
                {voyagesToCompare.map((voyage) => (
                  <TableCell key={`${voyage?.id}-agence`} className="text-center">
                    {voyage?.agence_nom}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Wi-Fi</TableCell>
                {voyagesToCompare.map((voyage) => (
                  <TableCell key={`${voyage?.id}-wifi`} className="text-center">
                    {voyage?.wifi ? (
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    )}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Transfert aéroport</TableCell>
                {voyagesToCompare.map((voyage) => (
                  <TableCell key={`${voyage?.id}-transfert`} className="text-center">
                    {voyage?.transfert_aeroport ? (
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    )}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Guide francophone</TableCell>
                {voyagesToCompare.map((voyage) => (
                  <TableCell key={`${voyage?.id}-guide`} className="text-center">
                    {voyage?.guide_francophone ? (
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    )}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Pension complète</TableCell>
                {voyagesToCompare.map((voyage) => (
                  <TableCell key={`${voyage?.id}-pension`} className="text-center">
                    {voyage?.pension_complete ? (
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    )}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Inclus</TableCell>
                {voyagesToCompare.map((voyage) => (
                  <TableCell key={`${voyage?.id}-inclus`} className="text-center">
                    <ul className="list-disc list-inside text-left text-sm">
                      {voyage?.inclus.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Actions</TableCell>
                {voyagesToCompare.map((voyage) => (
                  <TableCell key={`${voyage?.id}-actions`} className="text-center">
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => router.push(`/client/voyage/${voyage?.id}`)}
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        Voir les détails
                      </Button>
                      <Button onClick={() => router.push(`/client/paiement?voyageId=${voyage?.id}`)} variant="outline">
                        Réserver
                      </Button>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg font-medium mb-4">Aucun voyage sélectionné pour la comparaison</p>
            <p className="text-muted-foreground mb-6 text-center">
              Veuillez sélectionner au moins un voyage pour commencer la comparaison.
            </p>
            <Button onClick={() => router.push("/client/accueil")}>Parcourir les voyages</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

