"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toastx"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Clock, Users, Mail, Save, Play, Pause, Edit, Trash, Plus } from "lucide-react"

// Données statiques pour l'exemple (à remplacer par un appel API réel)
const campagnes = [
  {
    id: 1,
    nom: "Relance panier abandonné",
    type: "abandon",
    statut: "active",
    delai: 24,
    destinataires: 15,
    taux_ouverture: 42,
    taux_conversion: 8,
    derniere_execution: "2024-06-10T14:30:00",
    prochaine_execution: "2024-06-11T14:30:00",
  },
  {
    id: 2,
    nom: "Promotion été 2025",
    type: "promotion",
    statut: "planifiee",
    delai: null,
    destinataires: 250,
    taux_ouverture: null,
    taux_conversion: null,
    derniere_execution: null,
    prochaine_execution: "2024-06-15T09:00:00",
  },
  {
    id: 3,
    nom: "Rappel voyage imminent",
    type: "rappel",
    statut: "active",
    delai: 72,
    destinataires: 8,
    taux_ouverture: 75,
    taux_conversion: null,
    derniere_execution: "2024-06-09T10:00:00",
    prochaine_execution: "2024-06-12T10:00:00",
  },
  {
    id: 4,
    nom: "Demande d'avis post-voyage",
    type: "avis",
    statut: "active",
    delai: 48,
    destinataires: 12,
    taux_ouverture: 58,
    taux_conversion: 33,
    derniere_execution: "2024-06-08T16:00:00",
    prochaine_execution: "2024-06-12T16:00:00",
  },
  {
    id: 5,
    nom: "Offre fidélité clients réguliers",
    type: "fidelite",
    statut: "inactive",
    delai: null,
    destinataires: 0,
    taux_ouverture: null,
    taux_conversion: null,
    derniere_execution: "2024-05-15T11:00:00",
    prochaine_execution: null,
  },
]

const modeles = [
  {
    id: 1,
    nom: "Relance panier abandonné",
    sujet: "Votre réservation est en attente !",
    contenu:
      "Bonjour {{prenom}},\n\nNous avons remarqué que vous avez commencé à réserver le voyage \"{{voyage}}\" mais que vous n'avez pas finalisé votre réservation.\n\nVotre panier est toujours disponible et nous avons conservé vos informations pour faciliter votre réservation.\n\nCliquez sur le lien ci-dessous pour finaliser votre réservation :\n{{lien_reservation}}\n\nSi vous avez des questions, n'hésitez pas à nous contacter.\n\nL'équipe Agence de Voyage",
    variables: ["prenom", "voyage", "lien_reservation"],
  },
  {
    id: 2,
    nom: "Promotion été 2025",
    sujet: "Offre spéciale : -15% sur nos voyages d'été !",
    contenu:
      "Bonjour {{prenom}},\n\nNous sommes heureux de vous proposer une offre exclusive : bénéficiez de 15% de réduction sur tous nos voyages pour l'été 2025 !\n\nUtilisez le code promo ETE2025 lors de votre réservation avant le 30 juin.\n\nDécouvrez nos destinations : {{lien_destinations}}\n\nBonnes vacances !\n\nL'équipe Agence de Voyage",
    variables: ["prenom", "lien_destinations"],
  },
  {
    id: 3,
    nom: "Rappel voyage imminent",
    sujet: "Votre voyage approche !",
    contenu:
      "Bonjour {{prenom}},\n\nVotre voyage à {{destination}} approche à grands pas ! Vous partirez dans {{jours_restants}} jours.\n\nVoici quelques informations importantes :\n- Vérifiez la validité de vos documents de voyage\n- Consultez la météo prévue\n- Préparez vos bagages selon notre guide\n\nRetrouvez tous les détails de votre voyage ici : {{lien_details}}\n\nBon voyage !\n\nL'équipe Agence de Voyage",
    variables: ["prenom", "destination", "jours_restants", "lien_details"],
  },
  {
    id: 4,
    nom: "Demande d'avis post-voyage",
    sujet: "Comment s'est passé votre voyage ?",
    contenu:
      "Bonjour {{prenom}},\n\nNous espérons que vous avez passé un agréable séjour à {{destination}}.\n\nVotre avis est précieux pour nous aider à améliorer nos services. Pourriez-vous prendre quelques minutes pour partager votre expérience ?\n\n{{lien_avis}}\n\nMerci pour votre contribution !\n\nL'équipe Agence de Voyage",
    variables: ["prenom", "destination", "lien_avis"],
  },
  {
    id: 5,
    nom: "Offre fidélité clients réguliers",
    sujet: "Merci pour votre fidélité !",
    contenu:
      "Bonjour {{prenom}},\n\nNous tenons à vous remercier pour votre fidélité. En tant que client privilégié, nous vous offrons une réduction de {{reduction}}% sur votre prochaine réservation.\n\nUtilisez le code promo {{code_promo}} valable jusqu'au {{date_validite}}.\n\nDécouvrez nos nouvelles destinations : {{lien_destinations}}\n\nAu plaisir de vous revoir bientôt !\n\nL'équipe Agence de Voyage",
    variables: ["prenom", "reduction", "code_promo", "date_validite", "lien_destinations"],
  },
]

