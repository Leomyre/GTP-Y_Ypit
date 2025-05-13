"use client"

import { useState } from "react"

export type FiltresVoyage = {
    ordre: "asc" | "desc"
    prixMin: number
    prixMax: number
    confort: string
}

type Props = {
    onFilterChange: (filtres: FiltresVoyage) => void
}

export default function VoyageFilters({ onFilterChange }: Props) {
    const [ordre, setOrdre] = useState<"asc" | "desc">("asc")
    const [prixMin, setPrixMin] = useState(0)
    const [prixMax, setPrixMax] = useState(10000)
    const [confort, setConfort] = useState("")

    const handleChange = (
        newOrdre = ordre,
        newPrixMin = prixMin,
        newPrixMax = prixMax,
        newConfort = confort
    ) => {
        onFilterChange({
            ordre: newOrdre,
            prixMin: newPrixMin,
            prixMax: newPrixMax,
            confort: newConfort,
        })
    }

    return (
        <div className="mb-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm">
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">Filtres de recherche</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tri</label>
                    <select
                        value={ordre}
                        onChange={(e) => {
                            const value = e.target.value as "asc" | "desc"
                            setOrdre(value)
                            handleChange(value)
                        }}
                        className="w-full p-2 border rounded-md bg-white dark:bg-gray-900 dark:border-gray-600"
                    >
                        <option value="asc">Titre A → Z</option>
                        <option value="desc">Titre Z → A</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prix min (€)</label>
                    <input
                        type="number"
                        value={prixMin}
                        onChange={(e) => {
                            const value = Number(e.target.value)
                            setPrixMin(value)
                            handleChange(ordre, value, prixMax, confort)
                        }}
                        className="w-full p-2 border rounded-md bg-white dark:bg-gray-900 dark:border-gray-600"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prix max (€)</label>
                    <input
                        type="number"
                        value={prixMax}
                        onChange={(e) => {
                            const value = Number(e.target.value)
                            setPrixMax(value)
                            handleChange(ordre, prixMin, value, confort)
                        }}
                        className="w-full p-2 border rounded-md bg-white dark:bg-gray-900 dark:border-gray-600"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Niveau de confort</label>
                    <select
                        value={confort}
                        onChange={(e) => {
                            const value = e.target.value
                            setConfort(value)
                            handleChange(ordre, prixMin, prixMax, value)
                        }}
                        className="w-full p-2 border rounded-md bg-white dark:bg-gray-900 dark:border-gray-600"
                    >
                        <option value="">Tous</option>
                        <option value="1">★</option>
                        <option value="2">★★</option>
                        <option value="3">★★★</option>
                        <option value="4">★★★★</option>
                        <option value="5">★★★★★</option>
                    </select>
                </div>
            </div>
        </div>
    )
}
