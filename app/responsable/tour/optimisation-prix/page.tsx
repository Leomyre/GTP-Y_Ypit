"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toastx"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react"

// Données statiques pour l'exemple (à remplacer par un appel API réel)


const historiquePrix = [
  { mois: "Janvier", paris: 1100, bali: 1900, newyork: 1400, kenya: 2300, tokyo: 1900 },
  { mois: "Février", paris: 1150, bali: 1850, newyork: 1450, kenya: 2250, tokyo: 1950 },
  { mois: "Mars", paris: 1200, bali: 1800, newyork: 1500, kenya: 2200, tokyo: 2000 },
  { mois: "Avril", paris: 1250, bali: 1750, newyork: 1550, kenya: 2150, tokyo: 2050 },
  { mois: "Mai", paris: 1300, bali: 1700, newyork: 1600, kenya: 2100, tokyo: 2100 },
  { mois: "Juin", paris: 1250, bali: 1750, newyork: 1550, kenya: 2150, tokyo: 2050 },
]

const facteursSaisonniers = [
  { mois: "Janvier", coefficient: 0.8 },
  { mois: "Février", coefficient: 0.9 },
  { mois: "Mars", coefficient: 1.0 },
  { mois: "Avril", coefficient: 1.1 },
  { mois: "Mai", coefficient: 1.2 },
  { mois: "Juin", coefficient: 1.3 },
  { mois: "Juillet", coefficient: 1.4 },
  { mois: "Août", coefficient: 1.4 },
  { mois: "Septembre", coefficient: 1.2 },
  { mois: "Octobre", coefficient: 1.0 },
  { mois: "Novembre", coefficient: 0.9 },
  { mois: "Décembre", coefficient: 1.1 },
]

import { VoyageService } from "@/services/service-voyages" // Ajustez le chemin selon votre structure
import { Voyage } from "@/types/voyages"

