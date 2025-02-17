"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"

export default function AjouterVoyage() {
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Logique pour sauvegarder le nouveau voyage
    console.log("Nouveau voyage sauvegardé")
    router.push("/responsable/tour/voyages")
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour
      </Button>

      <h1 className="text-3xl font-bold">Ajouter un Nouveau Voyage</h1>

      <Card>
        <CardHeader>
          <CardTitle>Détails du Voyage</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">Nom du Voyage</label>
              <Input placeholder="Nom du voyage" />
            </div>

            <div>
              <label className="block mb-2">Destination</label>
              <Input placeholder="Destination" />
            </div>

            <div>
              <label className="block mb-2">Date de Départ</label>
              <Input type="date" />
            </div>

            <div>
              <label className="block mb-2">Durée (en jours)</label>
              <Input type="number" min="1" />
            </div>

            <div>
              <label className="block mb-2">Prix</label>
              <Input type="number" min="0" step="0.01" />
            </div>

            <div>
              <label className="block mb-2">Places Disponibles</label>
              <Input type="number" min="0" />
            </div>

            <div>
              <label className="block mb-2">Description</label>
              <Textarea placeholder="Description du voyage" />
            </div>

            <Button type="submit">Sauvegarder le Voyage</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

