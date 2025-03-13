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
import { useAuth } from "@/hooks/useAuth"

export default function ClientLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()

  // Mettre à jour la fonction handleSubmit pour mieux gérer les erreurs
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(email, password)
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur votre compte client !",
      })
      // La redirection est gérée dans la fonction login
    } catch (error: any) {
      console.error("Erreur lors de la connexion:", error)

      let errorMessage = "Vérifiez vos identifiants et réessayez."

      // Gérer les erreurs spécifiques de l'API
      if (error.message.includes("credentials")) {
        errorMessage = "Email ou mot de passe incorrect."
      } else if (error.message.includes("verified")) {
        errorMessage = "Votre compte n'est pas encore vérifié. Veuillez vérifier votre email."
        router.push(`/client/auth/verify-email?email=${encodeURIComponent(email)}`)
      }

      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connexion Client</CardTitle>
          <CardDescription>
            Connectez-vous à votre compte client pour accéder à vos réservations et préférences.
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/client/auth/register" className="text-sm text-blue-600 hover:underline">
            Pas encore de compte ? S'inscrire
          </Link>
          <Link href="/client/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
            Mot de passe oublié ?
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

