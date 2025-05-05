"use client"

import type React from "react"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

// Importation dynamique du composant de carte pour éviter les problèmes de SSR
const MapComponent = dynamic(() => import("./MapComponent"), { ssr: false })

interface MapProps {
    searchRadius?: number
}

const Map: React.FC<MapProps> = ({ searchRadius = 500 }) => {
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

    useEffect(() => {
        if (typeof window !== "undefined" && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation([position.coords.latitude, position.coords.longitude])
                },
                () => {
                    setUserLocation([48.8566, 2.3522]) // Valeur par défaut : Paris
                },
            )
        } else {
            // Fallback si la géolocalisation n'est pas disponible
            setUserLocation([48.8566, 2.3522])
        }
    }, [])

    // Mettre à jour le rayon de recherche lorsqu'il change
    useEffect(() => {
        if (typeof window !== "undefined" && userLocation) {
            const event = new CustomEvent("update-search-radius", { detail: { radius: searchRadius } })
            window.dispatchEvent(event)
        }
    }, [searchRadius, userLocation])

    return (
        <div className="w-full h-full">
            {!userLocation ? (
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                </div>
            ) : (
                <MapComponent initialLocation={userLocation} />
            )}
        </div>
    )
}

export default Map

