"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Minus } from "lucide-react"

// Données statiques pour l'exemple (à remplacer par un appel API réel)
const voyages = [
  { id: "1", nom: "Paris Romantique" },
  { id: "2", nom: "Aventure à Bali" },
]

export default function AjouterTrajet() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const voyageId = searchParams.get("voyageId")
  const [selectedVoyage, setSelectedVoyage] = useState(voyageId || "")
  const [etapes, setEtapes] = useState([{ moyen: "", de: "", a: "", duree: "" }])

  useEffect(() => {
    if (voyageId) {
      setSelectedVoyage(voyageId)
    }
  }, [voyageId])

  const ajouterEtape = () => {
    setEtapes([...etapes, { moyen: "", de: "", a: "", duree: "" }])
  }

  const supprimerEtape = (index: number) => {
    const nouvellesEtapes = etapes.filter((_, i) => i !== index)
    setEtapes(nouvellesEtapes)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Logique pour sauvegarder le nouveau trajet
    console.log("Nouveau trajet:", { voyageId: selectedVoyage, etapes })
    router.push("/responsable/tour/trajets")
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour
      </Button>

      <h1 className="text-3xl font-bold">Ajouter un Nouveau Trajet</h1>

      <Card>
        <CardHeader>
          <CardTitle>Détails du Trajet</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">Nom du Trajet</label>
              <Input placeholder="Nom du trajet" />
            </div>

            <div>
              <label className="block mb-2">Voyage Associé</label>
              <Select value={selectedVoyage} onValueChange={setSelectedVoyage}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un voyage" />
                </SelectTrigger>
                <SelectContent>
                  {voyages.map((voyage) => (
                    <SelectItem key={voyage.id} value={voyage.id}>
                      {voyage.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {etapes.map((etape, index) => (
              <div key={index} className="space-y-2 p-4 border rounded">
                <h3 className="font-semibold">Étape {index + 1}</h3>
                <Select
                  value={etape.moyen}
                  onValueChange={(value) => {
                    const newEtapes = [...etapes]
                    newEtapes[index].moyen = value
                    setEtapes(newEtapes)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Moyen de transport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bus">Bus</SelectItem>
                    <SelectItem value="train">Train</SelectItem>
                    <SelectItem value="avion">Avion</SelectItem>
                    <SelectItem value="bateau">Bateau</SelectItem>
                    <SelectItem value="velo">Vélo</SelectItem>
                    <SelectItem value="marche">À pied</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="De"
                  value={etape.de}
                  onChange={(e) => {
                    const newEtapes = [...etapes]
                    newEtapes[index].de = e.target.value
                    setEtapes(newEtapes)
                  }}
                />
                <Input
                  placeholder="À"
                  value={etape.a}
                  onChange={(e) => {
                    const newEtapes = [...etapes]
                    newEtapes[index].a = e.target.value
                    setEtapes(newEtapes)
                  }}
                />
                <Input
                  placeholder="Durée"
                  value={etape.duree}
                  onChange={(e) => {
                    const newEtapes = [...etapes]
                    newEtapes[index].duree = e.target.value
                    setEtapes(newEtapes)
                  }}
                />
                {index > 0 && (
                  <Button type="button" variant="destructive" onClick={() => supprimerEtape(index)}>
                    <Minus className="mr-2 h-4 w-4" /> Supprimer cette étape
                  </Button>
                )}
              </div>
            ))}

            <Button type="button" onClick={ajouterEtape}>
              <Plus className="mr-2 h-4 w-4" /> Ajouter une étape
            </Button>

            <Button type="submit">Sauvegarder le Trajet</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

