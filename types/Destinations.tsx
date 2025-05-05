import { Voyage } from "./voyages";

export interface Destination {
    id: number,
    nom: string,
    pays: string,
    description: string,
    latitude: number,
    longitude: number,
    image: string,
    created_at: string,
    updated_at: string,
    popularity: number
    prix_voyages: number[],
    nombre_voyages: number,
    voyages_ids: Voyage[]
}
export interface CreateDestination {
    nom: string,
    pays: string,
    description: string,
    latitude: number,
    longitude: number,
    image?: string
}