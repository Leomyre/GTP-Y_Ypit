"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format, addMonths } from "date-fns"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Star,
  StarHalf,
  Building,
  Plane,
  Car,
  Ship,
  Utensils,
  MapPin,
  FileText,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
  TrendingUp,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toastx"

// Types pour les partenaires
type TypePartenaire = "hotel" | "compagnie_aerienne" | "transport" | "restauration" | "guide" | "activite"

type Partenaire = {
  id: string
  nom: string
  type: TypePartenaire
  logo?: string
  adresse: string
  email: string
  telephone: string
  contact: string
  note: number
  statut: "actif" | "inactif" | "en_attente"
  dateContrat: Date
  finContrat: Date
  commission: number
  description: string
}

type Contrat = {
  id: string
  partenaireId: string
  dateDebut: Date
  dateFin: Date
  montant: number
  commission: number
  conditions: string
  statut: "actif" | "expire" | "en_attente"
}

// Données fictives pour les partenaires
const partenairesInitiaux: Partenaire[] = [
  {
    id: "p1",
    nom: "Hôtel Le Meurice",
    type: "hotel",
    logo: "/placeholder.svg?height=40&width=40",
    adresse: "228 Rue de Rivoli, 75001 Paris",
    email: "contact@lemeurice.com",
    telephone: "+33 1 44 58 10 10",
    contact: "Jean Dupont",
    note: 4.8,
    statut: "actif",
    dateContrat: new Date(2022, 5, 15),
    finContrat: new Date(2024, 5, 14),
    commission: 12,
    description:
      "Hôtel de luxe 5 étoiles situé au cœur de Paris, offrant une vue imprenable sur le jardin des Tuileries.",
  },
  {
    id: "p2",
    nom: "Air France",
    type: "compagnie_aerienne",
    logo: "/placeholder.svg?height=40&width=40",
    adresse: "45 Rue de Paris, 95747 Roissy-en-France",
    email: "partenaires@airfrance.fr",
    telephone: "+33 1 41 56 78 00",
    contact: "Marie Leroy",
    note: 4.2,
    statut: "actif",
    dateContrat: new Date(2023, 1, 10),
    finContrat: new Date(2025, 1, 9),
    commission: 8,
    description: "Compagnie aérienne nationale française offrant des vols vers plus de 200 destinations dans le monde.",
  },
  {
    id: "p3",
    nom: "Europcar",
    type: "transport",
    logo: "/placeholder.svg?height=40&width=40",
    adresse: "13 Ter Boulevard Berthier, 75017 Paris",
    email: "business@europcar.com",
    telephone: "+33 1 30 44 90 00",
    contact: "Pierre Martin",
    note: 4.0,
    statut: "actif",
    dateContrat: new Date(2023, 3, 5),
    finContrat: new Date(2024, 3, 4),
    commission: 10,
    description: "Entreprise de location de voitures présente dans plus de 140 pays avec une large gamme de véhicules.",
  },
  {
    id: "p4",
    nom: "Restaurant Le Jules Verne",
    type: "restauration",
    logo: "/placeholder.svg?height=40&width=40",
    adresse: "Tour Eiffel, Avenue Gustave Eiffel, 75007 Paris",
    email: "reservation@lejulesverne-paris.com",
    telephone: "+33 1 45 55 61 44",
    contact: "Sophie Blanc",
    note: 4.6,
    statut: "actif",
    dateContrat: new Date(2022, 9, 20),
    finContrat: new Date(2023, 9, 19),
    commission: 15,
    description:
      "Restaurant gastronomique situé au deuxième étage de la Tour Eiffel, offrant une vue panoramique sur Paris.",
  },
  {
    id: "p5",
    nom: "Paris City Tours",
    type: "guide",
    logo: "/placeholder.svg?height=40&width=40",
    adresse: "25 Rue du Faubourg Saint-Honoré, 75008 Paris",
    email: "info@pariscitytours.fr",
    telephone: "+33 1 42 60 30 01",
    contact: "Lucas Dubois",
    note: 4.5,
    statut: "actif",
    dateContrat: new Date(2022, 7, 12),
    finContrat: new Date(2024, 7, 11),
    commission: 18,
    description: "Agence de guides touristiques proposant des visites guidées de Paris en plusieurs langues.",
  },
  {
    id: "p6",
    nom: "Bateaux Parisiens",
    type: "activite",
    logo: "/placeholder.svg?height=40&width=40",
    adresse: "Port de la Bourdonnais, 75007 Paris",
    email: "reservation@bateauxparisiens.com",
    telephone: "+33 1 76 64 14 45",
    contact: "Émilie Rousseau",
    note: 4.3,
    statut: "inactif",
    dateContrat: new Date(2021, 11, 1),
    finContrat: new Date(2023, 10, 31),
    commission: 14,
    description: "Croisières sur la Seine avec déjeuner ou dîner, offrant une vue unique sur les monuments parisiens.",
  },
]