export default function OptimisationPrix() {

  const [voyages, setVoyages] = useState<Voyage[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVoyages = async () => {
      try {
        const data = await VoyageService.getVoyages();
        setVoyages(data); // Utilise directement le tableau retourné
        setLoading(false);
      } catch (err) {
        setError("Erreur lors de la récupération des voyages");
        setLoading(false);
        console.error(err);
      }
    };

    fetchVoyages();
  }, []);


  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("recommandations")
  const [selectedVoyage, setSelectedVoyage] = useState<string | null>(null)
  const [parametres, setParametres] = useState({
    poids_demande: 40,
    poids_saison: 30,
    poids_concurrence: 20,
    poids_remplissage: 10,
    ajustement_auto: false,
    seuil_ajustement: 5,
    frequence_analyse: "quotidienne",
  })
  const [isCalculating, setIsCalculating] = useState(false)

  const handleParametreChange = (key: string, value: number | boolean | string) => {
    setParametres((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleRecalculer = () => {
    setIsCalculating(true)

    // Simuler un calcul
    setTimeout(() => {
      toast({
        title: "Recommandations mises à jour",
        description: "Les prix recommandés ont été recalculés avec les nouveaux paramètres.",
      })
      setIsCalculating(false)
    }, 1500)
  }

  const handleAppliquerTout = () => {
    toast({
      title: "Prix mis à jour",
      description: "Tous les prix recommandés ont été appliqués avec succès.",
    })
  }

  const handleAppliquerPrix = (voyageId: number) => {
    toast({
      title: "Prix mis à jour",
      description: `Le prix recommandé a été appliqué pour le voyage #${voyageId}.`,
    })
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Optimisation Dynamique des Prix</h1>

      <Tabs defaultValue="recommandations" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="recommandations">Recommandations</TabsTrigger>
          <TabsTrigger value="historique">Historique & Tendances</TabsTrigger>
          <TabsTrigger value="parametres">Paramètres</TabsTrigger>
        </TabsList>

        {/* Onglet Recommandations */}
        <TabsContent value="recommandations" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Recommandations de prix</h2>
              <p className="text-muted-foreground">
                Basées sur l'analyse de la demande, la saisonnalité et la concurrence
              </p>
            </div>
            <Button onClick={handleAppliquerTout}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Appliquer tous les prix recommandés
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Voyage</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Prix actuel</TableHead>
                    <TableHead>Prix recommandé</TableHead>
                    <TableHead>Variation</TableHead>
                    <TableHead>Facteurs</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {voyages.map((voyage) => (
                    <TableRow key={voyage.id}>
                      <TableCell className="font-medium">{voyage.nom}</TableCell>
                      <TableCell>{voyage.destination}</TableCell>
                      <TableCell>{voyage.prix_actuel} €</TableCell>
                      <TableCell className="font-semibold">{voyage.prix_recommande} €</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {voyage.tendance === "hausse" ? (
                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                          ) : voyage.tendance === "baisse" ? (
                            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                          ) : (
                            <span className="h-4 w-4 mr-1">→</span>
                          )}
                          <span
                            className={
                              voyage.variation > 0 ? "text-green-600" : voyage.variation < 0 ? "text-red-600" : ""
                            }
                          >
                            {voyage.variation > 0 ? "+" : ""}
                            {voyage.variation}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => setSelectedVoyage(voyage.id.toString())}>
                          Voir détails
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => handleAppliquerPrix(voyage.id)}>
                          Appliquer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {selectedVoyage && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Détails des facteurs - {voyages.find((v) => v.id.toString() === selectedVoyage)?.nom}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Demande</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {voyages.find((v) => v.id.toString() === selectedVoyage)?.demande}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Impact sur le prix: +{Math.round(parametres.poids_demande * 0.1 * 10) / 10}%
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Saisonnalité</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {voyages.find((v) => v.id.toString() === selectedVoyage)?.saison}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Impact sur le prix: +{Math.round(parametres.poids_saison * 0.08 * 10) / 10}%
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Concurrence</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {voyages.find((v) => v.id.toString() === selectedVoyage)?.concurrence}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Impact sur le prix: -{Math.round(parametres.poids_concurrence * 0.05 * 10) / 10}%
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Taux de remplissage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {voyages.find((v) => v.id.toString() === selectedVoyage)?.taux_remplissage}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Impact sur le prix: +{Math.round(parametres.poids_remplissage * 0.07 * 10) / 10}%
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Onglet Historique & Tendances */}
        <TabsContent value="historique" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des prix sur 6 mois</CardTitle>
              <CardDescription>Visualisez les tendances de prix pour chaque destination</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historiquePrix}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="paris" stroke="#8884d8" name="Paris" />
                    <Line type="monotone" dataKey="bali" stroke="#82ca9d" name="Bali" />
                    <Line type="monotone" dataKey="newyork" stroke="#ffc658" name="New York" />
                    <Line type="monotone" dataKey="kenya" stroke="#ff8042" name="Kenya" />
                    <Line type="monotone" dataKey="tokyo" stroke="#0088fe" name="Tokyo" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Coefficients saisonniers</CardTitle>
              <CardDescription>Impact de la saisonnalité sur les prix</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={facteursSaisonniers}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis domain={[0, 1.5]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="coefficient" fill="#8884d8" name="Coefficient saisonnier" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Paramètres */}
        <TabsContent value="parametres" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres d'optimisation des prix</CardTitle>
              <CardDescription>Configurez les facteurs qui influencent les recommandations de prix</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Poids des facteurs</h3>
                <p className="text-sm text-muted-foreground">
                  Définissez l'importance relative de chaque facteur dans le calcul du prix recommandé. La somme des
                  poids doit être égale à 100%.
                </p>

                <div className="space-y-2">
                  <Label>Demande du marché ({parametres.poids_demande}%)</Label>
                  <Slider
                    value={[parametres.poids_demande]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={(value) => handleParametreChange("poids_demande", value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Saisonnalité ({parametres.poids_saison}%)</Label>
                  <Slider
                    value={[parametres.poids_saison]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={(value) => handleParametreChange("poids_saison", value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Concurrence ({parametres.poids_concurrence}%)</Label>
                  <Slider
                    value={[parametres.poids_concurrence]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={(value) => handleParametreChange("poids_concurrence", value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Taux de remplissage ({parametres.poids_remplissage}%)</Label>
                  <Slider
                    value={[parametres.poids_remplissage]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={(value) => handleParametreChange("poids_remplissage", value[0])}
                  />
                </div>

                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">
                    Total:{" "}
                    {parametres.poids_demande +
                      parametres.poids_saison +
                      parametres.poids_concurrence +
                      parametres.poids_remplissage}
                    %
                    {parametres.poids_demande +
                      parametres.poids_saison +
                      parametres.poids_concurrence +
                      parametres.poids_remplissage !==
                      100 && <span className="text-red-500 ml-2">(La somme doit être égale à 100%)</span>}
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-medium">Automatisation</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="ajustement_auto">Ajustement automatique des prix</Label>
                    <p className="text-sm text-muted-foreground">Appliquer automatiquement les prix recommandés</p>
                  </div>
                  <Switch
                    id="ajustement_auto"
                    checked={parametres.ajustement_auto}
                    onCheckedChange={(checked) => handleParametreChange("ajustement_auto", checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seuil_ajustement">Seuil d'ajustement (%)</Label>
                  <p className="text-sm text-muted-foreground">
                    Appliquer automatiquement les changements de prix supérieurs à ce seuil
                  </p>
                  <Input
                    id="seuil_ajustement"
                    type="number"
                    min={0}
                    max={20}
                    value={parametres.seuil_ajustement}
                    onChange={(e) => handleParametreChange("seuil_ajustement", Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequence_analyse">Fréquence d'analyse</Label>
                  <Select
                    value={parametres.frequence_analyse}
                    onValueChange={(value) => handleParametreChange("frequence_analyse", value)}
                  >
                    <SelectTrigger id="frequence_analyse">
                      <SelectValue placeholder="Sélectionner une fréquence" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quotidienne">Quotidienne</SelectItem>
                      <SelectItem value="hebdomadaire">Hebdomadaire</SelectItem>
                      <SelectItem value="mensuelle">Mensuelle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleRecalculer} disabled={isCalculating} className="w-full">
                {isCalculating ? (
                  <>
                    <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
                    Recalcul en cours...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Recalculer les recommandations
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

