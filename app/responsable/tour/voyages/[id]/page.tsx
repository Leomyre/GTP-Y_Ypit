"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Plus, Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { VoyageDetails } from "@/components/VoyageDetails"

export default function Page() {
  const router = useRouter()
  const { id } = useParams()

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>

        <div className="flex gap-2">
          <Button onClick={() => router.push(`/responsable/tour/voyages/${id}/modifier`)}>
            <Edit className="mr-2 h-4 w-4" /> Modifier
          </Button>
          <Button onClick={() => router.push(`/responsable/tour/programme/ajouter?voyageId=${id}`)}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter un programme
          </Button>
          <Button variant="destructive">
            <Trash className="mr-2 h-4 w-4" /> Supprimer
          </Button>
        </div>
      </div>

      <VoyageDetails />
    </div>
  )
}
