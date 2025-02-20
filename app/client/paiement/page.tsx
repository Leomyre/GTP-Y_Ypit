"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Paiement() {
  const router = useRouter()
  const [paiement, setPaiement] = useState({
    numeroCarte: "",
    nomCarte: "",
    dateExpiration: "",
    cvc: "",
    methodePaiement: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaiement({ ...paiement, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (value: string) => {
    setPaiement({ ...paiement, methodePaiement: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Ici, vous traiteriez normalement le paiement via votre API
    console.log("Paiement effectué:", paiement)
    alert("Paiement effectué avec succès!")
    router.push("/client/confirmation-reservation")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">Paiement</h1>
      <Card>
        <CardHeader>
          <CardTitle>Informations de paiement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="methodePaiement">Méthode de paiement</Label>
              <Select onValueChange={handleSelectChange} value={paiement.methodePaiement}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une méthode de paiement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="carte">Carte de crédit</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="virement">Virement bancaire</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="numeroCarte">Numéro de carte</Label>
              <Input
                id="numeroCarte"
                name="numeroCarte"
                value={paiement.numeroCarte}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nomCarte">Nom sur la carte</Label>
              <Input
                id="nomCarte"
                name="nomCarte"
                value={paiement.nomCarte}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateExpiration">Date d&aposexpiration</Label>
                <Input
                  id="dateExpiration"
                  name="dateExpiration"
                  value={paiement.dateExpiration}
                  onChange={handleChange}
                  placeholder="MM/YY"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" name="cvc" value={paiement.cvc} onChange={handleChange} placeholder="123" />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Payer maintenant
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

