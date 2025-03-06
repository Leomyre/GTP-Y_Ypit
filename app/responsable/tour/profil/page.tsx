"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { ProfilePhotoUpload } from "@/components/ProfilePhotoUpload"

// Données statiques pour l'exemple (à remplacer par un appel API réel)
const initialProfile = {
  nom: "Dubois",
  prenom: "Marie",
  email: "marie.dubois@agencevoyage.com",
  telephone: "0123456789",
  poste: "Responsable des voyages",
  bio: "Passionnée de voyages avec plus de 10 ans d'expérience dans le tourisme.",
  photoUrl: "/placeholder-user.jpg", // URL par défaut, à remplacer par l'URL réelle de la photo de l'utilisateur
}

export default function ProfilResponsable() {
  const [profile, setProfile] = useState(initialProfile)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handlePhotoChange = (file: File) => {
    // Ici, vous enverriez normalement le fichier à votre API
    console.log("Nouvelle photo de profil:", file.name)
    // Simulons un changement d'URL de photo
    setProfile({ ...profile, photoUrl: URL.createObjectURL(file) })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Ici, vous enverriez normalement les données à votre API
    console.log("Profil mis à jour:", profile)
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été enregistrées avec succès.",
    })
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Mon Profil</h1>
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
                <Label htmlFor="nom">Nom</Label>
                <Input id="nom" name="nom" value={profile.nom} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                <Input id="prenom" name="prenom" value={profile.prenom} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={profile.email} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input id="telephone" name="telephone" value={profile.telephone} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="poste">Poste</Label>
              <Input id="poste" name="poste" value={profile.poste} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Biographie</Label>
              <Textarea id="bio" name="bio" value={profile.bio} onChange={handleChange} rows={4} />
            </div>
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Annuler
              </Button>
              <Button type="submit">Enregistrer les modifications</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

