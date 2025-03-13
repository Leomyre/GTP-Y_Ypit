"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function ResponsableLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Ici, vous devriez implémenter la logique de connexion réelle
    console.log("Tentative de connexion responsable avec:", { email, password })

    // Simuler une requête API
    setTimeout(() => {
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur votre espace responsable !",
      })
      router.push("/responsable/tour/dashboard")
    }, 1000)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connexion Responsable</CardTitle>
          <CardDescription>
            Connectez-vous à votre compte responsable pour gérer votre agence de voyage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Se connecter
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/responsable/auth/register" className="text-sm text-blue-600 hover:underline">
            Pas encore de compte ? S&aposinscrire
          </Link>
          <Link href="/responsable/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
            Mot de passe oublié ?
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