export default function RelancesClients() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("campagnes")
  const [selectedCampagne, setSelectedCampagne] = useState<number | null>(null)
  const [selectedModele, setSelectedModele] = useState<number | null>(null)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isEditing, setIsEditing] = useState(false)
  const [newCampagne, setNewCampagne] = useState({
    nom: "",
    type: "abandon",
    modele_id: "1",
    delai: "24",
    statut: "inactive",
  })

  const handleToggleCampagne = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active"

    // Dans une implémentation réelle, vous feriez un appel API ici
    console.log(`Changement de statut de la campagne ${id} : ${newStatus}`)

    toast({
      title: `Campagne ${newStatus === "active" ? "activée" : "désactivée"}`,
      description: `La campagne a été ${newStatus === "active" ? "activée" : "désactivée"} avec succès.`,
    })
  }

  const handleDeleteCampagne = (id: number) => {
    // Dans une implémentation réelle, vous feriez un appel API ici
    console.log(`Suppression de la campagne ${id}`)

    toast({
      title: "Campagne supprimée",
      description: "La campagne a été supprimée avec succès.",
    })
  }

  const handleSaveModele = () => {
    // Dans une implémentation réelle, vous feriez un appel API ici
    console.log("Sauvegarde du modèle")

    toast({
      title: "Modèle sauvegardé",
      description: "Le modèle a été sauvegardé avec succès.",
    })

    setIsEditing(false)
  }

  const handleCreateCampagne = () => {
    // Dans une implémentation réelle, vous feriez un appel API ici
    console.log("Création d'une nouvelle campagne", newCampagne)

    toast({
      title: "Campagne créée",
      description: "La nouvelle campagne a été créée avec succès.",
    })

    // Réinitialiser le formulaire
    setNewCampagne({
      nom: "",
      type: "abandon",
      modele_id: "1",
      delai: "24",
      statut: "inactive",
    })
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "abandon":
        return <Badge className="bg-red-500 hover:bg-red-600">Panier abandonné</Badge>
      case "promotion":
        return <Badge className="bg-purple-500 hover:bg-purple-600">Promotion</Badge>
      case "rappel":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Rappel</Badge>
      case "avis":
        return <Badge className="bg-green-500 hover:bg-green-600">Avis</Badge>
      case "fidelite":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Fidélité</Badge>
      default:
        return <Badge>Autre</Badge>
    }
  }

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
      case "inactive":
        return <Badge className="bg-gray-500 hover:bg-gray-600">Inactive</Badge>
      case "planifiee":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Planifiée</Badge>
      default:
        return <Badge>Inconnu</Badge>
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Automatisation des Relances Clients</h1>

      <Tabs defaultValue="campagnes" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="campagnes">Campagnes</TabsTrigger>
          <TabsTrigger value="modeles">Modèles d'emails</TabsTrigger>
          <TabsTrigger value="nouvelle">Nouvelle campagne</TabsTrigger>
        </TabsList>

        {/* Onglet Campagnes */}
        <TabsContent value="campagnes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campagnes de relance automatisées</CardTitle>
              <CardDescription>Gérez vos campagnes de relance client et suivez leurs performances</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Délai</TableHead>
                    <TableHead>Destinataires</TableHead>
                    <TableHead>Taux d'ouverture</TableHead>
                    <TableHead>Taux de conversion</TableHead>
                    <TableHead>Prochaine exécution</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campagnes.map((campagne) => (
                    <TableRow key={campagne.id}>
                      <TableCell className="font-medium">{campagne.nom}</TableCell>
                      <TableCell>{getTypeBadge(campagne.type)}</TableCell>
                      <TableCell>{getStatutBadge(campagne.statut)}</TableCell>
                      <TableCell>
                        {campagne.delai ? (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-gray-500" />
                            <span>{campagne.delai}h</span>
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-gray-500" />
                          <span>{campagne.destinataires}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {campagne.taux_ouverture !== null ? (
                          <span className="font-medium">{campagne.taux_ouverture}%</span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {campagne.taux_conversion !== null ? (
                          <span className="font-medium">{campagne.taux_conversion}%</span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {campagne.prochaine_execution ? (
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                            <span>{format(new Date(campagne.prochaine_execution), "dd/MM/yyyy HH:mm")}</span>
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="icon" variant="outline" onClick={() => setSelectedCampagne(campagne.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant={campagne.statut === "active" ? "default" : "outline"}
                            onClick={() => handleToggleCampagne(campagne.id, campagne.statut)}
                          >
                            {campagne.statut === "active" ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <Button size="icon" variant="destructive" onClick={() => handleDeleteCampagne(campagne.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {selectedCampagne && (
            <Card>
              <CardHeader>
                <CardTitle>Détails de la campagne - {campagnes.find((c) => c.id === selectedCampagne)?.nom}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Informations générales</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Type :</dt>
                        <dd>{getTypeBadge(campagnes.find((c) => c.id === selectedCampagne)?.type || "")}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Statut :</dt>
                        <dd>{getStatutBadge(campagnes.find((c) => c.id === selectedCampagne)?.statut || "")}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Délai :</dt>
                        <dd>{campagnes.find((c) => c.id === selectedCampagne)?.delai || "-"} heures</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Dernière exécution :</dt>
                        <dd>
                          {campagnes.find((c) => c.id === selectedCampagne)?.derniere_execution
                            ? format(
                              new Date(campagnes.find((c) => c.id === selectedCampagne)?.derniere_execution || ""),
                              "dd/MM/yyyy HH:mm",
                            )
                            : "-"}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Prochaine exécution :</dt>
                        <dd>
                          {campagnes.find((c) => c.id === selectedCampagne)?.prochaine_execution
                            ? format(
                              new Date(campagnes.find((c) => c.id === selectedCampagne)?.prochaine_execution || ""),
                              "dd/MM/yyyy HH:mm",
                            )
                            : "-"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Performances</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Destinataires :</dt>
                        <dd>{campagnes.find((c) => c.id === selectedCampagne)?.destinataires || 0}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Taux d'ouverture :</dt>
                        <dd>
                          {campagnes.find((c) => c.id === selectedCampagne)?.taux_ouverture !== null
                            ? `${campagnes.find((c) => c.id === selectedCampagne)?.taux_ouverture}%`
                            : "-"}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Taux de conversion :</dt>
                        <dd>
                          {campagnes.find((c) => c.id === selectedCampagne)?.taux_conversion !== null
                            ? `${campagnes.find((c) => c.id === selectedCampagne)?.taux_conversion}%`
                            : "-"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-2">Modèle d'email utilisé</h3>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        {modeles.find((m) => m.nom === campagnes.find((c) => c.id === selectedCampagne)?.nom)?.sujet}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="whitespace-pre-wrap text-sm bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                        {modeles.find((m) => m.nom === campagnes.find((c) => c.id === selectedCampagne)?.nom)?.contenu}
                      </pre>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setSelectedCampagne(null)}>
                    Fermer
                  </Button>
                  <Button onClick={() => setActiveTab("modeles")}>Modifier le modèle</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Onglet Modèles d'emails */}
        <TabsContent value="modeles" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Modèles d'emails</h2>
              <p className="text-muted-foreground">Gérez les modèles utilisés pour vos campagnes de relance</p>
            </div>
            <div className="flex space-x-2">
              <Select
                value={selectedModele?.toString() || ""}
                onValueChange={(value) => setSelectedModele(Number.parseInt(value))}
              >
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Sélectionner un modèle" />
                </SelectTrigger>
                <SelectContent>
                  {modeles.map((modele) => (
                    <SelectItem key={modele.id} value={modele.id.toString()}>
                      {modele.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={() => setIsEditing(!isEditing)}>{isEditing ? "Annuler" : "Modifier"}</Button>
            </div>
          </div>

          {selectedModele && (
            <Card>
              <CardHeader>
                <CardTitle>{modeles.find((m) => m.id === selectedModele)?.nom}</CardTitle>
                <CardDescription>
                  Variables disponibles :{" "}
                  {modeles
                    .find((m) => m.id === selectedModele)
                    ?.variables.map((v) => `{{${v}}}`)
                    .join(", ")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sujet">Sujet de l'email</Label>
                      <Input id="sujet" defaultValue={modeles.find((m) => m.id === selectedModele)?.sujet} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contenu">Contenu de l'email</Label>
                      <Textarea
                        id="contenu"
                        rows={10}
                        defaultValue={modeles.find((m) => m.id === selectedModele)?.contenu}
                      />
                    </div>
                    <Button onClick={handleSaveModele}>
                      <Save className="mr-2 h-4 w-4" />
                      Sauvegarder les modifications
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Sujet de l'email</Label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                        {modeles.find((m) => m.id === selectedModele)?.sujet}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Contenu de l'email</Label>
                      <pre className="whitespace-pre-wrap p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                        {modeles.find((m) => m.id === selectedModele)?.contenu}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {!selectedModele && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Mail className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Aucun modèle sélectionné</p>
                <p className="text-muted-foreground mb-6">
                  Veuillez sélectionner un modèle d'email pour afficher ses détails
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Onglet Nouvelle campagne */}
        <TabsContent value="nouvelle" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Créer une nouvelle campagne</CardTitle>
              <CardDescription>Configurez une nouvelle campagne de relance automatisée</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom de la campagne</Label>
                  <Input
                    id="nom"
                    value={newCampagne.nom}
                    onChange={(e) => setNewCampagne({ ...newCampagne, nom: e.target.value })}
                    placeholder="Ex: Relance clients inactifs"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type de campagne</Label>
                  <Select
                    value={newCampagne.type}
                    onValueChange={(value) => setNewCampagne({ ...newCampagne, type: value })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="abandon">Panier abandonné</SelectItem>
                      <SelectItem value="promotion">Promotion</SelectItem>
                      <SelectItem value="rappel">Rappel</SelectItem>
                      <SelectItem value="avis">Demande d'avis</SelectItem>
                      <SelectItem value="fidelite">Fidélité</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modele">Modèle d'email</Label>
                  <Select
                    value={newCampagne.modele_id}
                    onValueChange={(value) => setNewCampagne({ ...newCampagne, modele_id: value })}
                  >
                    <SelectTrigger id="modele">
                      <SelectValue placeholder="Sélectionner un modèle" />
                    </SelectTrigger>
                    <SelectContent>
                      {modeles.map((modele) => (
                        <SelectItem key={modele.id} value={modele.id.toString()}>
                          {modele.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {newCampagne.type !== "promotion" && (
                  <div className="space-y-2">
                    <Label htmlFor="delai">Délai d'envoi (en heures)</Label>
                    <Input
                      id="delai"
                      type="number"
                      min="1"
                      value={newCampagne.delai}
                      onChange={(e) => setNewCampagne({ ...newCampagne, delai: e.target.value })}
                    />
                    <p className="text-sm text-muted-foreground">
                      Délai après lequel l'email sera envoyé automatiquement
                    </p>
                  </div>
                )}

                {newCampagne.type === "promotion" && (
                  <div className="space-y-2">
                    <Label>Date d'envoi</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP", { locale: fr }) : "Sélectionner une date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="statut"
                    checked={newCampagne.statut === "active"}
                    onCheckedChange={(checked) =>
                      setNewCampagne({ ...newCampagne, statut: checked ? "active" : "inactive" })
                    }
                  />
                  <Label htmlFor="statut">Activer immédiatement la campagne</Label>
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={handleCreateCampagne} disabled={!newCampagne.nom}>
                  <Plus className="mr-2 h-4 w-4" />
                  Créer la campagne
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

