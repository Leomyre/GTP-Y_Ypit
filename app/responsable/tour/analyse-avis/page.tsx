"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
} from "lucide-react"

// Données statiques pour l'exemple (à remplacer par un appel API réel)
const avis = [
  {
    id: 1,
    client: "Marie Dupont",
    voyage: "Paris Romantique",
    note: 5,
    commentaire:
      "Séjour parfait ! L'hôtel était magnifique et le service impeccable. La visite guidée de la Tour Eiffel était très instructive.",
    date: "2024-06-10",
    sentiment: "positif",
    themes: ["hébergement", "service", "visite guidée"],
    mots_cles: ["magnifique", "impeccable", "instructive"],
  },
  {
    id: 2,
    client: "Jean Martin",
    voyage: "Aventure à Bali",
    note: 3,
    commentaire:
      "Voyage correct mais déçu par l'hôtel qui ne correspondait pas aux photos. Les excursions étaient bien organisées cependant.",
    date: "2024-06-08",
    sentiment: "mitigé",
    themes: ["hébergement", "excursions", "organisation"],
    mots_cles: ["déçu", "ne correspondait pas", "bien organisées"],
  },
  {
    id: 3,
    client: "Sophie Petit",
    voyage: "New York City Break",
    note: 4,
    commentaire:
      "Très bon séjour à New York ! Le guide était excellent et connaissait parfaitement la ville. Seul bémol : le bruit dans l'hôtel.",
    date: "2024-06-05",
    sentiment: "positif",
    themes: ["guide", "hébergement", "bruit"],
    mots_cles: ["excellent", "parfaitement", "bruit"],
  },
  {
    id: 4,
    client: "Pierre Durand",
    voyage: "Safari Kenyan",
    note: 2,
    commentaire:
      "Déçu par ce safari. Le lodge était sale et mal entretenu. Les safaris étaient trop courts et nous n'avons pas vu beaucoup d'animaux.",
    date: "2024-06-03",
    sentiment: "négatif",
    themes: ["hébergement", "propreté", "safari", "animaux"],
    mots_cles: ["déçu", "sale", "mal entretenu", "trop courts"],
  },
  {
    id: 5,
    client: "Claire Leroy",
    voyage: "Tokyo Découverte",
    note: 5,
    commentaire:
      "Voyage exceptionnel au Japon ! L'organisation était parfaite, le guide parlait très bien français et les visites étaient passionnantes.",
    date: "2024-06-01",
    sentiment: "positif",
    themes: ["organisation", "guide", "visites"],
    mots_cles: ["exceptionnel", "parfaite", "passionnantes"],
  },
]

const statistiques = {
  note_moyenne: 3.8,
  repartition_notes: [
    { note: 5, count: 2 },
    { note: 4, count: 1 },
    { note: 3, count: 1 },
    { note: 2, count: 1 },
    { note: 1, count: 0 },
  ],
  sentiments: [
    { name: "Positif", value: 60 },
    { name: "Mitigé", value: 20 },
    { name: "Négatif", value: 20 },
  ],
  themes_frequents: [
    { theme: "Hébergement", count: 4, sentiment: -0.25 },
    { theme: "Guide/Service", count: 3, sentiment: 0.67 },
    { theme: "Organisation", count: 3, sentiment: 0.67 },
    { theme: "Visites/Excursions", count: 3, sentiment: 0.33 },
    { theme: "Propreté", count: 1, sentiment: -1.0 },
  ],
  evolution_notes: [
    { mois: "Janvier", note: 4.2 },
    { mois: "Février", note: 4.0 },
    { mois: "Mars", note: 3.9 },
    { mois: "Avril", note: 3.7 },
    { mois: "Mai", note: 3.6 },
    { mois: "Juin", note: 3.8 },
  ],
}

const COLORS = ["#0088FE", "#FFBB28", "#FF8042", "#00C49F", "#AF19FF"]

