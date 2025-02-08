"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Search } from "lucide-react"

// Simuler des données de voyage
const voyages = [
  {
    id: 1,
    nom: "Paris Romantique",
    destination: "Paris",
    dateDepart: "2024-06-15",
    duree: 7,
    prix: 1200,
    placesDisponibles: 20,
  },
  {
    id: 2,
    nom: "Aventure à Bali",
    destination: "Bali",
    dateDepart: "2024-07-01",
    duree: 10,
    prix: 1800,
    placesDisponibles: 15,
  },
  {
    id: 3,
    nom: "New York City Break",
    destination: "New York",
    dateDepart: "2024-08-10",
    duree: 5,
    prix: 1500,
    placesDisponibles: 25,
  },
  {
    id: 4,
    nom: "Safari Kenyan",
    destination: "Kenya",
    dateDepart: "2024-09-05",
    duree: 8,
    prix: 2200,
    placesDisponibles: 12,
  },
  {
    id: 5,
    nom: "Tokyo Découverte",
    destination: "Tokyo",
    dateDepart: "2024-10-20",
    duree: 9,
    prix: 2000,
    placesDisponibles: 18,
  },
]

export default function VoyagesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)

  const filteredVoyages = voyages.filter(
    (voyage) =>
      voyage.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voyage.destination.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedVoyages = [...filteredVoyages].sort((a, b) => {
    if (!sortConfig) return 0
    const { key, direction } = sortConfig
    if (a[key as keyof typeof a] < b[key as keyof typeof b]) {
      return direction === "asc" ? -1 : 1
    }
    if (a[key as keyof typeof a] > b[key as keyof typeof b]) {
      return direction === "asc" ? 1 : -1
    }
    return 0
  })

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Liste des Voyages</h1>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Rechercher un voyage..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button>Ajouter un voyage</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">
                <button className="flex items-center" onClick={() => requestSort("nom")}>
                  Nom <ChevronDown size={16} />
                </button>
              </TableHead>
              <TableHead>
                <button className="flex items-center" onClick={() => requestSort("destination")}>
                  Destination <ChevronDown size={16} />
                </button>
              </TableHead>
              <TableHead>
                <button className="flex items-center" onClick={() => requestSort("dateDepart")}>
                  Date de départ <ChevronDown size={16} />
                </button>
              </TableHead>
              <TableHead>Durée</TableHead>
              <TableHead>
                <button className="flex items-center" onClick={() => requestSort("prix")}>
                  Prix <ChevronDown size={16} />
                </button>
              </TableHead>
              <TableHead>Places disponibles</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedVoyages.map((voyage) => (
              <TableRow key={voyage.id}>
                <TableCell className="font-medium">{voyage.nom}</TableCell>
                <TableCell>{voyage.destination}</TableCell>
                <TableCell>{new Date(voyage.dateDepart).toLocaleDateString()}</TableCell>
                <TableCell>{voyage.duree} jours</TableCell>
                <TableCell>{voyage.prix} €</TableCell>
                <TableCell>{voyage.placesDisponibles}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Ouvrir le menu</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                      <DropdownMenuItem>Modifier</DropdownMenuItem>
                      <DropdownMenuItem>Supprimer</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

