"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Minus } from "lucide-react"

// Données statiques pour l'exemple (à remplacer par un appel API réel)
const trajets = [
  {
    id: "1",
    nom: "Paris Express",
    voyageId: "1",
    etapes: [
      { moyen: "train", de: "Lyon", a: "Paris", duree: "2h" },
      { moyen: "metro", de: "Gare de Lyon", a: "Tour Eiffel", duree: "30min" },
    ],
  },
  {
    id: "2",
    nom: "Paris Scenic",
    voyageId: "1",
    etapes: [
      { moyen: "bus", de: "Lyon", a: "Dijon", duree: "2h" },
      { moyen: "train", de: "Dijon", a: "Paris", duree: "1h30" },
      { moyen: "velo", de: "Gare de Lyon", a: "Notre-Dame", duree: "20min" },
    ],
  },
]

export default function ModifierTrajet() {
  const router = useRouter()
  const { id } = useParams()
  const [trajet, setTrajet] = useState<any>(null)

  useEffect(() => {
    // Simuler une requête API
    const fetchedTrajet = trajets.find((t) => t.id === id)
    setTrajet(fetchedTrajet)
  }, [id])

  const ajouterEtape = () => {
    setTrajet({
      ...trajet,
      etapes: [...trajet.etapes, { moyen: "", de: "", a: "", duree: "" }],
    })
  }

  const supprimerEtape = (index: number) => {
    const nouvellesEtapes = trajet.etapes.filter((_: any, i: number) => i !== index)
    setTrajet({ ...trajet, etapes: nouvellesEtapes })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Logique pour sauvegarder les modifications du trajet
    console.log("Trajet modifié:", trajet)
    router.push("/responsable/tour/trajets")
  }

  if (!trajet) {
    return <div>Chargement...</div>
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour
      </Button>

      <h1 className="text-3xl font-bold">Modifier le Trajet</h1>

      <Card>
        <CardHeader>
          <CardTitle>Détails du Trajet</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">Nom du Trajet</label>
              <Input
                placeholder="Nom du trajet"
                value={trajet.nom}
                onChange={(e) => setTrajet({ ...trajet, nom: e.target.value })}
              />
            </div>

            {trajet.etapes.map((etape: any, index: number) => (
              <div key={index} className="space-y-2 p-4 border rounded">
                <h3 className="font-semibold">Étape {index + 1}</h3>
                <Select
                  value={etape.moyen}
                  onValueChange={(value) => {
                    const newEtapes = [...trajet.etapes]
                    newEtapes[index].moyen = value
                    setTrajet({ ...trajet, etapes: newEtapes })
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
                    const newEtapes = [...trajet.etapes]
                    newEtapes[index].de = e.target.value
                    setTrajet({ ...trajet, etapes: newEtapes })
                  }}
                />
                <Input
                  placeholder="À"
                  value={etape.a}
                  onChange={(e) => {
                    const newEtapes = [...trajet.etapes]
                    newEtapes[index].a = e.target.value
                    setTrajet({ ...trajet, etapes: newEtapes })
                  }}
                />
                <Input
                  placeholder="Durée"
                  value={etape.duree}
                  onChange={(e) => {
                    const newEtapes = [...trajet.etapes]
                    newEtapes[index].duree = e.target.value
                    setTrajet({ ...trajet, etapes: newEtapes })
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

            <Button type="submit">Sauvegarder les Modifications</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