export default function AnalyseAvis() {
  const [activeTab, setActiveTab] = useState("apercu")
  const [filtreVoyage, setFiltreVoyage] = useState("tous")
  const [filtreSentiment, setFiltreSentiment] = useState("tous")
  const [filtreNote, setFiltreNote] = useState("tous")
  const [avisFiltre, setAvisFiltre] = useState(avis)

  // Appliquer les filtres
  useEffect(() => {
    let filteredAvis = [...avis]

    if (filtreVoyage !== "tous") {
      filteredAvis = filteredAvis.filter((a) => a.voyage === filtreVoyage)
    }

    if (filtreSentiment !== "tous") {
      filteredAvis = filteredAvis.filter((a) => a.sentiment === filtreSentiment)
    }

    if (filtreNote !== "tous") {
      filteredAvis = filteredAvis.filter((a) => a.note === Number.parseInt(filtreNote))
    }

    setAvisFiltre(filteredAvis)
  }, [filtreVoyage, filtreSentiment, filtreNote])

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "positif":
        return <Badge className="bg-green-500 hover:bg-green-600">Positif</Badge>
      case "mitigé":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Mitigé</Badge>
      case "négatif":
        return <Badge className="bg-red-500 hover:bg-red-600">Négatif</Badge>
      default:
        return <Badge>Inconnu</Badge>
    }
  }

  const getStarRating = (note: number) => {
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < note ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Analyse des Avis Clients</h1>

      <Tabs defaultValue="apercu" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="apercu">Aperçu</TabsTrigger>
          <TabsTrigger value="avis">Avis détaillés</TabsTrigger>
          <TabsTrigger value="tendances">Tendances & Insights</TabsTrigger>
        </TabsList>

        {/* Onglet Aperçu */}
        <TabsContent value="apercu" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <span className="text-3xl font-bold mr-2">{statistiques.note_moyenne}</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(statistiques.note_moyenne)
                            ? "text-yellow-400 fill-yellow-400"
                            : i < statistiques.note_moyenne
                              ? "text-yellow-400 fill-yellow-400 opacity-50"
                              : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground ml-2">({avis.length} avis)</span>
                </div>
                <div className="flex items-center mt-2">
                  {statistiques.evolution_notes[5].note > statistiques.evolution_notes[4].note ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {statistiques.evolution_notes[5].note > statistiques.evolution_notes[4].note
                      ? "En hausse"
                      : "En baisse"}{" "}
                    ce mois-ci
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Sentiment global</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  {statistiques.sentiments[0].value > 50 ? (
                    <ThumbsUp className="h-8 w-8 text-green-500 mr-2" />
                  ) : statistiques.sentiments[2].value > 30 ? (
                    <ThumbsDown className="h-8 w-8 text-red-500 mr-2" />
                  ) : (
                    <div className="h-8 w-8 flex items-center justify-center text-yellow-500 mr-2">
                      <span className="text-xl">~</span>
                    </div>
                  )}
                  <div>
                    <div className="text-lg font-semibold">
                      {statistiques.sentiments[0].value > 50
                        ? "Majoritairement positif"
                        : statistiques.sentiments[2].value > 30
                          ? "Préoccupant"
                          : "Mitigé"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {statistiques.sentiments[0].value}% d'avis positifs
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Points forts</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {statistiques.themes_frequents
                    .filter((theme) => theme.sentiment > 0)
                    .sort((a, b) => b.sentiment - a.sentiment)
                    .slice(0, 3)
                    .map((theme, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>{theme.theme}</span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Points à améliorer</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {statistiques.themes_frequents
                    .filter((theme) => theme.sentiment < 0)
                    .sort((a, b) => a.sentiment - b.sentiment)
                    .slice(0, 3)
                    .map((theme, index) => (
                      <li key={index} className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                        <span>{theme.theme}</span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition des notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={statistiques.repartition_notes.slice().reverse()}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis
                        dataKey="note"
                        type="category"
                        tickFormatter={(value) => `${value} étoile${value > 1 ? "s" : ""}`}
                      />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" name="Nombre d'avis" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analyse des sentiments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statistiques.sentiments}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {statistiques.sentiments.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Évolution des notes</CardTitle>
              <CardDescription>Tendance sur les 6 derniers mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statistiques.evolution_notes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Bar dataKey="note" fill="#8884d8" name="Note moyenne" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Avis détaillés */}
        <TabsContent value="avis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filtres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Select value={filtreVoyage} onValueChange={setFiltreVoyage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par voyage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les voyages</SelectItem>
                      <SelectItem value="Paris Romantique">Paris Romantique</SelectItem>
                      <SelectItem value="Aventure à Bali">Aventure à Bali</SelectItem>
                      <SelectItem value="New York City Break">New York City Break</SelectItem>
                      <SelectItem value="Safari Kenyan">Safari Kenyan</SelectItem>
                      <SelectItem value="Tokyo Découverte">Tokyo Découverte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Select value={filtreSentiment} onValueChange={setFiltreSentiment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par sentiment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les sentiments</SelectItem>
                      <SelectItem value="positif">Positif</SelectItem>
                      <SelectItem value="mitigé">Mitigé</SelectItem>
                      <SelectItem value="négatif">Négatif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Select value={filtreNote} onValueChange={setFiltreNote}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par note" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Toutes les notes</SelectItem>
                      <SelectItem value="5">5 étoiles</SelectItem>
                      <SelectItem value="4">4 étoiles</SelectItem>
                      <SelectItem value="3">3 étoiles</SelectItem>
                      <SelectItem value="2">2 étoiles</SelectItem>
                      <SelectItem value="1">1 étoile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Voyage</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Commentaire</TableHead>
                    <TableHead>Sentiment</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {avisFiltre.map((avis) => (
                    <TableRow key={avis.id}>
                      <TableCell className="font-medium">{avis.client}</TableCell>
                      <TableCell>{avis.voyage}</TableCell>
                      <TableCell>{getStarRating(avis.note)}</TableCell>
                      <TableCell>
                        <div className="max-w-md">
                          <p className="truncate">{avis.commentaire}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {avis.themes.map((theme, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {theme}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getSentimentBadge(avis.sentiment)}</TableCell>
                      <TableCell>{new Date(avis.date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Tendances & Insights */}
        <TabsContent value="tendances" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analyse des thèmes</CardTitle>
              <CardDescription>Sentiment par thème mentionné dans les avis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statistiques.themes_frequents} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="theme" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" domain={[-1, 1]} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="count" fill="#8884d8" name="Fréquence" />
                    <Bar yAxisId="right" dataKey="sentiment" fill="#82ca9d" name="Sentiment" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Insights et recommandations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Points forts à maintenir
                  </h3>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-start">
                      <div className="h-5 w-5 flex items-center justify-center mr-2">•</div>
                      <div>
                        <span className="font-medium">Guides et accompagnateurs :</span> Les clients apprécient
                        particulièrement la qualité des guides, notamment leur connaissance des lieux et leur maîtrise
                        du français.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 flex items-center justify-center mr-2">•</div>
                      <div>
                        <span className="font-medium">Organisation des voyages :</span> L'organisation générale des
                        voyages est souvent mentionnée comme un point fort, avec des itinéraires bien pensés.
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Points à améliorer
                  </h3>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-start">
                      <div className="h-5 w-5 flex items-center justify-center mr-2">•</div>
                      <div>
                        <span className="font-medium">Qualité des hébergements :</span> Plusieurs clients mentionnent
                        des problèmes avec les hébergements, notamment des différences entre les photos et la réalité.
                        Une vérification plus stricte des standards des hôtels partenaires est recommandée.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 flex items-center justify-center mr-2">•</div>
                      <div>
                        <span className="font-medium">Propreté :</span> Des problèmes de propreté ont été signalés,
                        particulièrement pour le Safari Kenyan. Une inspection des lodges et un changement de partenaire
                        pourraient être nécessaires.
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 flex items-center">
                    <Search className="h-5 w-5 mr-2" />
                    Tendances à surveiller
                  </h3>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-start">
                      <div className="h-5 w-5 flex items-center justify-center mr-2">•</div>
                      <div>
                        <span className="font-medium">Baisse progressive des notes :</span> Une légère tendance à la
                        baisse des notes moyennes a été observée sur les 5 derniers mois, avant une légère remontée en
                        juin. Cette tendance doit être surveillée de près.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 flex items-center justify-center mr-2">•</div>
                      <div>
                        <span className="font-medium">Attentes concernant les activités :</span> Les clients semblent
                        avoir des attentes de plus en plus élevées concernant la durée et la qualité des activités
                        proposées.
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <h3 className="text-lg font-semibold text-yellow-700 dark:text-yellow-300 flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Recommandations d'actions
                  </h3>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-start">
                      <div className="h-5 w-5 flex items-center justify-center mr-2">1.</div>
                      <div>
                        <span className="font-medium">Audit des hébergements :</span> Mettre en place un audit des
                        hébergements proposés, en particulier pour le Safari Kenyan et l'Aventure à Bali, afin de
                        s'assurer qu'ils correspondent aux standards de qualité annoncés.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 flex items-center justify-center mr-2">2.</div>
                      <div>
                        <span className="font-medium">Formation des guides :</span> Continuer à investir dans la
                        formation des guides, qui constituent un point fort reconnu par les clients.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 flex items-center justify-center mr-2">3.</div>
                      <div>
                        <span className="font-medium">Réponses aux avis négatifs :</span> Mettre en place un processus
                        systématique de réponse aux avis négatifs, montrant que l'entreprise est à l'écoute et prend des
                        mesures correctives.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 flex items-center justify-center mr-2">4.</div>
                      <div>
                        <span className="font-medium">Ajustement des descriptions :</span> Revoir les descriptions des
                        voyages pour s'assurer qu'elles correspondent exactement à la réalité, afin d'éviter les
                        déceptions liées à des attentes trop élevées.
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

