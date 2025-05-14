"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toastx"
import { DestinationService } from "@/services/service-destinations"
import { useAuth } from "@/hooks/useAuth"
import dynamic from "next/dynamic"

// Carte chargée dynamiquement
const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false })

export default function ModifierDestinationPage() {
    const router = useRouter()
    const params = useParams()
    const id = params?.id as string
    console.log(id);

    const [form, setForm] = useState({
        nom: "",
        pays: "",
        description: "",
        latitude: "",
        longitude: "",
        image: undefined as File | undefined,
    })

    const { token } = useAuth()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        /* if (!id || !token) return */
        const fetchDestination = async () => {
            try {
                if (!id || !token) {
                    throw new Error("Invalid destination ID");
                }
                const destination = await DestinationService.getDestinationById(id, token)
                setForm({
                    nom: destination.nom || "",
                    pays: destination.pays || "",
                    description: destination.description || "",
                    latitude: destination.latitude?.toString() || "",
                    longitude: destination.longitude?.toString() || "",
                    image: undefined,
                })
                console.log(destination);

            } catch {
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "Impossible de charger la destination.",
                    createdAt: Date.now()
                })
            }
        }
        fetchDestination()
    }, [id, token, toast])

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
        return () => {
            window.removeEventListener("map-click", handleMapClick)
        }
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setForm((prev) => ({
                ...prev,
                image: e.target.files![0],
            }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!id || !token) return

        const formData = new FormData()
        formData.append("nom", form.nom)
        formData.append("pays", form.pays)
        formData.append("description", form.description)
        formData.append("latitude", form.latitude)
        formData.append("longitude", form.longitude)
        if (form.image) {
            formData.append("image", form.image)
        }

        try {
            setLoading(true)
            await DestinationService.updateDestination(id, formData, token)
            toast({
                title: "Destination modifiée",
                description: `${form.nom} a été mise à jour avec succès.`,
                createdAt: Date.now()
            })
            router.push("tour/destinations")
        } catch (err) {
            console.error(err)
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de modifier la destination.",
                createdAt: Date.now()
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">Modifier la destination</h1>

            <Button variant="outline" onClick={() => router.back()} className="mb-4">
                ← Retour
            </Button>

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
                <div className="flex gap-4">
                    <div className="flex-1">
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input id="latitude" name="latitude" value={form.latitude} readOnly />
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input id="longitude" name="longitude" value={form.longitude} readOnly />
                    </div>
                </div>
                <div>
                    <Label>Choisir une localisation sur la carte</Label>
                    <MapComponent initialLocation={[
                        parseFloat(form.latitude) || -18.8792,
                        parseFloat(form.longitude) || 47.5079
                    ]} />
                </div>
                <div>
                    <Label htmlFor="image">Image</Label>
                    <Input type="file" id="image" name="image" onChange={handleImageChange} />
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? "Mise à jour..." : "Enregistrer les modifications"}
                </Button>
            </form>
        </div>
    )
}
