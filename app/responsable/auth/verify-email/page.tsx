"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toastx"
import { useAuth } from "@/hooks/useAuth"

export default function VerifyEmail() {
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const { verifyEmail } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await verifyEmail(email, code)
      toast({
        title: "Email vérifié",
        description: "Votre compte a été activé avec succès.",
      })
      router.push("/client/auth/login")
    } catch (error) {
      toast({
        title: "Erreur de vérification",
        description: "Le code de vérification est incorrect ou a expiré.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Vérification de l&aposemail</CardTitle>
          <CardDescription>Entrez le code de vérification reçu par email pour activer votre compte.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Code de vérification</Label>
              <Input id="code" type="text" value={code} onChange={(e) => setCode(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full">
              Vérifier
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

