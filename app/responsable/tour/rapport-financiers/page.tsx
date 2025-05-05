"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Download, TrendingUp } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"

// Types pour les données financières
type DonneeFinanciere = {
  id: string
  mois: string
  annee: number
  chiffreAffaires: number
  couts: number
  marge: number
  tauxMarge: number
}

type DonneeDestination = {
  id: string
  destination: string
  chiffreAffaires: number
  couts: number
  marge: number
  tauxMarge: number
  pourcentage: number
}

// Données fictives pour les rapports financiers
const donneesFinancieres: DonneeFinanciere[] = [
  { id: "1", mois: "Janvier", annee: 2023, chiffreAffaires: 125000, couts: 87500, marge: 37500, tauxMarge: 30 },
  { id: "2", mois: "Février", annee: 2023, chiffreAffaires: 132000, couts: 92400, marge: 39600, tauxMarge: 30 },
  { id: "3", mois: "Mars", annee: 2023, chiffreAffaires: 145000, couts: 98600, marge: 46400, tauxMarge: 32 },
  { id: "4", mois: "Avril", annee: 2023, chiffreAffaires: 160000, couts: 108800, marge: 51200, tauxMarge: 32 },
  { id: "5", mois: "Mai", annee: 2023, chiffreAffaires: 175000, couts: 119000, marge: 56000, tauxMarge: 32 },
  { id: "6", mois: "Juin", annee: 2023, chiffreAffaires: 190000, couts: 129200, marge: 60800, tauxMarge: 32 },
  { id: "7", mois: "Juillet", annee: 2023, chiffreAffaires: 210000, couts: 142800, marge: 67200, tauxMarge: 32 },
  { id: "8", mois: "Août", annee: 2023, chiffreAffaires: 225000, couts: 153000, marge: 72000, tauxMarge: 32 },
  { id: "9", mois: "Septembre", annee: 2023, chiffreAffaires: 195000, couts: 132600, marge: 62400, tauxMarge: 32 },
  { id: "10", mois: "Octobre", annee: 2023, chiffreAffaires: 180000, couts: 122400, marge: 57600, tauxMarge: 32 },
  { id: "11", mois: "Novembre", annee: 2023, chiffreAffaires: 165000, couts: 112200, marge: 52800, tauxMarge: 32 },
  { id: "12", mois: "Décembre", annee: 2023, chiffreAffaires: 195000, couts: 132600, marge: 62400, tauxMarge: 32 },
]

const donneesDestinations: DonneeDestination[] = [
  {
    id: "1",
    destination: "Paris",
    chiffreAffaires: 250000,
    couts: 175000,
    marge: 75000,
    tauxMarge: 30,
    pourcentage: 15,
  },
  {
    id: "2",
    destination: "Rome",
    chiffreAffaires: 200000,
    couts: 140000,
    marge: 60000,
    tauxMarge: 30,
    pourcentage: 12,
  },
  {
    id: "3",
    destination: "Barcelone",
    chiffreAffaires: 180000,
    couts: 126000,
    marge: 54000,
    tauxMarge: 30,
    pourcentage: 11,
  },
  {
    id: "4",
    destination: "Londres",
    chiffreAffaires: 220000,
    couts: 154000,
    marge: 66000,
    tauxMarge: 30,
    pourcentage: 13,
  },
  {
    id: "5",
    destination: "New York",
    chiffreAffaires: 300000,
    couts: 210000,
    marge: 90000,
    tauxMarge: 30,
    pourcentage: 18,
  },
  {
    id: "6",
    destination: "Tokyo",
    chiffreAffaires: 280000,
    couts: 196000,
    marge: 84000,
    tauxMarge: 30,
    pourcentage: 17,
  },
  {
    id: "7",
    destination: "Autres",
    chiffreAffaires: 230000,
    couts: 161000,
    marge: 69000,
    tauxMarge: 30,
    pourcentage: 14,
  },
]

// Couleurs pour les graphiques
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"]

