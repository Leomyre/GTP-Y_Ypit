"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Star } from "lucide-react"
import { withAuth } from "@/components/withAuth"
import { useToast } from "@/components/ui/use-toastx"

const AvisVoyage = () => {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [commentaire, setCommentaire] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez attribuer une note au voyage",
        variant: "destructive",
        createdAt: Date.now()
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simuler un appel API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Dans une implémentation réelle, vous enverriez les données à votre API
      console.log("Avis soumis:", { voyageId: id, rating, commentaire })

      toast({
        title: "Avis envoyé",
        description: "Merci pour votre avis sur ce voyage !",
        createdAt: Date.now()
      })

      router.push(`/client/voyage/${id}`)
    } catch (error) {
      console.log(error);

      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre avis",
        variant: "destructive",
        createdAt: Date.now()
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Donnez votre avis sur ce voyage</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Votre note</label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${star <= (hoverRating || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-500">
                  {rating > 0 ? `${rating} étoile${rating > 1 ? "s" : ""}` : "Aucune note"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="commentaire" className="block text-sm font-medium">
                Votre commentaire
              </label>
              <Textarea
                id="commentaire"
                placeholder="Partagez votre expérience avec ce voyage..."
                rows={5}
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
                  Envoi en cours...
                </>
              ) : (
                "Envoyer mon avis"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default withAuth(AvisVoyage)

