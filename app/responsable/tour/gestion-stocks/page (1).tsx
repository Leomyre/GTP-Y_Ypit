"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, RefreshCw, AlertTriangle, CheckCircle2, XCircle, Clock } from "lucide-react"
import { useToast } from "@/components/ui/use-toastx"

// Types pour les disponibilités
type Disponibilite = {
  id: string
  voyageId: string
  voyageNom: string
  dateDepart: Date
  dateRetour: Date
  capaciteMax: number
  placesDisponibles: number
  statut: "disponible" | "presque_complet" | "complet" | "en_attente"
  derniereSynchro: Date
  partenaires: {
    id: string
    nom: string
    type: "hotel" | "vol" | "activite"
    disponible: boolean
    quantite: number
    derniereSynchro: Date
  }[]
}

// Données fictives pour les disponibilités
const disponibilitesInitiales: Disponibilite[] = [
  {
    id: "disp1",
    voyageId: "voyage1",
    voyageNom: "Paris - Week-end romantique",
    dateDepart: new Date(2023, 11, 15),
    dateRetour: new Date(2023, 11, 17),
    capaciteMax: 20,
    placesDisponibles: 5,
    statut: "presque_complet",
    derniereSynchro: new Date(2023, 10, 30, 14, 25),
    partenaires: [
      {
        id: "part1",
        nom: "Hôtel Le Meurice",
        type: "hotel",
        disponible: true,
        quantite: 5,
        derniereSynchro: new Date(2023, 10, 30, 14, 25),
      },
      {
        id: "part2",
        nom: "Air France",
        type: "vol",
        disponible: true,
        quantite: 8,
        derniereSynchro: new Date(2023, 10, 30, 14, 20),
      },
    ],
  },
  {
    id: "disp2",
    voyageId: "voyage2",
    voyageNom: "Rome - Découverte culturelle",
    dateDepart: new Date(2023, 11, 20),
    dateRetour: new Date(2023, 11, 27),
    capaciteMax: 15,
    placesDisponibles: 0,
    statut: "complet",
    derniereSynchro: new Date(2023, 10, 30, 15, 10),
    partenaires: [
      {
        id: "part3",
        nom: "Hôtel de Russie",
        type: "hotel",
        disponible: false,
        quantite: 0,
        derniereSynchro: new Date(2023, 10, 30, 15, 10),
      },
      {
        id: "part4",
        nom: "Alitalia",
        type: "vol",
        disponible: true,
        quantite: 2,
        derniereSynchro: new Date(2023, 10, 30, 15, 05),
      },
    ],
  },
  {
    id: "disp3",
    voyageId: "voyage3",
    voyageNom: "Barcelone - City break",
    dateDepart: new Date(2023, 12, 5),
    dateRetour: new Date(2023, 12, 8),
    capaciteMax: 25,
    placesDisponibles: 25,
    statut: "disponible",
    derniereSynchro: new Date(2023, 10, 30, 16, 00),
    partenaires: [
      {
        id: "part5",
        nom: "Hôtel Arts Barcelona",
        type: "hotel",
        disponible: true,
        quantite: 25,
        derniereSynchro: new Date(2023, 10, 30, 16, 00),
      },
      {
        id: "part6",
        nom: "Vueling",
        type: "vol",
        disponible: true,
        quantite: 30,
        derniereSynchro: new Date(2023, 10, 30, 15, 55),
      },
    ],
  },
  {
    id: "disp4",
    voyageId: "voyage4",
    voyageNom: "New York - Shopping et découverte",
    dateDepart: new Date(2024, 0, 10),
    dateRetour: new Date(2024, 0, 17),
    capaciteMax: 18,
    placesDisponibles: 12,
    statut: "disponible",
    derniereSynchro: new Date(2023, 10, 30, 16, 30),
    partenaires: [
      {
        id: "part7",
        nom: "The Plaza Hotel",
        type: "hotel",
        disponible: true,
        quantite: 15,
        derniereSynchro: new Date(2023, 10, 30, 16, 30),
      },
      {
        id: "part8",
        nom: "Delta Airlines",
        type: "vol",
        disponible: true,
        quantite: 12,
        derniereSynchro: new Date(2023, 10, 30, 16, 25),
      },
    ],
  },
  {
    id: "disp5",
    voyageId: "voyage5",
    voyageNom: "Tokyo - Immersion culturelle",
    dateDepart: new Date(2024, 1, 5),
    dateRetour: new Date(2024, 1, 15),
    capaciteMax: 12,
    placesDisponibles: 3,
    statut: "presque_complet",
    derniereSynchro: new Date(2023, 10, 30, 17, 00),
    partenaires: [
      {
        id: "part9",
        nom: "Park Hyatt Tokyo",
        type: "hotel",
        disponible: true,
        quantite: 3,
        derniereSynchro: new Date(2023, 10, 30, 17, 00),
      },
      {
        id: "part10",
        nom: "Japan Airlines",
        type: "vol",
        disponible: true,
        quantite: 5,
        derniereSynchro: new Date(2023, 10, 30, 16, 55),
      },
    ],
  },
]