// Données fictives pour les contrats
const contratsInitiaux: Contrat[] = [
  {
    id: "c1",
    partenaireId: "p1",
    dateDebut: new Date(2022, 5, 15),
    dateFin: new Date(2024, 5, 14),
    montant: 50000,
    commission: 12,
    conditions: "Tarifs préférentiels pour les clients de l'agence. Annulation gratuite jusqu'à 48h avant l'arrivée.",
    statut: "actif",
  },
  {
    id: "c2",
    partenaireId: "p2",
    dateDebut: new Date(2023, 1, 10),
    dateFin: new Date(2025, 1, 9),
    montant: 120000,
    commission: 8,
    conditions: "Réduction de 10% sur tous les vols. Bagages supplémentaires gratuits pour les clients premium.",
    statut: "actif",
  },
  {
    id: "c3",
    partenaireId: "p3",
    dateDebut: new Date(2023, 3, 5),
    dateFin: new Date(2024, 3, 4),
    montant: 35000,
    commission: 10,
    conditions: "Surclassement gratuit selon disponibilité. Kilométrage illimité pour toutes les locations.",
    statut: "actif",
  },
  {
    id: "c4",
    partenaireId: "p4",
    dateDebut: new Date(2022, 9, 20),
    dateFin: new Date(2023, 9, 19),
    montant: 25000,
    commission: 15,
    conditions: "Réservation prioritaire pour les clients de l'agence. Menu spécial pour les groupes.",
    statut: "actif",
  },
  {
    id: "c5",
    partenaireId: "p5",
    dateDebut: new Date(2022, 7, 12),
    dateFin: new Date(2024, 7, 11),
    montant: 30000,
    commission: 18,
    conditions: "Guides francophones garantis. Visites privées disponibles sur demande.",
    statut: "actif",
  },
  {
    id: "c6",
    partenaireId: "p6",
    dateDebut: new Date(2021, 11, 1),
    dateFin: new Date(2023, 10, 31),
    montant: 40000,
    commission: 14,
    conditions: "Places réservées pour les clients de l'agence. Réduction pour les groupes de plus de 10 personnes.",
    statut: "expire",
  },
]

