"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toastx"
import { withAuth } from "@/components/withAuth"
import { SocialShare } from "@/components/SocialShare"
import { ArrowLeft, Trash2, Calendar, Clock, MapPin, Save, Download, Printer } from "lucide-react"

// Données statiques pour l'exemple (à remplacer par un appel API réel)
const voyages = [
  {
    id: "1",
    nom: "Séjour de luxe à Paris",
    ville_depart: "Lyon",
    ville_arrive: "Paris",
    date_depart: "2025-03-15",
    date_arrive_prevu: "2025-03-20",
    duree: 5,
    image: "/images/paris.jpg",
    activites_suggerees: [
      {
        id: 1,
        nom: "Visite de la Tour Eiffel",
        duree: 3,
        categorie: "attraction",
        description: "Montez au sommet de la Tour Eiffel et profitez d'une vue imprenable sur Paris.",
      },
      {
        id: 2,
        nom: "Musée du Louvre",
        duree: 4,
        categorie: "culture",
        description: "Découvrez l'un des plus grands musées du monde et admirez la Joconde.",
      },
      {
        id: 3,
        nom: "Croisière sur la Seine",
        duree: 2,
        categorie: "detente",
        description: "Profitez d'une croisière relaxante sur la Seine et admirez les monuments parisiens.",
      },
      {
        id: 4,
        nom: "Montmartre et Sacré-Cœur",
        duree: 3,
        categorie: "culture",
        description: "Explorez le quartier bohème de Montmartre et visitez la basilique du Sacré-Cœur.",
      },
      {
        id: 5,
        nom: "Shopping sur les Champs-Élysées",
        duree: 3,
        categorie: "shopping",
        description: "Faites du shopping sur l'avenue la plus célèbre de Paris.",
      },
      {
        id: 6,
        nom: "Dîner gastronomique",
        duree: 2,
        categorie: "gastronomie",
        description: "Savourez un dîner gastronomique dans un restaurant étoilé.",
      },
      {
        id: 7,
        nom: "Visite du château de Versailles",
        duree: 6,
        categorie: "culture",
        description: "Découvrez le somptueux château de Versailles et ses jardins.",
      },
      {
        id: 8,
        nom: "Quartier Latin",
        duree: 3,
        categorie: "culture",
        description: "Promenez-vous dans le Quartier Latin et découvrez son ambiance estudiantine.",
      },
    ],
  },
  // Autres voyages...
]

interface Activite {
  id: number
  nom: string
  duree: number
  categorie: string
  description: string
  heure_debut?: string
  notes?: string
}

interface JourItineraire {
  date: string
  activites: Activite[]
}

