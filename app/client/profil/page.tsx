"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ProfilePhotoUpload } from "@/components/ProfilePhotoUpload"
import { withAuth } from "@/components/withAuth"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { History, Eye, Bell, LogOut, Settings } from "lucide-react"

const ProfilClient = () => {
  const [profile, setProfile] = useState({
    username: "",
    nationality: "",
    email: "",
    phone_number: "",
    photoUrl: "/placeholder-user.jpg",
  })
  const { toast } = useToast()
  const { user, updateProfile, isAuthLoading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      setProfile({
        username: user.username || "",
        nationality: user.nationality || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        photoUrl: user.photoUrl || "/placeholder-user.jpg",
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handlePhotoChange = (file: File) => {
    // Ici, vous devriez implémenter la logique pour uploader la photo
    console.log("Nouvelle photo de profil:", file.name)
    // Pour l'exemple, on simule juste un changement d'URL
    setProfile({ ...profile, photoUrl: URL.createObjectURL(file) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Adapter les données au format attendu par l'API
      const profileUpdateData = {
        nationality: profile.nationality,
        username: profile.username,
        email: profile.email,
        phone_number: profile.phone_number,
        // Ajouter d'autres champs si nécessaire
      }

      await updateProfile(profileUpdateData)
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès.",
      })
    } catch (error: any) {
      let errorMessage = "Une erreur est survenue lors de la mise à jour du profil."

      // Gérer les erreurs spécifiques
      if (error.message.includes("email")) {
        errorMessage = "Cet email est déjà utilisé ou invalide."
      } else if (error.message.includes("Non authentifié")) {
        errorMessage = "Votre session a expiré. Veuillez vous reconnecter."
        router.push("/client/auth/login")
      }

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  // Afficher un état de chargement si l'authentification est en cours
  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        <p className="ml-3">Chargement du profil...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* En-tête avec le titre et le bouton de déconnexion */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">Mon Profil</h1>
        <Button
          variant="outline"
          className="flex items-center text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
          onClick={() => {
            logout()
            router.push("/client/accueil")
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center mb-6">
              <ProfilePhotoUpload initialPhotoUrl={profile.photoUrl} onPhotoChange={handlePhotoChange} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input id="username" name="username" value={profile.username} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationalité</Label>
                <Input id="nationality" name="nationality" value={profile.nationality} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={profile.email} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number">Téléphone</Label>
              <Input id="phone_number" name="phone_number" value={profile.phone_number} onChange={handleChange} />
            </div>
            <Button type="submit">Mettre à jour le profil</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="mr-2 h-5 w-5 text-green-500" />
              Voyages consultés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Accédez à l'historique des voyages que vous avez consultés en détail.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/client/profil/voyages-consultes")}
            >
              Voir mes voyages consultés
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <History className="mr-2 h-5 w-5 text-green-500" />
              Historique de réservation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Consultez l'historique de vos réservations de voyages.</p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/client/profil/historique-reservations")}
            >
              Voir mon historique de réservation
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5 text-green-500" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Consultez vos notifications et mises à jour importantes.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push("/client/profil/notifications")}>
              Voir mes notifications
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5 text-green-500" />
              Paramètres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Personnalisez vos préférences et réglages de compte.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push("/client/profil/parametres")}>
              Gérer mes paramètres
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default withAuth(ProfilClient)