export default function GestionPartenaires() {
  const [partenaires, setPartenaires] = useState<Partenaire[]>(partenairesInitiaux)
  const [contrats, setContrats] = useState<Contrat[]>(contratsInitiaux)
  const [filtreType, setFiltreType] = useState<string>("tous")
  const [filtreStatut, setFiltreStatut] = useState<string>("tous")
  const [recherche, setRecherche] = useState<string>("")
  const [partenaireSelectionne, setPartenaireSelectionne] = useState<Partenaire | null>(null)
  const [nouveauPartenaire, setNouveauPartenaire] = useState<Partial<Partenaire>>({
    type: "hotel",
    statut: "actif",
    note: 4.0,
    commission: 10,
  })
  const [nouveauContrat, setNouveauContrat] = useState<Partial<Contrat>>({
    dateDebut: new Date(),
    dateFin: addMonths(new Date(), 24),
    commission: 10,
    statut: "actif",
  })
  const [dialogAjoutOuvert, setDialogAjoutOuvert] = useState(false)
  const [dialogContratOuvert, setDialogContratOuvert] = useState(false)
  const { toast } = useToast()

  // Filtrer les partenaires en fonction des critères
  const partenairesFiltres = partenaires.filter((partenaire) => {
    // Filtre par type
    if (filtreType !== "tous" && partenaire.type !== filtreType) {
      return false
    }

    // Filtre par statut
    if (filtreStatut !== "tous" && partenaire.statut !== filtreStatut) {
      return false
    }

    // Filtre par recherche
    if (recherche && !partenaire.nom.toLowerCase().includes(recherche.toLowerCase())) {
      return false
    }

    return true
  })

  // Fonction pour ajouter un nouveau partenaire
  const ajouterPartenaire = () => {
    if (!nouveauPartenaire.nom || !nouveauPartenaire.email || !nouveauPartenaire.telephone) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      })
      return
    }

    const nouveauId = `p${partenaires.length + 1}`
    const partenaire: Partenaire = {
      id: nouveauId,
      nom: nouveauPartenaire.nom || "",
      type: (nouveauPartenaire.type as TypePartenaire) || "hotel",
      logo: "/placeholder.svg?height=40&width=40",
      adresse: nouveauPartenaire.adresse || "",
      email: nouveauPartenaire.email || "",
      telephone: nouveauPartenaire.telephone || "",
      contact: nouveauPartenaire.contact || "",
      note: nouveauPartenaire.note || 4.0,
      statut: (nouveauPartenaire.statut as "actif" | "inactif" | "en_attente") || "actif",
      dateContrat: nouveauPartenaire.dateContrat || new Date(),
      finContrat: nouveauPartenaire.finContrat || addMonths(new Date(), 24),
      commission: nouveauPartenaire.commission || 10,
      description: nouveauPartenaire.description || "",
    }

    setPartenaires([...partenaires, partenaire])
    setNouveauPartenaire({
      type: "hotel",
      statut: "actif",
      note: 4.0,
      commission: 10,
    })
    setDialogAjoutOuvert(false)

    toast({
      title: "Partenaire ajouté",
      description: `Le partenaire ${partenaire.nom} a été ajouté avec succès.`,
      variant: "default",
    })
  }

  // Fonction pour ajouter un nouveau contrat
  const ajouterContrat = () => {
    if (!partenaireSelectionne || !nouveauContrat.montant || !nouveauContrat.conditions) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      })
      return
    }

    const nouveauId = `c${contrats.length + 1}`
    const contrat: Contrat = {
      id: nouveauId,
      partenaireId: partenaireSelectionne.id,
      dateDebut: nouveauContrat.dateDebut || new Date(),
      dateFin: nouveauContrat.dateFin || addMonths(new Date(), 24),
      montant: nouveauContrat.montant || 0,
      commission: nouveauContrat.commission || 10,
      conditions: nouveauContrat.conditions || "",
      statut: (nouveauContrat.statut as "actif" | "expire" | "en_attente") || "actif",
    }

    setContrats([...contrats, contrat])
    setNouveauContrat({
      dateDebut: new Date(),
      dateFin: addMonths(new Date(), 24),
      commission: 10,
      statut: "actif",
    })
    setDialogContratOuvert(false)

    toast({
      title: "Contrat ajouté",
      description: `Un nouveau contrat a été ajouté pour ${partenaireSelectionne.nom}.`,
      variant: "default",
    })
  }

  // Fonction pour supprimer un partenaire
  const supprimerPartenaire = (id: string) => {
    setPartenaires(partenaires.filter((p) => p.id !== id))
    setContrats(contrats.filter((c) => c.partenaireId !== id))

    toast({
      title: "Partenaire supprimé",
      description: "Le partenaire a été supprimé avec succès.",
      variant: "default",
    })
  }

  // Fonction pour obtenir les contrats d'un partenaire
  const getContratsPartenaire = (partenaireId: string) => {
    return contrats.filter((contrat) => contrat.partenaireId === partenaireId)
  }

  // Fonction pour obtenir l'icône en fonction du type de partenaire
  const getIconePartenaire = (type: TypePartenaire) => {
    switch (type) {
      case "hotel":
        return <Building className="h-4 w-4" />
      case "compagnie_aerienne":
        return <Plane className="h-4 w-4" />
      case "transport":
        return <Car className="h-4 w-4" />
      case "restauration":
        return <Utensils className="h-4 w-4" />
      case "guide":
        return <MapPin className="h-4 w-4" />
      case "activite":
        return <Ship className="h-4 w-4" />
      default:
        return <Building className="h-4 w-4" />
    }
  }

  // Fonction pour obtenir le libellé du type de partenaire
  const getLibelleType = (type: TypePartenaire) => {
    switch (type) {
      case "hotel":
        return "Hôtel"
      case "compagnie_aerienne":
        return "Compagnie aérienne"
      case "transport":
        return "Transport"
      case "restauration":
        return "Restauration"
      case "guide":
        return "Guide"
      case "activite":
        return "Activité"
      default:
        return "Autre"
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des partenaires</h1>
        <Button onClick={() => setDialogAjoutOuvert(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un partenaire
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <CardDescription>Filtrer les partenaires par type, statut ou recherche</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/4">
            <Label htmlFor="type">Type de partenaire</Label>
            <Select value={filtreType} onValueChange={setFiltreType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les types</SelectItem>
                <SelectItem value="hotel">Hôtels</SelectItem>
                <SelectItem value="compagnie_aerienne">Compagnies aériennes</SelectItem>
                <SelectItem value="transport">Transports</SelectItem>
                <SelectItem value="restauration">Restauration</SelectItem>
                <SelectItem value="guide">Guides</SelectItem>
                <SelectItem value="activite">Activités</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-1/4">
            <Label htmlFor="statut">Statut</Label>
            <Select value={filtreStatut} onValueChange={setFiltreStatut}>
              <SelectTrigger id="statut">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les statuts</SelectItem>
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="inactif">Inactif</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-1/2">
            <Label htmlFor="recherche">Recherche</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="recherche"
                placeholder="Rechercher un partenaire..."
                className="pl-8"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des partenaires</CardTitle>
          <CardDescription>{partenairesFiltres.length} partenaire(s) trouvé(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partenaire</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Fin de contrat</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partenairesFiltres.map((partenaire) => (
                <TableRow key={partenaire.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={partenaire.logo} alt={partenaire.nom} />
                        <AvatarFallback>{partenaire.nom.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{partenaire.nom}</div>
                        <div className="text-xs text-muted-foreground">{partenaire.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                      {getIconePartenaire(partenaire.type)}
                      {getLibelleType(partenaire.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{partenaire.contact}</div>
                    <div className="text-xs text-muted-foreground">{partenaire.telephone}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {partenaire.note >= 4.5 ? (
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      ) : (
                        <StarHalf className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      )}
                      <span className="ml-1">{partenaire.note.toFixed(1)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {partenaire.statut === "actif" && (
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        Actif
                      </Badge>
                    )}
                    {partenaire.statut === "inactif" && (
                      <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                        <XCircle className="h-3.5 w-3.5 mr-1" />
                        Inactif
                      </Badge>
                    )}
                    {partenaire.statut === "en_attente" && (
                      <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                      >
                        <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                        En attente
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{format(partenaire.finContrat, "dd/MM/yyyy")}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPartenaireSelectionne(partenaire)
                          setNouveauContrat({
                            ...nouveauContrat,
                            commission: partenaire.commission,
                          })
                        }}
                      >
                        Détails
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => supprimerPartenaire(partenaire.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {partenairesFiltres.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Aucun partenaire ne correspond aux critères de filtrage.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {partenaireSelectionne && (
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Détails du partenaire</TabsTrigger>
            <TabsTrigger value="contrats">Contrats</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {partenaireSelectionne.nom}
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getIconePartenaire(partenaireSelectionne.type)}
                        {getLibelleType(partenaireSelectionne.type)}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{partenaireSelectionne.description}</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Edit className="h-4 w-4" />
                    Modifier
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Informations de contact</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{partenaireSelectionne.adresse}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{partenaireSelectionne.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{partenaireSelectionne.telephone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>Contact: {partenaireSelectionne.contact}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Évaluation</h3>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < Math.floor(partenaireSelectionne.note)
                              ? "text-yellow-500 fill-yellow-500"
                              : i < partenaireSelectionne.note
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                        />
                      ))}
                      <span className="ml-2 font-medium">{partenaireSelectionne.note.toFixed(1)}/5</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Informations contractuelles</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Début du contrat: {format(partenaireSelectionne.dateContrat, "dd/MM/yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Fin du contrat: {format(partenaireSelectionne.finContrat, "dd/MM/yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>Commission: {partenaireSelectionne.commission}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Statut:
                          {partenaireSelectionne.statut === "actif" && (
                            <Badge
                              variant="outline"
                              className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            >
                              Actif
                            </Badge>
                          )}
                          {partenaireSelectionne.statut === "inactif" && (
                            <Badge
                              variant="outline"
                              className="ml-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                            >
                              Inactif
                            </Badge>
                          )}
                          {partenaireSelectionne.statut === "en_attente" && (
                            <Badge
                              variant="outline"
                              className="ml-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                            >
                              En attente
                            </Badge>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setPartenaireSelectionne(null)}>
                  Fermer
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => {
                      supprimerPartenaire(partenaireSelectionne.id)
                      setPartenaireSelectionne(null)
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                  <Button onClick={() => setDialogContratOuvert(true)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Nouveau contrat
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="contrats" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Contrats avec {partenaireSelectionne.nom}</CardTitle>
                    <CardDescription>Historique et détails des contrats</CardDescription>
                  </div>
                  <Button onClick={() => setDialogContratOuvert(true)} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Nouveau contrat
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Période</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                      <TableHead className="text-right">Commission</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Conditions</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getContratsPartenaire(partenaireSelectionne.id).map((contrat) => (
                      <TableRow key={contrat.id}>
                        <TableCell>
                          {format(contrat.dateDebut, "dd/MM/yyyy")} - {format(contrat.dateFin, "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell className="text-right">{contrat.montant.toLocaleString("fr-FR")} €</TableCell>
                        <TableCell className="text-right">{contrat.commission}%</TableCell>
                        <TableCell>
                          {contrat.statut === "actif" && (
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                              Actif
                            </Badge>
                          )}
                          {contrat.statut === "expire" && (
                            <Badge
                              variant="outline"
                              className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                            >
                              <XCircle className="h-3.5 w-3.5 mr-1" />
                              Expiré
                            </Badge>
                          )}
                          {contrat.statut === "en_attente" && (
                            <Badge
                              variant="outline"
                              className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                            >
                              <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                              En attente
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate" title={contrat.conditions}>
                            {contrat.conditions}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {getContratsPartenaire(partenaireSelectionne.id).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          Aucun contrat trouvé pour ce partenaire.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => setPartenaireSelectionne(null)}>
                  Fermer
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance du partenaire</CardTitle>
                <CardDescription>Statistiques et indicateurs de performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Réservations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">245</div>
                      <div className="flex items-center mt-1 text-xs text-green-600">
                        <TrendingUp className="h-3.5 w-3.5 mr-1" />
                        <span>+12% par rapport à l'année précédente</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Chiffre d'affaires généré
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">78 500 €</div>
                      <div className="flex items-center mt-1 text-xs text-green-600">
                        <TrendingUp className="h-3.5 w-3.5 mr-1" />
                        <span>+8% par rapport à l'année précédente</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Satisfaction client</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">4.7/5</div>
                      <div className="flex items-center mt-1 text-xs text-green-600">
                        <TrendingUp className="h-3.5 w-3.5 mr-1" />
                        <span>+0.3 points par rapport à l'année précédente</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Évolution des réservations</h3>
                  <div className="h-64">
                    {/* Graphique d'évolution des réservations */}
                    <div className="w-full h-full bg-muted/20 rounded-md flex items-center justify-center">
                      <p className="text-muted-foreground">Graphique d'évolution des réservations</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Commentaires clients récents</h3>
                  <div className="space-y-4">
                    <div className="border rounded-md p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < 5 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">Marie D. - 12/10/2023</span>
                      </div>
                      <p className="text-sm">Excellent service, personnel très attentionné. Je recommande vivement !</p>
                    </div>
                    <div className="border rounded-md p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < 4 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">Pierre L. - 05/10/2023</span>
                      </div>
                      <p className="text-sm">
                        Très bon rapport qualité-prix. Quelques petits détails à améliorer mais globalement satisfait.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => setPartenaireSelectionne(null)}>
                  Fermer
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Dialog pour ajouter un nouveau partenaire */}
      <Dialog open={dialogAjoutOuvert} onOpenChange={setDialogAjoutOuvert}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau partenaire</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour ajouter un nouveau partenaire à votre réseau.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="nom">Nom du partenaire *</Label>
                <Input
                  id="nom"
                  value={nouveauPartenaire.nom || ""}
                  onChange={(e) => setNouveauPartenaire({ ...nouveauPartenaire, nom: e.target.value })}
                  placeholder="Nom du partenaire"
                />
              </div>

              <div>
                <Label htmlFor="type">Type de partenaire *</Label>
                <Select
                  value={nouveauPartenaire.type}
                  onValueChange={(value) =>
                    setNouveauPartenaire({ ...nouveauPartenaire, type: value as TypePartenaire })
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hotel">Hôtel</SelectItem>
                    <SelectItem value="compagnie_aerienne">Compagnie aérienne</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="restauration">Restauration</SelectItem>
                    <SelectItem value="guide">Guide</SelectItem>
                    <SelectItem value="activite">Activité</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={nouveauPartenaire.email || ""}
                  onChange={(e) => setNouveauPartenaire({ ...nouveauPartenaire, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <Label htmlFor="telephone">Téléphone *</Label>
                <Input
                  id="telephone"
                  value={nouveauPartenaire.telephone || ""}
                  onChange={(e) => setNouveauPartenaire({ ...nouveauPartenaire, telephone: e.target.value })}
                  placeholder="+33 1 23 45 67 89"
                />
              </div>

              <div>
                <Label htmlFor="contact">Personne de contact</Label>
                <Input
                  id="contact"
                  value={nouveauPartenaire.contact || ""}
                  onChange={(e) => setNouveauPartenaire({ ...nouveauPartenaire, contact: e.target.value })}
                  placeholder="Nom du contact principal"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="adresse">Adresse</Label>
                <Input
                  id="adresse"
                  value={nouveauPartenaire.adresse || ""}
                  onChange={(e) => setNouveauPartenaire({ ...nouveauPartenaire, adresse: e.target.value })}
                  placeholder="Adresse complète"
                />
              </div>

              <div>
                <Label htmlFor="commission">Commission (%)</Label>
                <Input
                  id="commission"
                  type="number"
                  value={nouveauPartenaire.commission || 10}
                  onChange={(e) =>
                    setNouveauPartenaire({ ...nouveauPartenaire, commission: Number.parseFloat(e.target.value) })
                  }
                />
              </div>

              <div>
                <Label htmlFor="statut">Statut</Label>
                <Select
                  value={nouveauPartenaire.statut}
                  onValueChange={(value) =>
                    setNouveauPartenaire({ ...nouveauPartenaire, statut: value as "actif" | "inactif" | "en_attente" })
                  }
                >
                  <SelectTrigger id="statut">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="inactif">Inactif</SelectItem>
                    <SelectItem value="en_attente">En attente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={nouveauPartenaire.description || ""}
                  onChange={(e) => setNouveauPartenaire({ ...nouveauPartenaire, description: e.target.value })}
                  placeholder="Description du partenaire"
                  className="min-h-[120px]"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogAjoutOuvert(false)}>
              Annuler
            </Button>
            <Button onClick={ajouterPartenaire}>Ajouter le partenaire</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour ajouter un nouveau contrat */}
      <Dialog open={dialogContratOuvert} onOpenChange={setDialogContratOuvert}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouveau contrat avec {partenaireSelectionne?.nom}</DialogTitle>
            <DialogDescription>Définissez les termes du nouveau contrat avec ce partenaire.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="montant">Montant du contrat (€) *</Label>
                <Input
                  id="montant"
                  type="number"
                  value={nouveauContrat.montant || ""}
                  onChange={(e) => setNouveauContrat({ ...nouveauContrat, montant: Number.parseFloat(e.target.value) })}
                  placeholder="Montant en euros"
                />
              </div>

              <div>
                <Label htmlFor="commission">Commission (%)</Label>
                <Input
                  id="commission"
                  type="number"
                  value={nouveauContrat.commission || 10}
                  onChange={(e) =>
                    setNouveauContrat({ ...nouveauContrat, commission: Number.parseFloat(e.target.value) })
                  }
                />
              </div>

              <div>
                <Label htmlFor="statut">Statut du contrat</Label>
                <Select
                  value={nouveauContrat.statut as string}
                  onValueChange={(value) =>
                    setNouveauContrat({ ...nouveauContrat, statut: value as "actif" | "expire" | "en_attente" })
                  }
                >
                  <SelectTrigger id="statut">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="expire">Expiré</SelectItem>
                    <SelectItem value="en_attente">En attente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="conditions">Conditions du contrat *</Label>
                <Textarea
                  id="conditions"
                  value={nouveauContrat.conditions || ""}
                  onChange={(e) => setNouveauContrat({ ...nouveauContrat, conditions: e.target.value })}
                  placeholder="Détaillez les conditions du contrat"
                  className="min-h-[180px]"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogContratOuvert(false)}>
              Annuler
            </Button>
            <Button onClick={ajouterContrat}>Ajouter le contrat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

