"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { VoyageService } from "@/services/service-voyages"
import { Voyage } from "@/types/voyages"
import { VoyageCard } from "@/components/VoyageCard" // Chemin selon ton projet
import { ChevronLeft, ChevronRight, Search, Plus } from "lucide-react"

const ITEMS_PER_PAGE = 6 // Tu peux changer selon ce que tu veux afficher

export default function VoyagesPage() {
  const [voyages, setVoyages] = useState<Voyage[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: keyof Voyage; direction: "asc" | "desc" } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVoyages = async () => {
      try {
        const data = await VoyageService.getVoyages()
        setVoyages(data)
        setLoading(false)
      } catch (err) {
        setError("Erreur lors de la récupération des voyages")
        console.error(err)
        setLoading(false)
      }
    }
    fetchVoyages()
  }, [])

  const filteredVoyages = voyages.filter((voyage) =>
    voyage.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voyage.destination_nom?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedVoyages = [...filteredVoyages].sort((a, b) => {
    if (!sortConfig) return 0
    const { key, direction } = sortConfig
    if ((a[key] ?? "") < (b[key] ?? "")) return direction === "asc" ? -1 : 1
    if ((a[key] ?? "") > (b[key] ?? "")) return direction === "asc" ? 1 : -1
    return 0
  })

  const totalPages = Math.ceil(sortedVoyages.length / ITEMS_PER_PAGE)
  const paginatedVoyages = sortedVoyages.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const requestSort = (key: keyof Voyage) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  if (loading) return <div className="text-center mt-10">Chargement...</div>
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Rechercher un voyage..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
            className="pl-10"
          />
        </div>
        <Link href="/responsable/tour/voyages/ajouter">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Ajouter un voyage
          </Button>
        </Link>
      </div>

      {/* Tri options */}
      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
        <Button variant="outline" onClick={() => requestSort("titre")}>Trier par Nom</Button>
        <Button variant="outline" onClick={() => requestSort("destination_nom")}>Trier par Destination</Button>
        <Button variant="outline" onClick={() => requestSort("prix")}>Trier par Prix</Button>
      </div>

      {/* Grid de voyages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {paginatedVoyages.map((voyage) => (
          <VoyageCard key={voyage.id} voyage={voyage} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button variant="outline" onClick={handlePrevious} disabled={currentPage === 1}>
            <ChevronLeft className="w-4 h-4" /> Précédent
          </Button>
          <span className="text-sm font-semibold">{currentPage} / {totalPages}</span>
          <Button variant="outline" onClick={handleNext} disabled={currentPage === totalPages}>
            Suivant <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
