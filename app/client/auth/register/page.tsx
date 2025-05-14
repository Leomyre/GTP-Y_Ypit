"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toastx"
import { useAuth } from "@/hooks/useAuth"

export default function ClientRegister() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
    nationality: "",
    age: "",
    city: "",
    country: "",
    phoneNumber: "",
  })
  const router = useRouter()
  const { toast } = useToast()
  const { register } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }))
  }

  // Modifier la fonction handleSubmit pour inclure password2 et utiliser le bon format user_type
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
        createdAt: Date.now()
      })
      return
    }

    // Créer un objet avec le format exact attendu par le backend
    const registerData = {
      name: formData.username, // Use username as the name field
      email: formData.email,
      username: formData.username,
      password: formData.password,
      password2: formData.confirmPassword, // Ajouter password2 comme confirmPassword
      user_type: "Client", // Utiliser "Client" au lieu de "CLIENT"
      gender: formData.gender || "",
      nationality: formData.nationality || "",
      age: formData.age ? Number.parseInt(formData.age) : null,
      city: formData.city || "",
      country: formData.country || "",
      phone_number: formData.phoneNumber || "",
    }

    console.log("Tentative d'inscription avec:", registerData)

    try {
      const result = await register(registerData)
      console.log("Résultat de l'inscription:", result)

      toast({
        title: "Inscription réussie",
        description: "Vérifiez votre email pour activer votre compte.",
        createdAt: Date.now()
      })

      router.push("/client/auth/verify-email?email=" + encodeURIComponent(formData.email))
    } catch (error) {
      console.error("Erreur d'inscription:", error)

      // Afficher un message d'erreur plus précis
      let errorMessage = "Une erreur est survenue lors de l'inscription."

      if (error instanceof Error && error.message) {
        errorMessage = error.message
      }

      toast({
        title: "Erreur d'inscription",
        description: errorMessage,
        variant: "destructive",
        createdAt: Date.now()
      })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Inscription Client</CardTitle>
          <CardDescription>Créez votre compte client pour commencer à réserver vos voyages.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Nom d&aposutilisateur</Label>
              <Input id="username" name="username" value={formData.username} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Genre</Label>
              <Select onValueChange={handleGenderChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Homme">Homme</SelectItem>
                  <SelectItem value="Femme">Femme</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationalité</Label>
              <Input id="nationality" name="nationality" value={formData.nationality} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Âge</Label>
              <Input id="age" name="age" type="number" value={formData.age} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Ville</Label>
              <Input id="city" name="city" value={formData.city} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Pays</Label>
              <Input id="country" name="country" value={formData.country} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            <Button type="submit" className="w-full">
              S&aposinscrire
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Link href="/client/auth/login" className="text-sm text-blue-600 hover:underline">
            Déjà un compte ? Se connecter
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

