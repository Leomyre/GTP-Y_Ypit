"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"

// Données statiques pour l'exemple
const voyages = [
  {
    id: "1",
    nom: "Paris Romantique",
    destination: "Paris",
    dateDepart: "2025-06-15",
    duree: 7,
    prix: 1200,
    placesDisponibles: 20,
    description: "Un séjour romantique dans la ville de l'amour.",
  },
  {
    id: "2",
    nom: "Aventure à Bali",
    destination: "Bali",
    dateDepart: "2025-07-01",
    duree: 10,
    prix: 1800,
    placesDisponibles: 15,
    description: "Découvrez la beauté exotique de Bali.",
  },
]

export default function ModifierVoyage() {
  const router = useRouter()
  const { id } = useParams()
  const [voyage, setVoyage] = useState<any>(null)

  useEffect(() => {
    // Simuler une requête API
    const fetchedVoyage = voyages.find((v) => v.id === id)
    setVoyage(fetchedVoyage)
  }, [id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Logique pour sauvegarder les modifications du voyage
    console.log("Voyage modifié:", voyage)
    router.push("/responsable/tour/voyages")
  }

  if (!voyage) {
    return <div>Chargement...</div>
  }

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
                value={voyage.nom}
                onChange={(e) => setVoyage({ ...voyage, nom: e.target.value })}
              />
            </div>

            <div>
              <label className="block mb-2">Destination</label>
              <Input
                placeholder="Destination"
                value={voyage.destination}
                onChange={(e) => setVoyage({ ...voyage, destination: e.target.value })}
              />
            </div>

            <div>
              <label className="block mb-2">Date de Départ</label>
              <Input
                type="date"
                value={voyage.dateDepart}
                onChange={(e) => setVoyage({ ...voyage, dateDepart: e.target.value })}
              />
            </div>

            <div>
              <label className="block mb-2">Durée (en jours)</label>
              <Input
                type="number"
                min="1"
                value={voyage.duree}
                onChange={(e) => setVoyage({ ...voyage, duree: Number.parseInt(e.target.value) })}
              />
            </div>

            <div>
              <label className="block mb-2">Prix</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={voyage.prix}
                onChange={(e) => setVoyage({ ...voyage, prix: Number.parseFloat(e.target.value) })}
              />
            </div>

            <div>
              <label className="block mb-2">Places Disponibles</label>
              <Input
                type="number"
                min="0"
                value={voyage.placesDisponibles}
                onChange={(e) => setVoyage({ ...voyage, placesDisponibles: Number.parseInt(e.target.value) })}
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