export default function GestionStocks() {
  const [disponibilites, setDisponibilites] = useState<Disponibilite[]>(disponibilitesInitiales)
  const [filtreStatut, setFiltreStatut] = useState<string>("tous")
  const [filtreDate, setFiltreDate] = useState<Date | undefined>(undefined)
  const [disponibiliteSelectionnee, setDisponibiliteSelectionnee] = useState<Disponibilite | null>(null)
  const [syncEnCours, setSyncEnCours] = useState(false)
  const { toast } = useToast()

  // Filtrer les disponibilités en fonction des critères
  const disponibilitesFiltrees = disponibilites.filter((dispo) => {
    // Filtre par statut
    if (filtreStatut !== "tous" && dispo.statut !== filtreStatut) {
      return false
    }

    // Filtre par date
    if (
      filtreDate &&
      (dispo.dateDepart.getTime() < filtreDate.getTime() ||
        dispo.dateRetour.getTime() > new Date(filtreDate.getTime() + 7 * 24 * 60 * 60 * 1000).getTime())
    ) {
      return false
    }

    return true
  })

  // Fonction pour synchroniser les disponibilités avec les partenaires
  const synchroniserDisponibilites = (disponibiliteId?: string) => {
    setSyncEnCours(true)

    // Simuler une synchronisation avec un délai
    setTimeout(() => {
      setDisponibilites((prev) => {
        return prev.map((dispo) => {
          // Si un ID spécifique est fourni, ne synchroniser que cette disponibilité
          if (disponibiliteId && dispo.id !== disponibiliteId) {
            return dispo
          }

          // Mettre à jour la date de dernière synchronisation
          const nouvelleDispo = {
            ...dispo,
            derniereSynchro: new Date(),
            partenaires: dispo.partenaires.map((part) => ({
              ...part,
              derniereSynchro: new Date(),
            })),
          }

          return nouvelleDispo
        })
      })

      setSyncEnCours(false)

      toast({
        title: "Synchronisation réussie",
        description: "Les disponibilités ont été mises à jour avec succès.",
        variant: "default",
      })
    }, 2000)
  }

  // Fonction pour mettre à jour les places disponibles
  const mettreAJourPlacesDisponibles = (id: string, nouvellePlaces: number) => {
    setDisponibilites((prev) => {
      return prev.map((dispo) => {
        if (dispo.id === id) {
          // Calculer le nouveau statut en fonction des places disponibles
          let nouveauStatut: Disponibilite["statut"] = "disponible"
          if (nouvellePlaces === 0) {
            nouveauStatut = "complet"
          } else if (nouvellePlaces <= dispo.capaciteMax * 0.2) {
            nouveauStatut = "presque_complet"
          }

          return {
            ...dispo,
            placesDisponibles: nouvellePlaces,
            statut: nouveauStatut,
          }
        }
        return dispo
      })
    })

    toast({
      title: "Mise à jour réussie",
      description: "Les places disponibles ont été mises à jour.",
      variant: "default",
    })
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des stocks et disponibilités</h1>
        <Button onClick={() => synchroniserDisponibilites()} disabled={syncEnCours} className="flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${syncEnCours ? "animate-spin" : ""}`} />
          Synchroniser avec les partenaires
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <CardDescription>Filtrer les disponibilités par statut et date</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3">
            <Label htmlFor="statut">Statut</Label>
            <Select value={filtreStatut} onValueChange={setFiltreStatut}>
              <SelectTrigger id="statut">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les statuts</SelectItem>
                <SelectItem value="disponible">Disponible</SelectItem>
                <SelectItem value="presque_complet">Presque complet</SelectItem>
                <SelectItem value="complet">Complet</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-1/3">
            <Label htmlFor="date">Date de départ (à partir de)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal" id="date">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filtreDate ? format(filtreDate, "PPP", { locale: fr }) : <span>Sélectionner une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={filtreDate} onSelect={setFiltreDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="w-full md:w-1/3 flex items-end">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setFiltreStatut("tous")
                setFiltreDate(undefined)
              }}
            >
              Réinitialiser les filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des disponibilités</CardTitle>
          <CardDescription>{disponibilitesFiltrees.length} disponibilité(s) trouvée(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Voyage</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Capacité</TableHead>
                <TableHead>Places disponibles</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière synchro</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disponibilitesFiltrees.map((dispo) => (
                <TableRow key={dispo.id}>
                  <TableCell className="font-medium">{dispo.voyageNom}</TableCell>
                  <TableCell>
                    {format(dispo.dateDepart, "dd/MM/yyyy")} - {format(dispo.dateRetour, "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>{dispo.capaciteMax}</TableCell>
                  <TableCell>{dispo.placesDisponibles}</TableCell>
                  <TableCell>
                    {dispo.statut === "disponible" && (
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        Disponible
                      </Badge>
                    )}
                    {dispo.statut === "presque_complet" && (
                      <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                      >
                        <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                        Presque complet
                      </Badge>
                    )}
                    {dispo.statut === "complet" && (
                      <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                        <XCircle className="h-3.5 w-3.5 mr-1" />
                        Complet
                      </Badge>
                    )}
                    {dispo.statut === "en_attente" && (
                      <Badge
                        variant="outline"
                        className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                      >
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        En attente
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{format(dispo.derniereSynchro, "dd/MM/yyyy HH:mm")}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setDisponibiliteSelectionnee(dispo)}>
                        Détails
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => synchroniserDisponibilites(dispo.id)}
                        disabled={syncEnCours}
                      >
                        <RefreshCw className={`h-4 w-4 ${syncEnCours ? "animate-spin" : ""}`} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {disponibilitesFiltrees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Aucune disponibilité ne correspond aux critères de filtrage.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {disponibiliteSelectionnee && (
        <Card>
          <CardHeader>
            <CardTitle>Détails de la disponibilité - {disponibiliteSelectionnee.voyageNom}</CardTitle>
            <CardDescription>
              Du {format(disponibiliteSelectionnee.dateDepart, "dd/MM/yyyy")} au{" "}
              {format(disponibiliteSelectionnee.dateRetour, "dd/MM/yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Gestion des places</h3>
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="w-full md:w-1/2">
                  <Label htmlFor="places-slider">
                    Places disponibles: {disponibiliteSelectionnee.placesDisponibles} /{" "}
                    {disponibiliteSelectionnee.capaciteMax}
                  </Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      id="places-slider"
                      defaultValue={[disponibiliteSelectionnee.placesDisponibles]}
                      max={disponibiliteSelectionnee.capaciteMax}
                      step={1}
                      onValueChange={(value) => {
                        setDisponibiliteSelectionnee({
                          ...disponibiliteSelectionnee,
                          placesDisponibles: value[0],
                        })
                      }}
                    />
                    <Input
                      type="number"
                      value={disponibiliteSelectionnee.placesDisponibles}
                      onChange={(e) => {
                        const value = Number.parseInt(e.target.value)
                        if (!isNaN(value) && value >= 0 && value <= disponibiliteSelectionnee.capaciteMax) {
                          setDisponibiliteSelectionnee({
                            ...disponibiliteSelectionnee,
                            placesDisponibles: value,
                          })
                        }
                      }}
                      className="w-20"
                      min={0}
                      max={disponibiliteSelectionnee.capaciteMax}
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/2 flex justify-end">
                  <Button
                    onClick={() =>
                      mettreAJourPlacesDisponibles(
                        disponibiliteSelectionnee.id,
                        disponibiliteSelectionnee.placesDisponibles,
                      )
                    }
                  >
                    Mettre à jour les places
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Partenaires</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Partenaire</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Disponibilité</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Dernière synchro</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disponibiliteSelectionnee.partenaires.map((partenaire) => (
                    <TableRow key={partenaire.id}>
                      <TableCell className="font-medium">{partenaire.nom}</TableCell>
                      <TableCell>
                        {partenaire.type === "hotel" && "Hôtel"}
                        {partenaire.type === "vol" && "Vol"}
                        {partenaire.type === "activite" && "Activité"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={partenaire.disponible}
                            onCheckedChange={(checked) => {
                              setDisponibiliteSelectionnee({
                                ...disponibiliteSelectionnee,
                                partenaires: disponibiliteSelectionnee.partenaires.map((p) =>
                                  p.id === partenaire.id ? { ...p, disponible: checked } : p,
                                ),
                              })
                            }}
                          />
                          <span>{partenaire.disponible ? "Disponible" : "Non disponible"}</span>
                        </div>
                      </TableCell>
                      <TableCell>{partenaire.quantite}</TableCell>
                      <TableCell>{format(partenaire.derniereSynchro, "dd/MM/yyyy HH:mm")}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Simuler une synchronisation avec ce partenaire spécifique
                            setSyncEnCours(true)
                            setTimeout(() => {
                              setDisponibiliteSelectionnee({
                                ...disponibiliteSelectionnee,
                                partenaires: disponibiliteSelectionnee.partenaires.map((p) =>
                                  p.id === partenaire.id ? { ...p, derniereSynchro: new Date() } : p,
                                ),
                              })
                              setSyncEnCours(false)
                              toast({
                                title: "Synchronisation réussie",
                                description: `Synchronisation avec ${partenaire.nom} effectuée avec succès.`,
                                variant: "default",
                              })
                            }, 1500)
                          }}
                          disabled={syncEnCours}
                        >
                          <RefreshCw className={`h-4 w-4 ${syncEnCours ? "animate-spin" : ""}`} />
                          <span className="ml-2">Synchroniser</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setDisponibiliteSelectionnee(null)}>
              Fermer
            </Button>
            <Button
              onClick={() => {
                // Simuler une mise à jour complète
                toast({
                  title: "Mise à jour réussie",
                  description: "Toutes les modifications ont été enregistrées.",
                  variant: "default",
                })
                setDisponibiliteSelectionnee(null)
              }}
            >
              Enregistrer toutes les modifications
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