export default function RapportsFinanciers() {
  const [periodeSelectionnee, setPeriodeSelectionnee] = useState<string>("mois")
  const [moisSelectionne, setMoisSelectionne] = useState<Date>(new Date())
  const [anneeSelectionnee, setAnneeSelectionnee] = useState<number>(new Date().getFullYear())

  // Calculer les totaux
  const totalChiffreAffaires = donneesFinancieres.reduce((acc, curr) => acc + curr.chiffreAffaires, 0)
  const totalCouts = donneesFinancieres.reduce((acc, curr) => acc + curr.couts, 0)
  const totalMarge = donneesFinancieres.reduce((acc, curr) => acc + curr.marge, 0)
  const tauxMargeMoyen = (totalMarge / totalChiffreAffaires) * 100

  // Données pour les graphiques
  const donneesGraphiqueChiffreAffaires = donneesFinancieres.map((d) => ({
    name: d.mois,
    chiffreAffaires: d.chiffreAffaires,
    couts: d.couts,
    marge: d.marge,
  }))

  const donneesGraphiqueMarge = donneesFinancieres.map((d) => ({
    name: d.mois,
    tauxMarge: d.tauxMarge,
  }))

  const donneesGraphiqueDestinations = donneesDestinations.map((d) => ({
    name: d.destination,
    value: d.chiffreAffaires,
  }))

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Rapports financiers détaillés</h1>
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exporter les rapports
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Chiffre d'affaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalChiffreAffaires.toLocaleString("fr-FR")} €</div>
            <div className="flex items-center mt-1 text-xs text-green-600">
              <TrendingUp className="h-3.5 w-3.5 mr-1" />
              <span>+8.2% par rapport à l'année précédente</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Coûts totaux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCouts.toLocaleString("fr-FR")} €</div>
            <div className="flex items-center mt-1 text-xs text-red-600">
              <TrendingUp className="h-3.5 w-3.5 mr-1" />
              <span>+5.7% par rapport à l'année précédente</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Marge brute</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMarge.toLocaleString("fr-FR")} €</div>
            <div className="flex items-center mt-1 text-xs text-green-600">
              <TrendingUp className="h-3.5 w-3.5 mr-1" />
              <span>+12.4% par rapport à l'année précédente</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taux de marge moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tauxMargeMoyen.toFixed(1)}%</div>
            <div className="flex items-center mt-1 text-xs text-green-600">
              <TrendingUp className="h-3.5 w-3.5 mr-1" />
              <span>+1.2 points par rapport à l'année précédente</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <CardDescription>Sélectionnez la période pour les rapports financiers</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3">
            <Label htmlFor="periode">Période</Label>
            <Select value={periodeSelectionnee} onValueChange={setPeriodeSelectionnee}>
              <SelectTrigger id="periode">
                <SelectValue placeholder="Sélectionner une période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mois">Mois</SelectItem>
                <SelectItem value="trimestre">Trimestre</SelectItem>
                <SelectItem value="annee">Année</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {periodeSelectionnee === "mois" && (
            <div className="w-full md:w-1/3">
              <Label htmlFor="mois">Mois</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal" id="mois">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(moisSelectionne, "MMMM yyyy", { locale: fr })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={moisSelectionne}
                    onSelect={(date) => date && setMoisSelectionne(date)}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {periodeSelectionnee === "annee" && (
            <div className="w-full md:w-1/3">
              <Label htmlFor="annee">Année</Label>
              <Select
                value={anneeSelectionnee.toString()}
                onValueChange={(value) => setAnneeSelectionnee(Number.parseInt(value))}
              >
                <SelectTrigger id="annee">
                  <SelectValue placeholder="Sélectionner une année" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2021">2021</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="apercu">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="apercu">Aperçu</TabsTrigger>
          <TabsTrigger value="chiffre-affaires">Chiffre d'affaires</TabsTrigger>
          <TabsTrigger value="rentabilite">Rentabilité</TabsTrigger>
          <TabsTrigger value="destinations">Par destination</TabsTrigger>
        </TabsList>

        <TabsContent value="apercu" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution du chiffre d'affaires et des coûts</CardTitle>
              <CardDescription>Analyse mensuelle pour l'année {anneeSelectionnee}</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={donneesGraphiqueChiffreAffaires} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value.toLocaleString("fr-FR")} €`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="chiffreAffaires"
                    name="Chiffre d'affaires"
                    stroke="#0088FE"
                    strokeWidth={2}
                  />
                  <Line type="monotone" dataKey="couts" name="Coûts" stroke="#FF8042" strokeWidth={2} />
                  <Line type="monotone" dataKey="marge" name="Marge" stroke="#00C49F" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Taux de marge mensuel</CardTitle>
                <CardDescription>Évolution du taux de marge sur l'année</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={donneesGraphiqueMarge} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value} %`} />
                    <Bar dataKey="tauxMarge" name="Taux de marge" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition du chiffre d'affaires par destination</CardTitle>
                <CardDescription>Pourcentage du chiffre d'affaires total</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={donneesGraphiqueDestinations}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {donneesGraphiqueDestinations.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value.toLocaleString("fr-FR")} €`} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="chiffre-affaires" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Détail du chiffre d'affaires</CardTitle>
              <CardDescription>Analyse détaillée du chiffre d'affaires par mois</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mois</TableHead>
                    <TableHead className="text-right">Chiffre d'affaires</TableHead>
                    <TableHead className="text-right">Évolution</TableHead>
                    <TableHead className="text-right">Prévision</TableHead>
                    <TableHead className="text-right">Écart</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donneesFinancieres.map((donnee) => (
                    <TableRow key={donnee.id}>
                      <TableCell className="font-medium">
                        {donnee.mois} {donnee.annee}
                      </TableCell>
                      <TableCell className="text-right">{donnee.chiffreAffaires.toLocaleString("fr-FR")} €</TableCell>
                      <TableCell className="text-right">
                        <span className="flex items-center justify-end text-green-600">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          +5.2%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {(donnee.chiffreAffaires * 0.95).toLocaleString("fr-FR")} €
                      </TableCell>
                      <TableCell className="text-right text-green-600">+5.0%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rentabilite" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analyse de rentabilité</CardTitle>
              <CardDescription>Détail des marges et de la rentabilité par mois</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mois</TableHead>
                    <TableHead className="text-right">Chiffre d'affaires</TableHead>
                    <TableHead className="text-right">Coûts</TableHead>
                    <TableHead className="text-right">Marge</TableHead>
                    <TableHead className="text-right">Taux de marge</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donneesFinancieres.map((donnee) => (
                    <TableRow key={donnee.id}>
                      <TableCell className="font-medium">
                        {donnee.mois} {donnee.annee}
                      </TableCell>
                      <TableCell className="text-right">{donnee.chiffreAffaires.toLocaleString("fr-FR")} €</TableCell>
                      <TableCell className="text-right">{donnee.couts.toLocaleString("fr-FR")} €</TableCell>
                      <TableCell className="text-right">{donnee.marge.toLocaleString("fr-FR")} €</TableCell>
                      <TableCell className="text-right">{donnee.tauxMarge}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="destinations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analyse par destination</CardTitle>
              <CardDescription>Performance financière par destination</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Destination</TableHead>
                    <TableHead className="text-right">Chiffre d'affaires</TableHead>
                    <TableHead className="text-right">Coûts</TableHead>
                    <TableHead className="text-right">Marge</TableHead>
                    <TableHead className="text-right">Taux de marge</TableHead>
                    <TableHead className="text-right">% du CA total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donneesDestinations.map((donnee) => (
                    <TableRow key={donnee.id}>
                      <TableCell className="font-medium">{donnee.destination}</TableCell>
                      <TableCell className="text-right">{donnee.chiffreAffaires.toLocaleString("fr-FR")} €</TableCell>
                      <TableCell className="text-right">{donnee.couts.toLocaleString("fr-FR")} €</TableCell>
                      <TableCell className="text-right">{donnee.marge.toLocaleString("fr-FR")} €</TableCell>
                      <TableCell className="text-right">{donnee.tauxMarge}%</TableCell>
                      <TableCell className="text-right">{donnee.pourcentage}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

