"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { VoyageService } from "@/services/service-voyages"
import { Voyage } from "@/types/voyages"

type Etape = {
  jour: number
  titre: string
  activite: string
  lieu: string
  repas_inclus: string
}

export default function Ajouterprogramme() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const voyageId = searchParams.get("voyageId")
  const [selectedVoyage, setSelectedVoyage] = useState(voyageId || "")
  const [nomProgramme, setNomProgramme] = useState("")
  const [etape, setEtape] = useState<Etape>({
    jour: 1,
    titre: "",
    activite: "",
    lieu: "",
    repas_inclus: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [voyages, setVoyages] = useState<Voyage[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { token } = useAuth()


  useEffect(() => {
    const fetchVoyages = async () => {
      try {
        const data = await VoyageService.getVoyages()
        setVoyages(data)
        setLoading(false)
      } catch (err) {
        setError("Erreur lors de la récupération des voyages")
        setLoading(false)
        console.error(err)
      }
    }

    fetchVoyages()
  }, [])

  useEffect(() => {
    if (voyageId) {
      setSelectedVoyage(voyageId)
    }
  }, [voyageId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")
    setSuccessMessage("")

    const programmeData = {
      voyage: selectedVoyage,
      jour: etape.jour,
      titre: etape.titre,
      activite: etape.activite,
      lieu: etape.lieu,
      repas_inclus: etape.repas_inclus
    }


    if (!token) {
      setErrorMessage("Vous devez être connecté pour effectuer cette action.")
      return
    }


    try {
      console.log("Payload envoyé:", programmeData)

      const response = await VoyageService.createProgrammeJour(Number(selectedVoyage), programmeData, token)


      if (response.ok) {
        setSuccessMessage("Programme ajouté avec succès !")
        router.push("/responsable/tour/programme")
      } else {
        const data = await response.json()
        console.log(data);

        setErrorMessage(data?.detail || "Erreur lors de la création du programme.")
      }
    } catch (error) {
      setErrorMessage("Erreur de connexion au serveur.")
      console.log("Erreur:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour
      </Button>

      <h1 className="text-3xl font-bold">Ajouter un Nouveau programme</h1>

      <Card>
        <CardHeader>
          <CardTitle>Détails du programme</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">Nom du programme</label>
              <Input
                placeholder="Nom du programme"
                value={nomProgramme}
                onChange={(e) => setNomProgramme(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-2">Voyage Associé</label>
              <Select value={selectedVoyage} onValueChange={setSelectedVoyage}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un voyage" />
                </SelectTrigger>
                <SelectContent>
                  {voyages.map((voyage) => (
                    <SelectItem key={voyage.id} value={voyage.id.toString()}>
                      {voyage.titre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 p-4 border rounded">
              <h3 className="font-semibold">Étape</h3>
              <Input
                type="number"
                placeholder="Jour"
                value={etape.jour}
                onChange={(e) => setEtape({ ...etape, jour: parseInt(e.target.value) })}
              />
              <Input
                placeholder="Titre de l'étape"
                value={etape.titre}
                onChange={(e) => setEtape({ ...etape, titre: e.target.value })}
              />
              <Input
                placeholder="Activité"
                value={etape.activite}
                onChange={(e) => setEtape({ ...etape, activite: e.target.value })}
              />
              <Input
                placeholder="Lieu"
                value={etape.lieu}
                onChange={(e) => setEtape({ ...etape, lieu: e.target.value })}
              />
              <Input
                placeholder="Repas inclus"
                value={etape.repas_inclus}
                onChange={(e) => setEtape({ ...etape, repas_inclus: e.target.value })}
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Enregistrement..." : "Sauvegarder le programme"}
            </Button>
          </form>

          {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
          {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