const PlanificateurItineraire = () => {
  const router = useRouter()
  const { id } = useParams()
  const { toast } = useToast()
  const [voyage, setVoyage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [itineraire, setItineraire] = useState<JourItineraire[]>([])
  const [activitesFiltrees, setActivitesFiltrees] = useState<Activite[]>([])
  const [filtreCategorie, setFiltreCategorie] = useState("toutes")
  const [activeTab, setActiveTab] = useState("planificateur")

  // Charger les données du voyage
  useEffect(() => {
    setLoading(true)

    // Simuler un chargement de données
    setTimeout(() => {
      const voyageFound = voyages.find((v) => v.id === id)

      if (voyageFound) {
        setVoyage(voyageFound)
        setActivitesFiltrees(voyageFound.activites_suggerees)

        // Initialiser l'itinéraire avec des jours vides
        const dateDepart = new Date(voyageFound.date_depart)
        const jours: JourItineraire[] = []

        for (let i = 0; i < voyageFound.duree; i++) {
          const date = new Date(dateDepart)
          date.setDate(dateDepart.getDate() + i)

          jours.push({
            date: date.toISOString().split("T")[0],
            activites: [],
          })
        }

        setItineraire(jours)
      }

      setLoading(false)
    }, 1000)
  }, [id])

  // Filtrer les activités par catégorie
  useEffect(() => {
    if (voyage) {
      if (filtreCategorie === "toutes") {
        setActivitesFiltrees(voyage.activites_suggerees)
      } else {
        setActivitesFiltrees(voyage.activites_suggerees.filter((a: Activite) => a.categorie === filtreCategorie))
      }
    }
  }, [filtreCategorie, voyage])

  // Ajouter une activité à un jour
  const ajouterActivite = (jourIndex: number, activite: Activite) => {
    const newItineraire = [...itineraire]

    // Vérifier si l'activité est déjà dans l'itinéraire
    const estDejaAjoutee = itineraire.some((jour) => jour.activites.some((a) => a.id === activite.id))

    if (estDejaAjoutee) {
      toast({
        title: "Activité déjà ajoutée",
        description: "Cette activité est déjà dans votre itinéraire.",
        variant: "destructive",
      })
      return
    }

    // Ajouter l'activité au jour sélectionné
    newItineraire[jourIndex].activites.push({
      ...activite,
      heure_debut: "09:00", // Heure par défaut
      notes: "",
    })

    setItineraire(newItineraire)

    toast({
      title: "Activité ajoutée",
      description: `"${activite.nom}" a été ajouté à votre itinéraire.`,
    })
  }

  // Supprimer une activité d'un jour
  const supprimerActivite = (jourIndex: number, activiteIndex: number) => {
    const newItineraire = [...itineraire]
    newItineraire[jourIndex].activites.splice(activiteIndex, 1)
    setItineraire(newItineraire)

    toast({
      title: "Activité supprimée",
      description: "L'activité a été supprimée de votre itinéraire.",
    })
  }

  // Mettre à jour les détails d'une activité
  const mettreAJourActivite = (jourIndex: number, activiteIndex: number, champ: string, valeur: string) => {
    const newItineraire = [...itineraire]
    newItineraire[jourIndex].activites[activiteIndex] = {
      ...newItineraire[jourIndex].activites[activiteIndex],
      [champ]: valeur,
    }
    setItineraire(newItineraire)
  }

  // Sauvegarder l'itinéraire
  const sauvegarderItineraire = () => {
    // Dans une implémentation réelle, vous enverriez l'itinéraire à l'API
    console.log("Itinéraire sauvegardé:", itineraire)

    toast({
      title: "Itinéraire sauvegardé",
      description: "Votre itinéraire a été sauvegardé avec succès.",
    })
  }

  // Formater une date
  const formaterDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mb-4"></div>
        <p className="text-lg font-medium">Chargement du planificateur d'itinéraire...</p>
      </div>
    )
  }

  if (!voyage) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg font-medium">Voyage non trouvé</p>
        <Button onClick={() => router.back()} className="mt-4">
          Retour
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold text-teal-600 dark:text-teal-400">Planificateur d'itinéraire</h1>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-semibold">{voyage.nom}</h2>
          <p className="text-muted-foreground flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Du {new Date(voyage.date_depart).toLocaleDateString()} au{" "}
            {new Date(voyage.date_arrive_prevu).toLocaleDateString()}
            <span className="mx-2">•</span>
            <Clock className="h-4 w-4 mr-1" />
            {voyage.duree} jours
            <span className="mx-2">•</span>
            <MapPin className="h-4 w-4 mr-1" />
            {voyage.ville_arrive}
          </p>
        </div>
        <div className="flex space-x-2 mt-2 sm:mt-0">
          <Button variant="outline" onClick={sauvegarderItineraire}>
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
          <SocialShare
            title={`Mon itinéraire pour ${voyage.nom}`}
            description={`Découvrez l'itinéraire que j'ai planifié pour mon voyage à ${voyage.ville_arrive}`}
            url={`https://agence-voyage.com/voyage/${id}/planificateur`}
            variant="icon"
          />
        </div>
      </div>

      <Tabs defaultValue="planificateur" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full md:w-[400px]">
          <TabsTrigger value="planificateur">Planificateur</TabsTrigger>
          <TabsTrigger value="apercu">Aperçu</TabsTrigger>
        </TabsList>

        <TabsContent value="planificateur" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Liste des activités suggérées */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Activités suggérées</CardTitle>
                <CardDescription>Glissez-déposez les activités dans votre itinéraire</CardDescription>
                <div className="mt-2">
                  <Select value={filtreCategorie} onValueChange={setFiltreCategorie}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="toutes">Toutes les catégories</SelectItem>
                      <SelectItem value="attraction">Attractions</SelectItem>
                      <SelectItem value="culture">Culture</SelectItem>
                      <SelectItem value="detente">Détente</SelectItem>
                      <SelectItem value="gastronomie">Gastronomie</SelectItem>
                      <SelectItem value="shopping">Shopping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="max-h-[600px] overflow-y-auto">
                <div className="space-y-3">
                  {activitesFiltrees.map((activite) => (
                    <Card key={activite.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="p-3 pb-0">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{activite.nom}</CardTitle>
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            {activite.duree}h
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-1">
                        <p className="text-xs text-muted-foreground">{activite.description}</p>
                      </CardContent>
                      <CardFooter className="p-3 pt-0">
                        <Select onValueChange={(value) => ajouterActivite(Number.parseInt(value), activite)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Ajouter à un jour" />
                          </SelectTrigger>
                          <SelectContent>
                            {itineraire.map((jour, index) => (
                              <SelectItem key={index} value={index.toString()}>
                                Jour {index + 1} - {formaterDate(jour.date)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Planificateur d'itinéraire */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Votre itinéraire</CardTitle>
                <CardDescription>Organisez vos activités jour par jour</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {itineraire.map((jour, jourIndex) => (
                  <Card key={jourIndex}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        Jour {jourIndex + 1} - {formaterDate(jour.date)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {jour.activites.length === 0 ? (
                        <div className="text-center py-6 border-2 border-dashed rounded-md">
                          <p className="text-muted-foreground">Aucune activité planifiée pour ce jour</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Ajoutez des activités depuis la liste des suggestions
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {jour.activites.map((activite, activiteIndex) => (
                            <Card key={activiteIndex}>
                              <CardHeader className="p-3 pb-0">
                                <div className="flex justify-between items-start">
                                  <CardTitle className="text-base">{activite.nom}</CardTitle>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => supprimerActivite(jourIndex, activiteIndex)}
                                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardHeader>
                              <CardContent className="p-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                                  <div>
                                    <label className="text-xs font-medium">Heure de début</label>
                                    <Input
                                      type="time"
                                      value={activite.heure_debut}
                                      onChange={(e) =>
                                        mettreAJourActivite(jourIndex, activiteIndex, "heure_debut", e.target.value)
                                      }
                                      className="mt-1"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs font-medium">Durée</label>
                                    <div className="flex items-center mt-1">
                                      <Input
                                        type="number"
                                        value={activite.duree}
                                        disabled
                                        className="bg-gray-50 dark:bg-gray-800"
                                      />
                                      <span className="ml-2">heures</span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-xs font-medium">Notes</label>
                                  <Textarea
                                    placeholder="Ajoutez des notes personnelles..."
                                    value={activite.notes}
                                    onChange={(e) =>
                                      mettreAJourActivite(jourIndex, activiteIndex, "notes", e.target.value)
                                    }
                                    className="mt-1"
                                    rows={2}
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="apercu">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Aperçu de votre itinéraire</CardTitle>
                  <CardDescription>Récapitulatif de votre voyage jour par jour</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => window.print()}>
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimer
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-md">
                <h2 className="text-xl font-bold">{voyage.nom}</h2>
                <p className="text-muted-foreground">
                  Du {new Date(voyage.date_depart).toLocaleDateString()} au{" "}
                  {new Date(voyage.date_arrive_prevu).toLocaleDateString()} • {voyage.duree} jours
                </p>
              </div>

              {itineraire.map((jour, jourIndex) => (
                <div key={jourIndex} className="space-y-3">
                  <h3 className="text-lg font-semibold border-b pb-2">
                    Jour {jourIndex + 1} - {formaterDate(jour.date)}
                  </h3>

                  {jour.activites.length === 0 ? (
                    <p className="text-muted-foreground italic">Aucune activité planifiée pour ce jour</p>
                  ) : (
                    <div className="space-y-4">
                      {jour.activites.map((activite, activiteIndex) => (
                        <div key={activiteIndex} className="flex">
                          <div className="mr-4 text-right w-16">
                            <span className="font-mono">{activite.heure_debut}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{activite.nom}</h4>
                            <p className="text-sm text-muted-foreground">Durée: {activite.duree}h</p>
                            {activite.notes && (
                              <p className="text-sm mt-1 bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                                {activite.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default withAuth(PlanificateurItineraire)

