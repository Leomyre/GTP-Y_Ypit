"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table } from "@/components/ui/table"
import { ArrowLeft } from "lucide-react"
import VoyageService from "@/services/service-voyages"

interface Voyage {
    id: number
    nom: string
    ville_depart: string
    ville_arrive: string
    date_depart: string
    date_arrive_prevu: string
    prix: number
    places_disponibles: number
    image: string
    agence_nom: string
    etoiles: number
    likes: number
    description: string
    inclus: string[]
    duree: number
    wifi: boolean
    transfert_aeroport: boolean
    guide_francophone: boolean
    pension_complete: boolean
}

interface ComparaisonTableProps {
    initialSelectedIds: number[]
}

export function ComparaisonTable({ initialSelectedIds }: ComparaisonTableProps) {
    const router = useRouter()
    const [selectedVoyages, setSelectedVoyages] = useState<number[]>(initialSelectedIds)
    const [availableVoyages, setAvailableVoyages] = useState<Voyage[]>([])
    const [loading, setLoading] = useState(true)
    const [voyagesDetails, setVoyagesDetails] = useState<Record<number, Voyage>>({})

    useEffect(() => {
        const fetchVoyages = async () => {
            try {
                const voyages = await VoyageService.getVoyages()
                setAvailableVoyages(voyages)
            } catch (error) {
                console.error("Erreur lors du chargement des voyages:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchVoyages()
    }, [])

    useEffect(() => {
        if (initialSelectedIds.length > 0) {
            fetchVoyagesDetails(initialSelectedIds)
        }
    }, [initialSelectedIds])

    const fetchVoyagesDetails = async (ids: number[]) => {
        try {
            const details: Record<number, Voyage> = {}
            for (const id of ids) {
                const voyage = await VoyageService.getVoyageDetails(id)
                details[id] = voyage
            }
            setVoyagesDetails(details)
        } catch (error) {
            console.error("Erreur lors du chargement des détails des voyages:", error)
        }
    }

    const handleAddVoyage = async (id: string) => {
        const numId = Number(id)
        if (!selectedVoyages.includes(numId)) {
            try {
                const newSelectedVoyages = [...selectedVoyages, numId]
                setSelectedVoyages(newSelectedVoyages)

                const voyage = await VoyageService.getVoyageDetails(numId)
                setVoyagesDetails(prev => ({ ...prev, [numId]: voyage }))
            } catch (error) {
                console.error("Erreur lors de l'ajout du voyage:", error)
            }
        }
    }

    const voyagesToCompare = selectedVoyages.map(id => voyagesDetails[id]).filter(Boolean)

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 flex justify-center">
                <p>Chargement des voyages...</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            <div className="flex items-center mb-6">
                <Button variant="outline" onClick={() => router.back()} className="mr-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Retour
                </Button>
                <h1 className="text-3xl font-bold text-teal-600 dark:text-teal-400">Comparaison de voyages</h1>
            </div>

            {selectedVoyages.length < 3 && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Ajouter un voyage à comparer</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Select onValueChange={handleAddVoyage}>
                                <SelectTrigger className="w-full sm:w-[300px]">
                                    <SelectValue placeholder="Sélectionner un voyage" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableVoyages
                                        .filter((voyage) => !selectedVoyages.includes(voyage.id))
                                        .map((voyage) => (
                                            <SelectItem key={voyage.id} value={voyage.id.toString()}>
                                                {voyage.nom} - {voyage.ville_arrive}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            <p className="text-sm text-muted-foreground">Vous pouvez comparer jusqu&aposà 3 voyages simultanément.</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {voyagesToCompare.length > 0 ? (
                <div className="overflow-x-auto">
                    <Table className="border-collapse">
                        {/* ... (le reste de votre tableau de comparaison) ... */}
                    </Table>
                </div>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <p className="text-lg font-medium mb-4">Aucun voyage sélectionné pour la comparaison</p>
                        <p className="text-muted-foreground mb-6 text-center">
                            Veuillez sélectionner au moins un voyage pour commencer la comparaison.
                        </p>
                        <Button onClick={() => router.push("/client/accueil")}>Parcourir les voyages</Button>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}