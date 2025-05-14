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
    latitude: string,
    longitude: string,
    image: File | null
}

export interface StatCardProps {
    title: string
    value: string | number
    description?: string
    change?: number // Pourcentage de changement
    loading?: boolean
    icon?: React.ReactNode
    className?: string
}

export interface RevenueStat {
    success: boolean;
    data: {
        totalRevenue: number | null;
        byDestination: Array<{
            id: number;
            nom: string;
            pays: string;
            adult_reservations: number | null;
            child_reservations: number | null;
            adult_revenue: number | null;
            child_revenue: number | null;
            total_revenue: number | null;
        }> | null;
        byCountry: Array<{
            pays: string;
            total_revenue: number | null;
            destination_count: number | null;
            voyage_count: number | null;
        }> | null;
        monthly_trend: Array<{
            month: string;
            total_revenue: number | null;
            reservation_count: number | null;
        }> | null;
    };
}