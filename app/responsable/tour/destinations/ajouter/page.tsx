"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toastx"
import { DestinationService } from "@/services/service-destinations"
import { useAuth } from "@/hooks/useAuth"
import dynamic from "next/dynamic"

// Importation dynamique de la carte
const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false })

export default function AjouterDestinationPage() {
    const [form, setForm] = useState({
        nom: "",
        pays: "",
        description: "",
        latitude: "",
        longitude: "",
        image: null as File | null,
    })

    const { toast } = useToast()
    const router = useRouter()
    const { token } = useAuth()

    useEffect(() => {
        const handleMapClick = (e: Event) => {
            const { lat, lng } = (e as CustomEvent).detail
            setForm((prev) => ({
                ...prev,
                latitude: lat.toFixed(6),
                longitude: lng.toFixed(6),
            }))
        }

        window.addEventListener("map-click", handleMapClick)
        return () => window.removeEventListener("map-click", handleMapClick)
    }, [])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setForm((prev) => ({
                ...prev,
                image: e.target.files![0],
            }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!token) return

        try {
            const createDestinationPayload = {
                nom: form.nom,
                pays: form.pays,
                description: form.description,
                latitude: form.latitude,
                longitude: form.longitude,
                image: form.image, // Ensure the backend supports handling this field
            }

            await DestinationService.createDestination(createDestinationPayload, token)
            toast({
                title: "Destination ajoutée",
                description: `${form.nom} a été enregistrée avec succès.`,
                createdAt: Date.now()
            })
            router.push("/destinations")
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible d'ajouter la destination.",
                createdAt: Date.now()
            })
            console.error(err)
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <Button
                variant="outline"
                type="button"
                onClick={() => router.back()} // ou router.push('/destinations') pour une redirection fixe
                className="mb-4"
            >
                ← Retour
            </Button>
            <h1 className="text-3xl font-bold mb-6">Ajouter une destination</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="nom">Nom</Label>
                    <Input id="nom" name="nom" value={form.nom} onChange={handleChange} required />
                </div>
                <div>
                    <Label htmlFor="pays">Pays</Label>
                    <Input id="pays" name="pays" value={form.pays} onChange={handleChange} required />
                </div>
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <Label htmlFor="image">Image</Label>
                    <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                </div>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input
                            id="latitude"
                            name="latitude"
                            value={form.latitude}
                            readOnly
                        />
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input
                            id="longitude"
                            name="longitude"
                            value={form.longitude}
                            readOnly
                        />
                    </div>
                </div>
                <div>
                    <Label>Choisir une localisation sur la carte</Label>
                    <MapComponent initialLocation={[-18.8792, 47.5079]} />
                </div>
                <Button type="submit" className="mt-4">
                    Ajouter la destination
                </Button>
            </form>
        </div>
    )
}
