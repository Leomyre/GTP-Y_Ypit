"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import { withAuth } from "@/components/withAuth"
import { useToast } from "@/components/ui/use-toastx"
import { Separator } from "@/components/ui/separator"

const ParametresClient = () => {
  const router = useRouter()
  const { toast } = useToast()

  // État pour les paramètres
  const [parametres, setParametres] = useState({
    suggestions: true,
    notificationsPromotion: false,
    notificationsReservation: true,
    notificationsRappel: true,
    notificationsNouveaute: true,
    modeNuit: false,
    languePreferee: "fr",
    devisePreferee: "EUR",
  })

  // Fonction pour mettre à jour un paramètre
  const updateParametre = (key: string, value: boolean | string) => {
    setParametres((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Fonction pour sauvegarder les paramètres
  const sauvegarderParametres = () => {
    // Dans une implémentation réelle, vous feriez un appel API ici
    // pour sauvegarder les paramètres de l'utilisateur
    console.log("Paramètres sauvegardés:", parametres)

    toast({
      title: "Paramètres sauvegardés",
      description: "Vos préférences ont été mises à jour avec succès.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="outline" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour
          </Button>
          <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">Paramètres</h1>
        </div>
        <Button onClick={sauvegarderParametres} className="flex items-center bg-green-600 hover:bg-green-700">
          <Save className="mr-2 h-4 w-4" />
          Sauvegarder
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Préférences de contenu</CardTitle>
          <CardDescription>Personnalisez le contenu que vous souhaitez voir</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="suggestions">Suggestions de voyage</Label>
              <p className="text-sm text-muted-foreground">
                Activer les suggestions de voyage basées sur vos préférences
              </p>
            </div>
            <Switch
              id="suggestions"
              checked={parametres.suggestions}
              onCheckedChange={(checked) => updateParametre("suggestions", checked)}
            />
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-4">Notifications</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notificationsPromotion">Promotions</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications pour les offres spéciales et promotions
                  </p>
                </div>
                <Switch
                  id="notificationsPromotion"
                  checked={parametres.notificationsPromotion}
                  onCheckedChange={(checked) => updateParametre("notificationsPromotion", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notificationsReservation">Réservations</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications concernant vos réservations
                  </p>
                </div>
                <Switch
                  id="notificationsReservation"
                  checked={parametres.notificationsReservation}
                  onCheckedChange={(checked) => updateParametre("notificationsReservation", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notificationsRappel">Rappels</Label>
                  <p className="text-sm text-muted-foreground">Recevoir des rappels pour vos voyages à venir</p>
                </div>
                <Switch
                  id="notificationsRappel"
                  checked={parametres.notificationsRappel}
                  onCheckedChange={(checked) => updateParametre("notificationsRappel", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notificationsNouveaute">Nouveautés</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications pour les nouvelles destinations et services
                  </p>
                </div>
                <Switch
                  id="notificationsNouveaute"
                  checked={parametres.notificationsNouveaute}
                  onCheckedChange={(checked) => updateParametre("notificationsNouveaute", checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Préférences d&aposaffichage</CardTitle>
          <CardDescription>Personnalisez l&aposapparence de l&aposapplication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="modeNuit">Mode nuit automatique</Label>
              <p className="text-sm text-muted-foreground">
                Activer automatiquement le mode nuit selon l&aposheure de la journée
              </p>
            </div>
            <Switch
              id="modeNuit"
              checked={parametres.modeNuit}
              onCheckedChange={(checked) => updateParametre("modeNuit", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-6">
        <Button onClick={sauvegarderParametres} className="flex items-center bg-green-600 hover:bg-green-700">
          <Save className="mr-2 h-4 w-4" />
          Sauvegarder les modifications
        </Button>
      </div>
    </div>
  )
}

export default withAuth(ParametresClient)

