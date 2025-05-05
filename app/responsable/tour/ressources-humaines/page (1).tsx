"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  CalendarIcon,
  Search,
  Plus,
  Star,
  MapPin,
  CalendarPlus2Icon as CalendarIcon2,
  Users,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

// Données simulées pour le personnel
const personnel = [
  {
    id: 1,
    nom: "Sophie Martin",
    role: "Guide touristique",
    specialites: ["Europe", "Histoire", "Art"],
    langues: ["Français", "Anglais", "Espagnol"],
    experience: "8 ans",
    note: 4.8,
    disponible: true,
    photo: "/placeholder.svg?height=40&width=40",
    prochainVoyage: "Paris Culturel (15/06/2023)",
  },
  {
    id: 2,
    nom: "Thomas Dubois",
    role: "Chauffeur",
    specialites: ["Europe", "Montagne"],
    langues: ["Français", "Anglais"],
    experience: "12 ans",
    note: 4.6,
    disponible: true,
    photo: "/placeholder.svg?height=40&width=40",
    prochainVoyage: "Alpes Suisses (22/06/2023)",
  },
  {
    id: 3,
    nom: "Emma Leroy",
    role: "Accompagnateur",
    specialites: ["Asie", "Gastronomie"],
    langues: ["Français", "Anglais", "Japonais"],
    experience: "5 ans",
    note: 4.9,
    disponible: false,
    photo: "/placeholder.svg?height=40&width=40",
    prochainVoyage: "Tokyo Découverte (En cours)",
  },
  {
    id: 4,
    nom: "Lucas Bernard",
    role: "Guide touristique",
    specialites: ["Amérique du Sud", "Nature", "Aventure"],
    langues: ["Français", "Anglais", "Portugais", "Espagnol"],
    experience: "7 ans",
    note: 4.7,
    disponible: true,
    photo: "/placeholder.svg?height=40&width=40",
    prochainVoyage: "Amazonie Aventure (10/07/2023)",
  },
  {
    id: 5,
    nom: "Camille Petit",
    role: "Accompagnateur",
    specialites: ["Afrique", "Safari", "Photographie"],
    langues: ["Français", "Anglais", "Swahili"],
    experience: "6 ans",
    note: 4.5,
    disponible: true,
    photo: "/placeholder.svg?height=40&width=40",
    prochainVoyage: "Kenya Safari (05/08/2023)",
  },
  {
    id: 6,
    nom: "Antoine Moreau",
    role: "Chauffeur",
    specialites: ["Europe", "Conduite sportive"],
    langues: ["Français", "Anglais", "Italien"],
    experience: "10 ans",
    note: 4.4,
    disponible: false,
    photo: "/placeholder.svg?height=40&width=40",
    prochainVoyage: "Côte Amalfitaine (En cours)",
  },
]

// Données simulées pour les voyages à venir
const voyagesAVenir = [
  {
    id: 101,
    titre: "Paris Culturel",
    destination: "France",
    dateDebut: "2023-06-15",
    dateFin: "2023-06-22",
    nbPersonnes: 12,
    statut: "Confirmé",
    personnel: {
      guide: { id: 1, nom: "Sophie Martin" },
      chauffeur: { id: 2, nom: "Thomas Dubois" },
      accompagnateur: null,
    },
  },
  {
    id: 102,
    titre: "Alpes Suisses",
    destination: "Suisse",
    dateDebut: "2023-06-22",
    dateFin: "2023-06-29",
    nbPersonnes: 8,
    statut: "Confirmé",
    personnel: {
      guide: null,
      chauffeur: { id: 2, nom: "Thomas Dubois" },
      accompagnateur: null,
    },
  },
  {
    id: 103,
    titre: "Amazonie Aventure",
    destination: "Brésil",
    dateDebut: "2023-07-10",
    dateFin: "2023-07-24",
    nbPersonnes: 6,
    statut: "En attente",
    personnel: {
      guide: { id: 4, nom: "Lucas Bernard" },
      chauffeur: null,
      accompagnateur: null,
    },
  },
  {
    id: 104,
    titre: "Kenya Safari",
    destination: "Kenya",
    dateDebut: "2023-08-05",
    dateFin: "2023-08-15",
    nbPersonnes: 10,
    statut: "En attente",
    personnel: {
      guide: null,
      chauffeur: null,
      accompagnateur: { id: 5, nom: "Camille Petit" },
    },
  },
  {
    id: 105,
    titre: "Tokyo Découverte",
    destination: "Japon",
    dateDebut: "2023-05-20",
    dateFin: "2023-06-03",
    nbPersonnes: 15,
    statut: "En cours",
    personnel: {
      guide: null,
      chauffeur: null,
      accompagnateur: { id: 3, nom: "Emma Leroy" },
    },
  },
  {
    id: 106,
    titre: "Côte Amalfitaine",
    destination: "Italie",
    dateDebut: "2023-05-25",
    dateFin: "2023-06-01",
    nbPersonnes: 8,
    statut: "En cours",
    personnel: {
      guide: null,
      chauffeur: { id: 6, nom: "Antoine Moreau" },
      accompagnateur: null,
    },
  },
]

