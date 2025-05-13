"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import { FormSkeleton } from "@/components/skeletons/form-skeleton"
import { VoyageService } from "@/services/service-voyages"
import { DestinationService } from "@/services/service-destinations"
import { useAuth } from "@/hooks/useAuth"
import { UpdateVoyage } from "@/types/voyages"
import { Destination } from "@/types/Destinations"


export default function ModifierVoyage() {
  const router = useRouter()
  const { id } = useParams()
  const [voyage, setVoyage] = useState<UpdateVoyage | null>(null)
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await DestinationService.getDestinations();
        setDestinations(data);
      } catch (err) {
        console.error("Erreur lors du chargement des destinations:", err);
      }
    };
    fetchDestinations();
  }, []);

  useEffect(() => {
    const fetchVoyage = async () => {
      try {
        const fetchedVoyage = await VoyageService.getVoyageDetails(Number(id))
        setVoyage(fetchedVoyage)
      } catch (error) {
        console.error("Erreur lors du chargement du voyage :", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchVoyage()
    }
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!token) {
        console.error("Token manquant")
        return
      }

      if (voyage) {
        await VoyageService.updateVoyage(Number(id), voyage, token)
      } else {
        console.error("Voyage is null")
      }
      router.push("/responsable/tour/voyages")
    } catch (error) {
      console.error("Erreur lors de la modification du voyage :", error)
    }
  }


  if (loading) {
    return <FormSkeleton />
  }

  if (!voyage) {
    return <div>Voyage non trouvé</div>
  }
  console.log(voyage);


  return (
    <div className="container mx-auto p-4 space-y-6">
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour
      </Button>

      <h1 className="text-3xl font-bold">Modifier le Voyage</h1>

      <Card>
        <CardHeader>
          <CardTitle>Détails du Voyage</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">Nom du Voyage</label>
              <Input
                placeholder="Nom du voyage"
                value={voyage.titre}
                onChange={(e) => setVoyage({ ...voyage, titre: e.target.value })}
              />
            </div>

            <div>
              <label className="block mb-2">Destination</label>
              <select
                value={voyage.destination_id}
                onChange={(e) => setVoyage({ ...voyage, destination_id: Number(e.target.value) })}
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="">Sélectionnez une destination</option>
                {destinations.length === 0 ? (
                  <option disabled>Aucune destination disponible</option>
                ) : (
                  destinations.map((dest) => (
                    <option key={dest.id} value={dest.id}>
                      {dest.nom}
                    </option>
                  ))
                )}
              </select>
            </div>


            <div>
              <label className="block mb-2">Prix</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={voyage.prix}
                onChange={(e) => setVoyage({ ...voyage, prix: Number.parseFloat(e.target.value).toString() })}
              />
            </div>

            <div>
              <label className="block mb-2">Description</label>
              <Textarea
                placeholder="Description du voyage"
                value={voyage.description}
                onChange={(e) => setVoyage({ ...voyage, description: e.target.value })}
              />
            </div>

            <Button type="submit">Sauvegarder les Modifications</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

