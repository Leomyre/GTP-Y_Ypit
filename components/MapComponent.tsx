"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

type MapComponentProps = {
    initialLocation: [number, number]
}

const MapComponent: React.FC<MapComponentProps> = ({ initialLocation }) => {
    const mapRef = useRef<HTMLDivElement | null>(null)
    const leafletMapRef = useRef<L.Map | null>(null)
    const markerRef = useRef<L.Marker | null>(null)

    useEffect(() => {
        if (leafletMapRef.current) {
            leafletMapRef.current.on('click', (e) => {
                const { lat, lng } = e.latlng;
                console.log('Coordonnées sélectionnées:', lat, lng);

                // Émettre un événement personnalisé
                const event = new CustomEvent('map-click', { detail: { lat, lng } });
                window.dispatchEvent(event);
            });
        }
    }, []);

    useEffect(() => {
        if (mapRef.current && !leafletMapRef.current) {
            // Initialiser la carte
            leafletMapRef.current = L.map(mapRef.current).setView(initialLocation, 5)

            // Ajouter la couche de tuiles
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; OpenStreetMap contributors",
            }).addTo(leafletMapRef.current)

            // Ajouter un marqueur pour la position initiale
            markerRef.current = L.marker(initialLocation).addTo(leafletMapRef.current)
            markerRef.current.bindPopup("Votre position").openPopup()

            // Ajouter un gestionnaire d'événements pour les clics sur la carte
            leafletMapRef.current.on("click", (e) => {
                const { lat, lng } = e.latlng
                console.log("Coordonnées sélectionnées:", lat, lng)

                // Mettre à jour le marqueur
                if (markerRef.current) {
                    markerRef.current.setLatLng([lat, lng])
                    markerRef.current.bindPopup("Position sélectionnée").openPopup()
                }

                // Émettre un événement personnalisé pour la communication avec le composant parent
                const event = new CustomEvent("map-click", { detail: { lat, lng } })
                window.dispatchEvent(event)
            })

            // Ajouter un cercle pour indiquer la zone de recherche (sera mis à jour lors des clics)
            const searchCircle = L.circle(initialLocation, {
                color: "teal",
                fillColor: "teal",
                fillOpacity: 0.1,
                radius: 100000, // 100km par défaut
            }).addTo(leafletMapRef.current)

            // Écouter les événements de mise à jour du rayon de recherche
            window.addEventListener("update-search-radius", ((e: CustomEvent) => {
                const radius = e.detail.radius * 1000 // Convertir km en mètres
                searchCircle.setRadius(radius)
                if (markerRef.current) {
                    searchCircle.setLatLng(markerRef.current.getLatLng())
                }
            }) as EventListener)
        }

        // Nettoyage lors du démontage du composant
        return () => {
            if (leafletMapRef.current) {
                leafletMapRef.current.remove()
                leafletMapRef.current = null
            }
            window.removeEventListener("update-search-radius", (() => { }) as EventListener)
        }
    }, [initialLocation])

    return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />
}

export default MapComponent

