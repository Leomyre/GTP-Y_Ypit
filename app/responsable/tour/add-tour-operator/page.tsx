"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toastx"

export default function AddTourOperator() {
  const [formData, setFormData] = useState({
    nom: "",
    adresse: "",
    nif: "",
    stat: "",
    mail: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Ici, vous devriez implémenter la logique d'ajout de Tour Opérateur réelle
    console.log("Données du Tour Opérateur:", formData)

    // Simuler une requête API
    setTimeout(() => {
      toast({
        title: "Tour Opérateur ajouté",
        description: "Le nouveau Tour Opérateur a été ajouté avec succès !",
        createdAt: Date.now()
      })
      router.push("/responsable/tour/dashboard")
    }, 1000)
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Ajouter un Tour Opérateur</CardTitle>
          <CardDescription>Remplissez les informations pour ajouter un nouveau Tour Opérateur.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom de l&aposagence</Label>
              <Input id="nom" name="nom" value={formData.nom} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Input id="adresse" name="adresse" value={formData.adresse} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nif">NIF</Label>
              <Input id="nif" name="nif" value={formData.nif} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stat">STAT</Label>
              <Input id="stat" name="stat" value={formData.stat} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mail">Email</Label>
              <Input id="mail" name="mail" type="email" value={formData.mail} onChange={handleChange} required />
            </div>
            <Button type="submit" className="w-full">
              Ajouter le Tour Opérateur
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

