"use client"

import { useState, useEffect } from "react"
import { VoyageCard } from "@/components/VoyageCard"
import { VoyageService } from "@/services/service-voyages" // Ajustez le chemin selon votre structure
import { Voyage } from "@/types/voyages"

export default function VoyagesPopulaires() {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [voyagesPopulaires, setVoyagesPopulaires] = useState<Voyage[]>([])

  useEffect(() => {
    const fetchVoyagesPopulaires = async () => {
      try {
        const data = await VoyageService.getPopularVoyages();
        setVoyagesPopulaires(data); // Utilise directement le tableau retourné
        setLoading(false);
      } catch (err) {
        setError("Erreur lors de la récupération des voyages");
        setLoading(false);
        console.error(err);
      }
    };

    fetchVoyagesPopulaires();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">Voyages Recommandés</h1>
        <div className="text-center animate-pulse text-gray-500">Chargement...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">Voyages Recommandés</h1>
        <div className="text-center text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">Voyages Populaires</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {voyagesPopulaires.map((voyages) => (
          <VoyageCard key={voyages.id} voyage={voyages} />
        ))}
      </div>
    </div>
  )
}

