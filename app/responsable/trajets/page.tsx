"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus, Bus, Car, Bike, FootprintsIcon as Walking } from "lucide-react"

// Données statiques pour l'exemple
const voyages = [
  {
    id: 1,
    nom: "Paris Romantique",
    destination: "Paris",
    trajets: [
      {
        id: 1,
        nom: "Paris Express",
        etapes: [
          { moyen: "train", de: "Lyon", a: "Paris", duree: "2h" },
          { moyen: "metro", de: "Gare de Lyon", a: "Tour Eiffel", duree: "30min" },
        ],
      },
      {
        id: 2,
        nom: "Paris Scenic",
        etapes: [
          { moyen: "bus", de: "Lyon", a: "Dijon", duree: "2h" },
          { moyen: "train", de: "Dijon", a: "Paris", duree: "1h30" },
          { moyen: "velo", de: "Gare de Lyon", a: "Notre-Dame", duree: "20min" },
        ],
      },
    ],
  },
  {
    id: 2,
    nom: "Aventure à Bali",
    destination: "Bali",
    trajets: [
      {
        id: 3,
        nom: "Bali Direct",
        etapes: [
          { moyen: "avion", de: "Paris", a: "Denpasar", duree: "14h" },
          { moyen: "taxi", de: "Aéroport de Denpasar", a: "Hôtel à Ubud", duree: "1h" },
        ],
      },
    ],
  },
]

const getMoyenIcon = (moyen: string) => {
  switch (moyen) {
    case "bus":
      return <Bus className="w-4 h-4 mr-2" />
    case "train":
    case "metro":
      return <Car className="w-4 h-4 mr-2" />
    case "velo":
      return <Bike className="w-4 h-4 mr-2" />
    case "a pied":
      return <Walking className="w-4 h-4 mr-2" />
    default:
      return null
  }
}

export default function TrajetsPage() {
  const [selectedVoyage, setSelectedVoyage] = useState(voyages[0].id.toString())

  const currentVoyage = voyages.find((v) => v.id.toString() === selectedVoyage)

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Trajets par Voyage</h1>

      <div className="flex justify-between items-center">
        <Select value={selectedVoyage} onValueChange={setSelectedVoyage}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Sélectionner un voyage" />
          </SelectTrigger>
          <SelectContent>
            {voyages.map((voyage) => (
              <SelectItem key={voyage.id} value={voyage.id.toString()}>
                {voyage.nom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un trajet
        </Button>
      </div>

      {currentVoyage && (
        <Card>
          <CardHeader>
            <CardTitle>{currentVoyage.nom} - Trajets</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {currentVoyage.trajets.map((trajet) => (
                <AccordionItem key={trajet.id} value={trajet.id.toString()}>
                  <AccordionTrigger>{trajet.nom}</AccordionTrigger>
                  <AccordionContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Moyen de transport</TableHead>
                          <TableHead>De</TableHead>
                          <TableHead>À</TableHead>
                          <TableHead>Durée</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {trajet.etapes.map((etape, index) => (
                          <TableRow key={index}>
                            <TableCell className="flex items-center">
                              {getMoyenIcon(etape.moyen)}
                              {etape.moyen}
                            </TableCell>
                            <TableCell>{etape.de}</TableCell>
                            <TableCell>{etape.a}</TableCell>
                            <TableCell>{etape.duree}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

