"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { VoyageCard } from "@/components/VoyageCard"
import { VoyageService } from "@/services/service-voyages"
import { Voyage } from "@/types/voyages"
import { useAuth } from "@/hooks/useAuth"

export default function VoyagesRecommandes() {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [voyagesRecommandes, setVoyagesRecommandes] = useState<Voyage[]>([])
  const router = useRouter()
  const { token } = useAuth()

  useEffect(() => {
    const fetchVoyagesRecommandes = async () => {

      if (!token) {
        // 🔥 Si pas de token => on redirige vers la page de login
        router.push("/client/auth/login")
        return
      }

      try {
        const data = await VoyageService.getRecommandesVoyages(token)
        console.log(data);

        setVoyagesRecommandes(data)
      } catch (err) {
        console.error(err)
        setError("Erreur lors de la récupération des voyages")
      } finally {
        setLoading(false)
      }
    }

    fetchVoyagesRecommandes()
  }, [router, token]) // 🔥 Exécuter une seule fois au montage

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
      <h1 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">Voyages Recommandés</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {voyagesRecommandes.length > 0 ? (
          voyagesRecommandes.map((voyage) => (
            <VoyageCard key={voyage.id} voyage={voyage} />
          ))
        ) : (
          <div className="text-gray-500 col-span-full text-center">
            Aucun voyage recommandé pour l'instant.
          </div>
        )}
      </div>

    </div>
  )
}