export default function RessourcesHumainesPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("tous")
  const [disponibiliteFilter, setDisponibiliteFilter] = useState("tous")
  const [showAddPersonnel, setShowAddPersonnel] = useState(false)
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [selectedVoyage, setSelectedVoyage] = useState<any>(null)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  // Filtrer le personnel en fonction des critères
  const personnelFiltre = personnel.filter((p) => {
    const matchSearch =
      p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.specialites.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchRole = roleFilter === "tous" || p.role === roleFilter

    const matchDispo =
      disponibiliteFilter === "tous" ||
      (disponibiliteFilter === "disponible" && p.disponible) ||
      (disponibiliteFilter === "indisponible" && !p.disponible)

    return matchSearch && matchRole && matchDispo
  })

  // Ouvrir la boîte de dialogue d'attribution
  const openAssignDialog = (voyage: any, role: string) => {
    setSelectedVoyage(voyage)
    setSelectedRole(role)
    setShowAssignDialog(true)
  }

  // Filtrer le personnel disponible pour l'attribution
  const personnelDisponiblePourAttribution = personnel.filter((p) => {
    if (!selectedRole) return false

    // Vérifier si le rôle correspond
    const roleCorrespond =
      (selectedRole === "guide" && p.role === "Guide touristique") ||
      (selectedRole === "chauffeur" && p.role === "Chauffeur") ||
      (selectedRole === "accompagnateur" && p.role === "Accompagnateur")

    // Vérifier la disponibilité
    return p.disponible && roleCorrespond
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Ressources Humaines</h1>
          <p className="text-muted-foreground">Planifiez et attribuez le personnel pour vos voyages organisés</p>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: fr }) : <span>Sélectionner une date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
          <Button onClick={() => setShowAddPersonnel(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter personnel
          </Button>
        </div>
      </div>

      <Tabs defaultValue="personnel" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personnel" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Personnel
          </TabsTrigger>
          <TabsTrigger value="voyages" className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            Voyages à venir
          </TabsTrigger>
          <TabsTrigger value="planning" className="flex items-center">
            <CalendarIcon2 className="mr-2 h-4 w-4" />
            Planning
          </TabsTrigger>
          <TabsTrigger value="performances" className="flex items-center">
            <Star className="mr-2 h-4 w-4" />
            Performances
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personnel" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Liste du personnel</CardTitle>
              <CardDescription>Gérez votre équipe de guides, chauffeurs et accompagnateurs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, rôle ou spécialité..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrer par rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les rôles</SelectItem>
                      <SelectItem value="Guide touristique">Guides</SelectItem>
                      <SelectItem value="Chauffeur">Chauffeurs</SelectItem>
                      <SelectItem value="Accompagnateur">Accompagnateurs</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={disponibiliteFilter} onValueChange={setDisponibiliteFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrer par disponibilité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Toutes disponibilités</SelectItem>
                      <SelectItem value="disponible">Disponibles</SelectItem>
                      <SelectItem value="indisponible">Indisponibles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                {personnelFiltre.length > 0 ? (
                  personnelFiltre.map((personne) => (
                    <Card key={personne.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="flex items-center gap-4 p-4 md:w-1/3 lg:w-1/4 bg-muted/50">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={personne.photo} alt={personne.nom} />
                              <AvatarFallback>
                                {personne.nom
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{personne.nom}</p>
                              <p className="text-sm text-muted-foreground">{personne.role}</p>
                              <div className="flex items-center mt-1">
                                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                <span className="text-sm">{personne.note}/5</span>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm font-medium">Spécialités</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {personne.specialites.map((spec, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {spec}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Langues</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {personne.langues.map((langue, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {langue}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Expérience</p>
                                <p className="text-sm">{personne.experience}</p>
                              </div>
                            </div>
                            <div className="mt-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                              <div className="flex items-center">
                                <Badge variant={personne.disponible ? "success" : "destructive"} className="mr-2">
                                  {personne.disponible ? "Disponible" : "Indisponible"}
                                </Badge>
                                {!personne.disponible && (
                                  <span className="text-sm text-muted-foreground">{personne.prochainVoyage}</span>
                                )}
                              </div>
                              <div className="flex gap-2 mt-2 md:mt-0">
                                <Button variant="outline" size="sm">
                                  Voir profil
                                </Button>
                                <Button variant="outline" size="sm">
                                  Contacter
                                </Button>
                                <Button size="sm" disabled={!personne.disponible}>
                                  Assigner
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">Aucun personnel ne correspond à vos critères de recherche.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voyages" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Voyages à venir</CardTitle>
              <CardDescription>Attribuez le personnel aux voyages programmés</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {voyagesAVenir.map((voyage) => (
                  <Card key={voyage.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="p-4 md:w-1/3 lg:w-1/4 bg-muted/50">
                          <h3 className="font-medium">{voyage.titre}</h3>
                          <div className="flex items-center mt-1">
                            <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-sm">{voyage.destination}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <CalendarIcon2 className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-sm">
                              {format(new Date(voyage.dateDebut), "dd/MM/yyyy")} -{" "}
                              {format(new Date(voyage.dateFin), "dd/MM/yyyy")}
                            </span>
                          </div>
                          <div className="flex items-center mt-1">
                            <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-sm">{voyage.nbPersonnes} personnes</span>
                          </div>
                          <Badge
                            className="mt-2"
                            variant={
                              voyage.statut === "Confirmé"
                                ? "success"
                                : voyage.statut === "En cours"
                                  ? "default"
                                  : "outline"
                            }
                          >
                            {voyage.statut}
                          </Badge>
                        </div>
                        <div className="p-4 flex-1">
                          <h4 className="font-medium mb-3">Personnel assigné</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="bg-muted/30">
                              <CardHeader className="py-3 px-4">
                                <CardTitle className="text-sm font-medium">Guide touristique</CardTitle>
                              </CardHeader>
                              <CardContent className="py-3 px-4">
                                {voyage.personnel.guide ? (
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <Avatar className="h-8 w-8 mr-2">
                                        <AvatarFallback>
                                          {voyage.personnel.guide.nom
                                            .split(" ")
                                            .map((n: string) => n[0])
                                            .join("")}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span>{voyage.personnel.guide.nom}</span>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => openAssignDialog(voyage, "guide")}
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Assigner
                                  </Button>
                                )}
                              </CardContent>
                            </Card>

                            <Card className="bg-muted/30">
                              <CardHeader className="py-3 px-4">
                                <CardTitle className="text-sm font-medium">Chauffeur</CardTitle>
                              </CardHeader>
                              <CardContent className="py-3 px-4">
                                {voyage.personnel.chauffeur ? (
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <Avatar className="h-8 w-8 mr-2">
                                        <AvatarFallback>
                                          {voyage.personnel.chauffeur.nom
                                            .split(" ")
                                            .map((n: string) => n[0])
                                            .join("")}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span>{voyage.personnel.chauffeur.nom}</span>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => openAssignDialog(voyage, "chauffeur")}
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Assigner
                                  </Button>
                                )}
                              </CardContent>
                            </Card>

                            <Card className="bg-muted/30">
                              <CardHeader className="py-3 px-4">
                                <CardTitle className="text-sm font-medium">Accompagnateur</CardTitle>
                              </CardHeader>
                              <CardContent className="py-3 px-4">
                                {voyage.personnel.accompagnateur ? (
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <Avatar className="h-8 w-8 mr-2">
                                        <AvatarFallback>
                                          {voyage.personnel.accompagnateur.nom
                                            .split(" ")
                                            .map((n: string) => n[0])
                                            .join("")}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span>{voyage.personnel.accompagnateur.nom}</span>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => openAssignDialog(voyage, "accompagnateur")}
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Assigner
                                  </Button>
                                )}
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Planning du personnel</CardTitle>
              <CardDescription>Visualisez les affectations et disponibilités</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <p className="text-muted-foreground">Calendrier interactif en cours de développement.</p>
                <p className="text-muted-foreground">Cette fonctionnalité sera disponible prochainement.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performances" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Évaluation des performances</CardTitle>
              <CardDescription>Suivez les performances et la satisfaction client</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <p className="text-muted-foreground">Tableau de bord des performances en cours de développement.</p>
                <p className="text-muted-foreground">Cette fonctionnalité sera disponible prochainement.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Boîte de dialogue pour ajouter un nouveau membre du personnel */}
      <Dialog open={showAddPersonnel} onOpenChange={setShowAddPersonnel}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau membre du personnel</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour ajouter un nouveau guide, chauffeur ou accompagnateur.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom complet</Label>
                <Input id="nom" placeholder="Nom et prénom" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="guide">Guide touristique</SelectItem>
                    <SelectItem value="chauffeur">Chauffeur</SelectItem>
                    <SelectItem value="accompagnateur">Accompagnateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialites">Spécialités (séparées par des virgules)</Label>
              <Input id="specialites" placeholder="Ex: Europe, Histoire, Art" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="langues">Langues parlées (séparées par des virgules)</Label>
              <Input id="langues" placeholder="Ex: Français, Anglais, Espagnol" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experience">Expérience</Label>
                <Input id="experience" placeholder="Ex: 5 ans" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disponibilite">Disponibilité</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponible">Disponible</SelectItem>
                    <SelectItem value="indisponible">Indisponible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="photo">Photo de profil</Label>
              <Input id="photo" type="file" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes supplémentaires</Label>
              <Textarea id="notes" placeholder="Informations complémentaires..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddPersonnel(false)}>
              Annuler
            </Button>
            <Button type="submit">Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Boîte de dialogue pour assigner du personnel à un voyage */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Assigner un{" "}
              {selectedRole === "guide" ? "guide" : selectedRole === "chauffeur" ? "chauffeur" : "accompagnateur"} à{" "}
              {selectedVoyage?.titre}
            </DialogTitle>
            <DialogDescription>Sélectionnez un membre du personnel disponible pour ce voyage.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {personnelDisponiblePourAttribution.length > 0 ? (
              <div className="space-y-4">
                {personnelDisponiblePourAttribution.map((personne) => (
                  <div key={personne.id} className="flex items-center space-x-2">
                    <Checkbox id={`personne-${personne.id}`} />
                    <Label htmlFor={`personne-${personne.id}`} className="flex items-center gap-2 cursor-pointer">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={personne.photo} alt={personne.nom} />
                        <AvatarFallback>
                          {personne.nom
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{personne.nom}</p>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500 mr-1" />
                          <span className="text-xs">{personne.note}/5</span>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-2" />
                <p className="text-muted-foreground">Aucun personnel disponible pour ce rôle.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Essayez d'ajouter un nouveau membre ou de modifier les disponibilités.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={personnelDisponiblePourAttribution.length === 0}>
              Assigner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

