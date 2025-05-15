"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Star } from "lucide-react"
import { Destination } from "@/types/Destinations"

interface DestinationCardProps {
    destination: Destination
    selected?: boolean
    onClick?: () => void
    onShowVoyages?: () => void
}

export function DestinationCard({
    destination,
    selected = false,
    onClick,
    onShowVoyages
}: DestinationCardProps) {
    const prixVoyages = destination.voyages_ids.map(v => parseFloat(v.prix.toString()))
    const minPrice = prixVoyages.length > 0 ? Math.min(...prixVoyages) : 0
    const maxPrice = prixVoyages.length > 0 ? Math.max(...prixVoyages) : 0

    return (
        <Card
            className={`h-full transition-shadow cursor-pointer hover:shadow-lg ${selected ? "ring-2 ring-teal-500" : ""
                }`}
            onClick={onClick}
        >
            <div className="relative h-40">
                <Image
                    src={destination.image || "http://localhost:8000/voyages/b2df7fb10f2f2321750985e7977a04b8a5dc7c26r1-1280-720v2_hq_52GV00G.jpg"}
                    alt={destination.nom}
                    fill
                    className="object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-white dark:bg-gray-800 rounded-full px-2 py-1 text-xs flex items-center">
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                    <span>{destination.popularity}</span>
                </div>
            </div>
            <CardContent className="p-4">
                <h3 className="font-bold text-lg line-clamp-1">{destination.nom}</h3>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{destination.pays}</span>
                </div>
                <p className="text-sm mt-2 line-clamp-2 text-gray-600 dark:text-gray-300">
                    {destination.description}
                </p>
                <div className="flex justify-between items-center mt-4">
                    <span className="text-sm font-medium">
                        {minPrice} € - {maxPrice} €
                    </span>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                            e.stopPropagation()
                            onShowVoyages?.()
                        }}
                    >
                        Voyages ({destination.voyages_ids.length})
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}